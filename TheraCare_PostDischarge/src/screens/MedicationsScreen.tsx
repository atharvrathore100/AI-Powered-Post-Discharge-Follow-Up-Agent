import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { TC } from '../theme/colors';
import TheraCareHeader from '../components/TheraCareHeader';
import MedicationCard from '../components/MedicationCard';
import { medications } from '../data/mockData';

export default function MedicationsScreen() {
  const navigation = useNavigation<any>();
  const [sortAZ, setSortAZ] = useState(true);
  const [showActive, setShowActive] = useState(true);

  const displayed = sortAZ
    ? [...medications].sort((a, b) => a.name.localeCompare(b.name))
    : medications;

  function handleMenu(medName: string) {
    Alert.alert(medName, 'What would you like to do?', [
      { text: 'Edit', onPress: () => {} },
      { text: 'Delete', style: 'destructive', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  return (
    <View style={styles.container}>
      <TheraCareHeader title="Medications" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── Teal header card ── */}
        <View style={styles.headerCard}>
          <View style={styles.headerCardTop}>
            <View>
              <Text style={styles.patientName}>Amanda's</Text>
              <Text style={styles.sectionLabel}>Active Medications</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconAction}>
                <Ionicons name="copy-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconAction}>
                <Ionicons name="share-outline" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconAction, sortAZ && styles.iconActionActive]}
                onPress={() => setSortAZ(!sortAZ)}
              >
                <Text style={styles.azText}>A↓Z</Text>
              </TouchableOpacity>
              <Switch
                value={showActive}
                onValueChange={setShowActive}
                trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#fff' }}
                thumbColor={showActive ? TC.teal : 'rgba(255,255,255,0.6)'}
                style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
              />
            </View>
          </View>
        </View>

        {/* ── Medication list ── */}
        <View style={styles.list}>
          {displayed.map((med) => (
            <MedicationCard
              key={med.id}
              medication={med}
              onPress={() => navigation.navigate('MedicationDetail', { medId: med.id })}
              onMenu={() => handleMenu(med.name)}
            />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Add Medication FAB ── */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.88}
          onPress={() => Alert.alert('Add Medication', 'Scan a medication label or search by name to add a new medication.')}
        >
          <Ionicons name="scan-outline" size={20} color="#fff" />
          <Text style={styles.fabText}>Add Medication</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TC.bg },
  scroll: { flex: 1 },

  headerCard: {
    backgroundColor: TC.teal,
    margin: 16,
    borderRadius: 16,
    padding: 18,
  },
  headerCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconAction: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActionActive: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  azText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
  },

  list: { paddingTop: 4 },

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
  fabText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
