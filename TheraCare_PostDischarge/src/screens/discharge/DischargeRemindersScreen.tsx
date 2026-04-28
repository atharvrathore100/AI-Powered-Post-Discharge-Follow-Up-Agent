import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { TC } from '../../theme/colors';
import TheraCareHeader from '../../components/TheraCareHeader';

type ScheduledNotif = {
  identifier: string;
  content: { title?: string | null; body?: string | null };
  trigger: any;
};

export default function DischargeRemindersScreen() {
  const navigation = useNavigation<any>();
  const [reminders, setReminders] = useState<ScheduledNotif[]>([]);

  async function load() {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    setReminders(scheduled as ScheduledNotif[]);
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  async function cancelReminder(id: string, title: string) {
    Alert.alert('Cancel Reminder', `Remove reminder for "${title}"?`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await Notifications.cancelScheduledNotificationAsync(id);
          await load();
        },
      },
    ]);
  }

  async function cancelAll() {
    Alert.alert('Cancel All Reminders', 'Remove all scheduled reminders?', [
      { text: 'Keep All', style: 'cancel' },
      {
        text: 'Remove All',
        style: 'destructive',
        onPress: async () => {
          await Notifications.cancelAllScheduledNotificationsAsync();
          await load();
        },
      },
    ]);
  }

  function formatTriggerTime(trigger: any): string {
    try {
      if (trigger?.value) {
        return new Date(trigger.value).toLocaleString();
      }
      if (trigger?.date) {
        return new Date(trigger.date).toLocaleString();
      }
      return 'Scheduled';
    } catch {
      return 'Scheduled';
    }
  }

  return (
    <View style={styles.container}>
      <TheraCareHeader title="Reminders" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={TC.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconBox}>
            <Ionicons name="alarm" size={28} color={TC.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.summaryTitle}>{reminders.length} Active Reminder{reminders.length !== 1 ? 's' : ''}</Text>
            <Text style={styles.summarySub}>Tap a reminder to cancel it</Text>
          </View>
          {reminders.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={cancelAll} activeOpacity={0.85}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {reminders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="alarm-outline" size={48} color={TC.border} />
            <Text style={styles.emptyTitle}>No Reminders Set</Text>
            <Text style={styles.emptySub}>
              Go to the Discharge Analysis screen and tap "Remind" on medications or appointments to schedule reminders.
            </Text>
            <TouchableOpacity
              style={styles.goBackBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.goBackBtnText}>Go to Analysis</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {reminders.map((r) => (
              <TouchableOpacity
                key={r.identifier}
                style={styles.card}
                onPress={() => cancelReminder(r.identifier, r.content.title ?? 'Reminder')}
                activeOpacity={0.85}
              >
                <View style={styles.cardIcon}>
                  <Ionicons
                    name={
                      r.content.title?.toLowerCase().includes('medication')
                        ? 'medical'
                        : 'calendar'
                    }
                    size={20}
                    color={TC.teal}
                  />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{r.content.title ?? 'Reminder'}</Text>
                  {r.content.body ? (
                    <Text style={styles.cardBody2} numberOfLines={2}>{r.content.body}</Text>
                  ) : null}
                  <View style={styles.timeRow}>
                    <Ionicons name="time-outline" size={12} color={TC.textMuted} />
                    <Text style={styles.cardTime}>{formatTriggerTime(r.trigger)}</Text>
                  </View>
                </View>
                <Ionicons name="close-circle-outline" size={22} color={TC.danger} />
              </TouchableOpacity>
            ))}
          </View>
        )}

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

  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TC.tealLight,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: TC.tealAI,
  },
  summaryIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: TC.teal,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: TC.tealDark },
  summarySub: { fontSize: 12, color: TC.textSecondary, marginTop: 2 },
  clearBtn: {
    borderWidth: 1.5,
    borderColor: TC.danger,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearBtnText: { fontSize: 12, color: TC.danger, fontWeight: '600' },

  emptyCard: {
    backgroundColor: TC.bgCard,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: TC.textPrimary },
  emptySub: {
    fontSize: 14,
    color: TC.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  goBackBtn: {
    backgroundColor: TC.teal,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  goBackBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  list: { marginHorizontal: 16, gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TC.bgCard,
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: TC.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: TC.textPrimary },
  cardBody2: { fontSize: 12, color: TC.textSecondary, marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  cardTime: { fontSize: 11, color: TC.textMuted },
});
