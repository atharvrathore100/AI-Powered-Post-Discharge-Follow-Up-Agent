const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const multer = require('multer');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());

const dischargeSchema = {
  type: 'object',
  additionalProperties: false,
  required: [
    'patientName',
    'patientDOB',
    'mrn',
    'admittedDate',
    'dischargedDate',
    'hospital',
    'dischargingPhysician',
    'primaryDiagnosis',
    'secondaryDiagnoses',
    'procedures',
    'dischargeMedications',
    'followUpAppointments',
    'followUpInstructions',
    'warningSigns',
    'activityRestrictions',
    'dietInstructions',
  ],
  properties: {
    patientName: { type: 'string' },
    patientDOB: { type: 'string' },
    mrn: { type: 'string' },
    admittedDate: { type: 'string' },
    dischargedDate: { type: 'string' },
    hospital: { type: 'string' },
    dischargingPhysician: { type: 'string' },
    primaryDiagnosis: { type: 'string' },
    secondaryDiagnoses: {
      type: 'array',
      items: { type: 'string' },
    },
    procedures: {
      type: 'array',
      items: { type: 'string' },
    },
    dischargeMedications: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'dose', 'frequency', 'duration', 'purpose'],
        properties: {
          name: { type: 'string' },
          dose: { type: 'string' },
          frequency: { type: 'string' },
          duration: { type: 'string' },
          purpose: { type: 'string' },
        },
      },
    },
    followUpAppointments: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'provider', 'specialty', 'date', 'time', 'location', 'phone'],
        properties: {
          id: { type: 'string' },
          provider: { type: 'string' },
          specialty: { type: 'string' },
          date: { type: 'string' },
          time: { type: 'string' },
          location: { type: 'string' },
          phone: { type: 'string' },
        },
      },
    },
    followUpInstructions: {
      type: 'array',
      items: { type: 'string' },
    },
    warningSigns: {
      type: 'array',
      items: { type: 'string' },
    },
    activityRestrictions: {
      type: 'array',
      items: { type: 'string' },
    },
    dietInstructions: {
      type: 'array',
      items: { type: 'string' },
    },
  },
};

const analysisPrompt = `
You are a careful clinical document extraction assistant for a post-discharge follow-up prototype.
Extract only information that is present in the uploaded discharge document.
Do not invent medical facts, appointments, procedures, providers, or phone numbers.
If a field is missing, return an empty string for scalar fields and an empty array for list fields.
Convert medication instructions into name, dose, frequency, duration, and purpose when possible.
Put return precautions, red flags, and emergency symptoms in warningSigns.
Put follow-up tasks that are not exact appointments in followUpInstructions.
Use patient-friendly wording, but preserve clinical meaning.
This output is informational and does not replace a clinician.
`;

function guessMimeType(fileName, suppliedMimeType) {
  if (suppliedMimeType && suppliedMimeType !== 'application/octet-stream') {
    return suppliedMimeType;
  }

  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.gif')) return 'image/gif';
  if (lower.endsWith('.txt')) return 'text/plain';
  if (lower.endsWith('.json')) return 'application/json';
  if (lower.endsWith('.docx')) {
    return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  }
  return suppliedMimeType || 'application/octet-stream';
}

function buildOpenAIFileInput(file) {
  const fileName = file.originalname || 'discharge-document';
  const mimeType = guessMimeType(fileName, file.mimetype);
  const base64 = file.buffer.toString('base64');

  if (mimeType.startsWith('image/')) {
    return {
      type: 'input_image',
      image_url: `data:${mimeType};base64,${base64}`,
      detail: 'high',
    };
  }

  return {
    type: 'input_file',
    filename: fileName,
    file_data: `data:${mimeType};base64,${base64}`,
  };
}

function normalizeParsedDischarge(parsed) {
  return {
    patientName: parsed.patientName || '',
    patientDOB: parsed.patientDOB || '',
    mrn: parsed.mrn || '',
    admittedDate: parsed.admittedDate || '',
    dischargedDate: parsed.dischargedDate || '',
    hospital: parsed.hospital || '',
    dischargingPhysician: parsed.dischargingPhysician || '',
    primaryDiagnosis: parsed.primaryDiagnosis || '',
    secondaryDiagnoses: Array.isArray(parsed.secondaryDiagnoses) ? parsed.secondaryDiagnoses : [],
    procedures: Array.isArray(parsed.procedures) ? parsed.procedures : [],
    dischargeMedications: Array.isArray(parsed.dischargeMedications) ? parsed.dischargeMedications : [],
    followUpAppointments: Array.isArray(parsed.followUpAppointments)
      ? parsed.followUpAppointments.map((appointment, index) => ({
          id: appointment.id || `appt-${index + 1}`,
          provider: appointment.provider || '',
          specialty: appointment.specialty || '',
          date: appointment.date || '',
          time: appointment.time || '',
          location: appointment.location || '',
          phone: appointment.phone || '',
        }))
      : [],
    followUpInstructions: Array.isArray(parsed.followUpInstructions) ? parsed.followUpInstructions : [],
    warningSigns: Array.isArray(parsed.warningSigns) ? parsed.warningSigns : [],
    activityRestrictions: Array.isArray(parsed.activityRestrictions) ? parsed.activityRestrictions : [],
    dietInstructions: Array.isArray(parsed.dietInstructions) ? parsed.dietInstructions : [],
  };
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    model,
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
  });
});

app.post('/api/analyze-discharge', upload.single('file'), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: 'OPENAI_API_KEY is missing. Add it to TheraCare_PostDischarge/.env and restart the API server.',
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No discharge document was uploaded.' });
    }

    const fileInput = buildOpenAIFileInput(req.file);
    const response = await openai.responses.create({
      model,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: analysisPrompt }],
        },
        {
          role: 'user',
          content: [
            fileInput,
            {
              type: 'input_text',
              text: 'Analyze this hospital discharge document and return structured JSON matching the schema.',
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'parsed_discharge',
          strict: true,
          schema: dischargeSchema,
        },
      },
    });

    const parsed = JSON.parse(response.output_text);
    res.json({
      fileName: req.file.originalname,
      model,
      parsedDischarge: normalizeParsedDischarge(parsed),
    });
  } catch (error) {
    console.error('Discharge analysis failed:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Discharge analysis failed.',
    });
  }
});

app.listen(port, () => {
  console.log(`TheraCare analysis API running on http://localhost:${port}`);
});
