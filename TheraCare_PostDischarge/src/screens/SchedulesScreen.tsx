import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TC } from '../theme/colors';
import TheraCareHeader from '../components/TheraCareHeader';
import { schedules } from '../data/mockData';

type ScheduleEntry = typeof schedules[0];

export default function SchedulesScreen() {
  const [items, setItems] = useState<ScheduleEntry[]>(schedules);

  function toggleActive(id: string) {
    setItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  }

  function handleDelete(id: string, title: string) {
    Alert.alert('Delete Schedule', `Remove "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setItems((prev) => prev.filter((s) => s.id !== id)),
      },
    ]);
  }

  const medications = items.filter((s) => s.type === 'medication');
  const appointments = items.filter((s) => s.type === 'appointment');

  function Section({ title, data }: { title: string; data: ScheduleEntry[] }) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.length === 0 ? (
          <Text style={styles.empty}>No {title.toLowerCase()} scheduled</Text>
        ) : (
          data.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={[styles.iconBox, { backgroundColor: item.type === 'medication' ? TC.tealLight : '#EDE9FE' }]}>
                <Ionicons
                  name={item.type === 'medication' ? 'medical' : 'calendar'}
                  size={22}
                  color={item.type === 'medication' ? TC.teal : '#7C3AED'}
                />
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardTime}>{item.time} · {item.days.join(', ')}</Text>
              </View>
              <Switch
                value={item.active}
                onValueChange={() => toggleActive(item.id)}
                trackColor={{ false: TC.border, true: TC.teal }}
                thumbColor="#fff"
              />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id, item.title)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={18} color={TC.danger} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TheraCareHeader title="Schedules" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{medications.filter((m) => m.active).length}</Text>
            <Text style={styles.summaryLabel}>Active Meds</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{appointments.filter((a) => a.active).length}</Text>
            <Text style={styles.summaryLabel}>Appointments</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNum}>{items.filter((i) => !i.active).length}</Text>
            <Text style={styles.summaryLabel}>Paused</Text>
          </View>
        </View>

        <Section title="Medication Reminders" data={medications} />
        <Section title="Appointments" data={appointments} />

        <View style={{ height: 110 }} />
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.88}
          onPress={() =>
            Alert.alert('Add Schedule', 'Select a medication or appointment to schedule a reminder.')
          }
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.fabText}>Add Schedule</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TC.bg },
  scroll: { flex: 1 },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: TC.teal,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryNum: { fontSize: 28, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },

  section: { marginHorizontal: 16, marginBottom: 8 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TC.textSecondary,
    marginBottom: 10,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: {
    fontSize: 14,
    color: TC.textMuted,
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: TC.bgCard,
    borderRadius: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TC.bgCard,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: TC.textPrimary },
  cardTime: { fontSize: 12, color: TC.textMuted, marginTop: 2 },
  deleteBtn: { padding: 4 },

  fabContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: TC.teal,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: TC.teal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
