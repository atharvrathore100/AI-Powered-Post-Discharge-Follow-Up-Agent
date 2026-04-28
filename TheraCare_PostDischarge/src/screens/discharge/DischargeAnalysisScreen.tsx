import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TC } from '../../theme/colors';
import TheraCareHeader from '../../components/TheraCareHeader';
import { ParsedDischarge, mockParsedDischarge } from '../../data/mockData';

async function scheduleReminder(title: string, body: string, secondsFromNow: number) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Notifications Disabled', 'Enable notifications in Settings to receive reminders.');
    return false;
  }
  const trigger = new Date(Date.now() + secondsFromNow * 1000);
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: true },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
  });
  return true;
}

type ReminderSet = Record<string, boolean>;

export default function DischargeAnalysisScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const fileName = route.params?.fileName ?? 'Discharge Paper';
  const d: ParsedDischarge = route.params?.parsedDischarge ?? mockParsedDischarge;
  const model = route.params?.model;
  const isSample = route.params?.isSample;
  const [remindersSet, setRemindersSet] = useState<ReminderSet>({});

  async function handleMedReminder(medName: string, key: string) {
    const ok = await scheduleReminder(
      `Medication Reminder`,
      `Time to take ${medName}`,
      10
    );
    if (ok) {
      setRemindersSet((prev) => ({ ...prev, [key]: true }));
      Alert.alert('Reminder Set', `Test notification fires in 10 seconds. In production this would be daily.`);
    }
  }

  async function handleApptReminder(provider: string, date: string, time: string, key: string) {
    const ok = await scheduleReminder(
      `Appointment Reminder`,
      `${provider} — ${date} at ${time}`,
      10
    );
    if (ok) {
      setRemindersSet((prev) => ({ ...prev, [key]: true }));
      Alert.alert('Reminder Set', `Test notification fires in 10 seconds. In production this would be the day before.`);
    }
  }

  function SectionHeader({ icon, label, color }: { icon: any; label: string; color: string }) {
    return (
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: color + '22' }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text style={styles.sectionTitle}>{label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TheraCareHeader title="Discharge Analysis" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={TC.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        {/* AI Analysis success card */}
        <View style={styles.successCard}>
          <View style={styles.successIconRow}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={28} color={TC.teal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.successTitle}>Analysis Complete</Text>
              <Text style={styles.successFile} numberOfLines={1}>{fileName}</Text>
              {model || isSample ? (
                <Text style={styles.successModel} numberOfLines={1}>
                  {isSample ? 'Sample analysis' : `Analyzed with ${model}`}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.remindersBtn}
              onPress={() => navigation.navigate('DischargeReminders')}
              activeOpacity={0.85}
            >
              <Ionicons name="alarm-outline" size={16} color={TC.teal} />
              <Text style={styles.remindersBtnText}>Reminders</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Patient info */}
        <View style={styles.card}>
          <SectionHeader icon="person-circle-outline" label="Patient Information" color={TC.teal} />
          <View style={styles.infoGrid}>
            {[
              { label: 'Name', value: d.patientName },
              { label: 'DOB', value: d.patientDOB },
              { label: 'Admitted', value: d.admittedDate },
              { label: 'Discharged', value: d.dischargedDate },
              { label: 'Provider', value: d.dischargingPhysician },
              { label: 'Hospital', value: d.hospital },
            ].map((item) => (
              <View key={item.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Diagnosis */}
        <View style={styles.card}>
          <SectionHeader icon="medkit-outline" label="Diagnosis" color="#7C3AED" />
          <View style={styles.diagnosisBadge}>
            <Text style={styles.diagnosisText}>{d.primaryDiagnosis}</Text>
          </View>
          {d.secondaryDiagnoses.map((dx, i) => (
            <View key={i} style={styles.secondaryDx}>
              <Ionicons name="ellipse" size={6} color={TC.textMuted} />
              <Text style={styles.secondaryDxText}>{dx}</Text>
            </View>
          ))}
        </View>

        {/* Discharge Medications */}
        <View style={styles.card}>
          <SectionHeader icon="medical-outline" label="Discharge Medications" color={TC.teal} />
          {d.dischargeMedications.map((med, i) => {
            const key = `med-${i}`;
            return (
              <View key={key} style={styles.medItem}>
                <View style={styles.medHeader}>
                  <View style={styles.medIconBox}>
                    <Ionicons name="medical" size={16} color={TC.teal} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medName}>{med.name}</Text>
                    <Text style={styles.medDose}>{med.dose} · {med.frequency}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.reminderChip, remindersSet[key] && styles.reminderChipSet]}
                    onPress={() => !remindersSet[key] && handleMedReminder(med.name, key)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={remindersSet[key] ? 'checkmark-circle' : 'alarm-outline'}
                      size={14}
                      color={remindersSet[key] ? TC.teal : TC.teal}
                    />
                    <Text style={styles.reminderChipText}>{remindersSet[key] ? 'Set' : 'Remind'}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.medPurpose}>{med.purpose}</Text>
                <Text style={styles.medDuration}>Duration: {med.duration}</Text>
              </View>
            );
          })}
        </View>

        {/* Follow-up Appointments */}
        <View style={styles.card}>
          <SectionHeader icon="calendar-outline" label="Follow-Up Appointments" color="#1D4ED8" />
          {d.followUpAppointments.map((appt) => {
            const key = `appt-${appt.id}`;
            return (
              <View key={appt.id} style={styles.apptItem}>
                <View style={styles.apptHeader}>
                  <View style={styles.apptIconBox}>
                    <Ionicons name="person" size={16} color="#1D4ED8" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.apptProvider}>{appt.provider}</Text>
                    <Text style={styles.apptSpecialty}>{appt.specialty}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.reminderChip, styles.apptReminderChip, remindersSet[key] && styles.reminderChipSet]}
                    onPress={() => !remindersSet[key] && handleApptReminder(appt.provider, appt.date, appt.time, key)}
                    activeOpacity={0.85}
                  >
                    <Ionicons
                      name={remindersSet[key] ? 'checkmark-circle' : 'alarm-outline'}
                      size={14}
                      color="#1D4ED8"
                    />
                    <Text style={[styles.reminderChipText, { color: '#1D4ED8' }]}>
                      {remindersSet[key] ? 'Set' : 'Remind'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.apptDetails}>
                  <View style={styles.apptDetailRow}>
                    <Ionicons name="calendar" size={13} color={TC.textMuted} />
                    <Text style={styles.apptDetailText}>{appt.date} at {appt.time}</Text>
                  </View>
                  <View style={styles.apptDetailRow}>
                    <Ionicons name="location" size={13} color={TC.textMuted} />
                    <Text style={styles.apptDetailText}>{appt.location}</Text>
                  </View>
                  <View style={styles.apptDetailRow}>
                    <Ionicons name="call" size={13} color={TC.textMuted} />
                    <Text style={styles.apptDetailText}>{appt.phone}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Warning Signs */}
        <View style={styles.card}>
          <SectionHeader icon="warning-outline" label="Warning Signs — Go to ER If:" color={TC.danger} />
          {d.warningSigns.map((sign, i) => (
            <View key={i} style={styles.warningRow}>
              <Ionicons name="warning" size={14} color={TC.danger} />
              <Text style={styles.warningText}>{sign}</Text>
            </View>
          ))}
        </View>

        {/* Follow-up Instructions */}
        <View style={styles.card}>
          <SectionHeader icon="list-outline" label="Follow-Up Instructions" color={TC.teal} />
          {d.followUpInstructions.map((instr, i) => (
            <View key={i} style={styles.instrRow}>
              <View style={styles.instrNum}>
                <Text style={styles.instrNumText}>{i + 1}</Text>
              </View>
              <Text style={styles.instrText}>{instr}</Text>
            </View>
          ))}
        </View>

        {/* Activity Restrictions */}
        <View style={styles.card}>
          <SectionHeader icon="ban-outline" label="Activity Restrictions" color={TC.warning} />
          {d.activityRestrictions.map((r, i) => (
            <View key={i} style={styles.warningRow}>
              <Ionicons name="remove-circle-outline" size={14} color={TC.warning} />
              <Text style={[styles.warningText, { color: TC.warning }]}>{r}</Text>
            </View>
          ))}
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity
          style={styles.allRemindersBtn}
          onPress={() => navigation.navigate('DischargeReminders')}
          activeOpacity={0.85}
        >
          <Ionicons name="alarm" size={20} color="#fff" />
          <Text style={styles.allRemindersBtnText}>View All Reminders</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TC.bg },
  scroll: { flex: 1 },

  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingBottom: 4,
    gap: 4,
  },
  backBtnText: { fontSize: 15, color: TC.textPrimary, fontWeight: '500' },

  successCard: {
    backgroundColor: TC.tealLight,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: TC.tealAI,
  },
  successIconRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  successIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: { fontSize: 15, fontWeight: '700', color: TC.tealDark },
  successFile: { fontSize: 12, color: TC.textSecondary, marginTop: 1 },
  successModel: { fontSize: 11, color: TC.textMuted, marginTop: 1 },
  remindersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: TC.teal,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  remindersBtnText: { fontSize: 12, color: TC.teal, fontWeight: '600' },

  card: {
    backgroundColor: TC.bgCard,
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: TC.textPrimary },

  infoGrid: { gap: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  infoLabel: { fontSize: 12, color: TC.textMuted, fontWeight: '600', width: 90 },
  infoValue: { fontSize: 13, color: TC.textPrimary, flex: 1, textAlign: 'right' },

  diagnosisBadge: {
    backgroundColor: '#EDE9FE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  diagnosisText: { fontSize: 15, fontWeight: '700', color: '#7C3AED', textAlign: 'center' },
  secondaryDx: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  secondaryDxText: { fontSize: 13, color: TC.textSecondary },

  medItem: {
    backgroundColor: TC.bg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  medHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  medIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: TC.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medName: { fontSize: 13, fontWeight: '700', color: TC.textPrimary },
  medDose: { fontSize: 11, color: TC.textMuted, marginTop: 1 },
  medPurpose: { fontSize: 12, color: TC.textSecondary, marginBottom: 2 },
  medDuration: { fontSize: 11, color: TC.textMuted, fontStyle: 'italic' },

  reminderChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: TC.teal,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: TC.bgCard,
  },
  reminderChipSet: { backgroundColor: TC.tealLight },
  apptReminderChip: { borderColor: '#1D4ED8' },
  reminderChipText: { fontSize: 11, color: TC.teal, fontWeight: '600' },

  apptItem: {
    backgroundColor: TC.bg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  apptHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  apptIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  apptProvider: { fontSize: 13, fontWeight: '700', color: TC.textPrimary },
  apptSpecialty: { fontSize: 11, color: TC.textMuted, marginTop: 1 },
  apptDetails: { gap: 4 },
  apptDetailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  apptDetailText: { fontSize: 12, color: TC.textSecondary, flex: 1 },

  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  warningText: { fontSize: 13, color: TC.danger, flex: 1, lineHeight: 19 },

  instrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  instrNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: TC.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  instrNumText: { fontSize: 11, fontWeight: '700', color: TC.teal },
  instrText: { fontSize: 13, color: TC.textPrimary, flex: 1, lineHeight: 19 },

  allRemindersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: TC.teal,
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 16,
    shadowColor: TC.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  allRemindersBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
