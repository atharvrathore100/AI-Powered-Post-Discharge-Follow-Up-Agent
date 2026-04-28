import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { TC } from '../../theme/colors';
import TheraCareHeader from '../../components/TheraCareHeader';
import { analyzeDischargeDocument } from '../../services/dischargeAnalysis';

const FEATURES = [
  { icon: 'document-text-outline' as const, label: 'Extract diagnosis & medications' },
  { icon: 'calendar-outline' as const, label: 'Parse follow-up appointments' },
  { icon: 'warning-outline' as const, label: 'Surface warning signs' },
  { icon: 'alarm-outline' as const, label: 'Set smart reminders in one tap' },
];

export default function DischargeHomeScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('Analyzing discharge papers...');

  async function pickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets.length > 0) {
        analyzeUploadedDocument(result.assets[0], result.assets[0].name ?? 'Discharge Paper');
      }
    } catch {
      Alert.alert('Error', 'Could not open document picker.');
    }
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Allow photo access to upload discharge papers.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (!result.canceled && result.assets.length > 0) {
      analyzeUploadedDocument(result.assets[0], 'Discharge Photo');
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Allow camera access to photograph discharge papers.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.85 });
    if (!result.canceled && result.assets.length > 0) {
      analyzeUploadedDocument(result.assets[0], 'Discharge Photo');
    }
  }

  async function analyzeUploadedDocument(asset: any, fallbackName: string) {
    setLoading(true);
    setLoadingLabel(`Analyzing ${fallbackName}...`);

    try {
      const result = await analyzeDischargeDocument(asset, fallbackName);
      setLoading(false);
      navigation.navigate('DischargeAnalysis', {
        fileName: result.fileName || fallbackName,
        parsedDischarge: result.parsedDischarge,
        model: result.model,
      });
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Analysis Failed',
        error instanceof Error
          ? `${error.message}\n\nMake sure the API server is running with npm run api and your OPENAI_API_KEY is set in .env.`
          : 'Could not analyze this discharge document.'
      );
    }
  }

  function startSampleAnalysis(fileName: string) {
    setLoading(true);
    setLoadingLabel('Loading sample discharge analysis...');
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('DischargeAnalysis', { fileName, isSample: true });
    }, 700);
  }

  return (
    <View style={styles.container}>
      <TheraCareHeader title="Discharge Analysis" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Hero badge */}
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>Post-Discharge Add-On</Text>
        </View>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="scan" size={38} color={TC.teal} />
          </View>
          <Text style={styles.heroTitle}>Analyze Your{'\n'}Discharge Papers</Text>
          <Text style={styles.heroSub}>
            Upload or photograph your hospital discharge documents. TheraCare AI will extract key information and help you set up reminders.
          </Text>
        </View>

        {/* Feature list */}
        <View style={styles.featureCard}>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name={f.icon} size={18} color={TC.teal} />
              </View>
              <Text style={styles.featureText}>{f.label}</Text>
            </View>
          ))}
        </View>

        {/* Upload buttons */}
        <Text style={styles.uploadLabel}>Choose a method to upload</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={pickDocument} activeOpacity={0.85} disabled={loading}>
          <Ionicons name="document-attach-outline" size={22} color="#fff" />
          <Text style={styles.primaryBtnText}>Upload PDF Document</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage} activeOpacity={0.85} disabled={loading}>
            <Ionicons name="images-outline" size={20} color={TC.teal} />
            <Text style={styles.secondaryBtnText}>Photo Library</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={takePhoto} activeOpacity={0.85} disabled={loading}>
            <Ionicons name="camera-outline" size={20} color={TC.teal} />
            <Text style={styles.secondaryBtnText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Loading overlay inline */}
        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={TC.teal} />
            <Text style={styles.loadingText}>{loadingLabel}</Text>
            <Text style={styles.loadingSubText}>TheraCare AI is extracting structured care instructions</Text>
          </View>
        )}

        {/* Demo button */}
        {!loading && (
          <TouchableOpacity
            style={styles.demoBtn}
            onPress={() => startSampleAnalysis('Demo Discharge')}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-outline" size={16} color={TC.textSecondary} />
            <Text style={styles.demoBtnText}>Try with sample discharge paper</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TC.bg },
  scroll: { flex: 1 },
  content: { padding: 16 },

  heroBadge: {
    alignSelf: 'center',
    backgroundColor: TC.teal,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginBottom: 14,
  },
  heroBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

  heroCard: {
    backgroundColor: TC.bgCard,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  heroIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: TC.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: TC.tealAI,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: TC.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: TC.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },

  featureCard: {
    backgroundColor: TC.bgCard,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: TC.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: { fontSize: 14, color: TC.textPrimary, fontWeight: '500', flex: 1 },

  uploadLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TC.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: TC.teal,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 12,
    shadowColor: TC.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  secondaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: TC.teal,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: TC.bgCard,
  },
  secondaryBtnText: { color: TC.teal, fontSize: 14, fontWeight: '600' },

  loadingCard: {
    backgroundColor: TC.bgCard,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: { fontSize: 16, fontWeight: '700', color: TC.textPrimary },
  loadingSubText: { fontSize: 13, color: TC.textMuted, textAlign: 'center' },

  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  demoBtnText: { fontSize: 14, color: TC.textSecondary, textDecorationLine: 'underline' },
});
