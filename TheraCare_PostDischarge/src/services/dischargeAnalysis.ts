import { Platform } from 'react-native';
import { ANALYZE_DISCHARGE_URL } from '../config/api';
import { ParsedDischarge } from '../data/mockData';

type UploadAsset = {
  uri: string;
  name?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  type?: string | null;
  file?: unknown;
};

export type DischargeAnalysisResult = {
  fileName: string;
  model?: string;
  parsedDischarge: ParsedDischarge;
};

function guessMimeType(fileName: string, suppliedMimeType?: string | null) {
  if (suppliedMimeType) return suppliedMimeType;

  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'application/octet-stream';
}

async function appendAssetToForm(formData: FormData, asset: UploadAsset, fallbackName: string) {
  const fileName = asset.name || asset.fileName || fallbackName;
  const mimeType = guessMimeType(fileName, asset.mimeType || asset.type);

  if (Platform.OS === 'web') {
    const maybeFile = asset.file;
    if (typeof Blob !== 'undefined' && maybeFile instanceof Blob) {
      formData.append('file', maybeFile, fileName);
      return;
    }

    const response = await fetch(asset.uri);
    const blob = await response.blob();
    formData.append('file', blob, fileName);
    return;
  }

  formData.append('file', {
    uri: asset.uri,
    name: fileName,
    type: mimeType,
  } as unknown as Blob);
}

export async function analyzeDischargeDocument(
  asset: UploadAsset,
  fallbackName = 'discharge-document.pdf'
): Promise<DischargeAnalysisResult> {
  const formData = new FormData();
  await appendAssetToForm(formData, asset, fallbackName);

  const response = await fetch(ANALYZE_DISCHARGE_URL, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });

  let data: Partial<DischargeAnalysisResult> & { error?: string };
  try {
    data = await response.json();
  } catch {
    throw new Error(`Unexpected response from the analysis API at ${ANALYZE_DISCHARGE_URL}.`);
  }

  if (!response.ok) {
    throw new Error(data.error || 'Could not analyze the discharge document.');
  }

  return data as DischargeAnalysisResult;
}
