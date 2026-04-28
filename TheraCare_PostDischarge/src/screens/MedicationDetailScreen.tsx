import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TC } from '../theme/colors';
import TheraCareHeader from '../components/TheraCareHeader';
import { medications } from '../data/mockData';

type Tab = 'Uses' | 'Instructions' | 'Cautions' | 'Side Effects';
const TABS: Tab[] = ['Uses', 'Instructions', 'Cautions', 'Side Effects'];

export default function MedicationDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const medId = route.params?.medId ?? medications[0].id;
  const med = medications.find((m) => m.id === medId) ?? medications[0];
  const [activeTab, setActiveTab] = useState<Tab>('Uses');

  function renderTabContent() {
    switch (activeTab) {
      case 'Uses':
        return med.uses.map((use, i) => (
          <View key={i} style={styles.checkItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={14} color={TC.teal} />
            </View>
            <Text style={styles.checkText}>{use}</Text>
          </View>
        ));
      case 'Instructions':
        return (
          <View style={styles.textBlock}>
            <Text style={styles.instructionText}>{med.instructions}</Text>
          </View>
        );
      case 'Cautions':
        return med.cautions.map((c, i) => (
          <View key={i} style={styles.cautionItem}>
            <Ionicons name="warning-outline" size={14} color={TC.warning} />
            <Text style={styles.cautionText}>{c}</Text>
          </View>
        ));
      case 'Side Effects':
        return med.sideEffects.map((se, i) => (
          <View key={i} style={styles.checkItem}>
            <View style={[styles.checkCircle, { backgroundColor: TC.dangerBg }]}>
              <Ionicons name="alert" size={12} color={TC.danger} />
            </View>
            <Text style={styles.checkText}>{se}</Text>
          </View>
        ));
    }
  }

  return (
    <View style={styles.container}>
      <TheraCareHeader title="Medications" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Back arrow ── */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={TC.textPrimary} />
        </TouchableOpacity>

        {/* ── Drug info card ── */}
        <View style={styles.drugCard}>
          <View style={styles.drugCardInner}>
            {/* FDB-style logo block */}
            <View style={styles.fdbBlock}>
              <View style={styles.fdbLogo}>
                <Text style={styles.fdbText}>fdb</Text>
                <Text style={styles.fdbSub}>First Databank</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.drugName} numberOfLines={2}>{med.name}</Text>
            </View>
            <Ionicons name="warning" size={22} color="#F59E0B" />
          </View>

          {/* Action buttons */}
          <View style={styles.drugActions}>
            {[
              { icon: 'document-outline' as const, label: 'PDF' },
              { icon: 'open-outline' as const, label: 'Learn More' },
              { icon: 'create-outline' as const, label: 'Add Note' },
            ].map((btn) => (
              <TouchableOpacity
                key={btn.label}
                style={styles.drugActionBtn}
                onPress={() => Alert.alert(btn.label, 'This feature is available in the full TheraCare app.')}
                activeOpacity={0.8}
              >
                <Ionicons name={btn.icon} size={16} color={TC.tealLight} />
                <Text style={styles.drugActionText}>{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Tab bar ── */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={
                  tab === 'Uses' ? 'medical-outline' :
                  tab === 'Instructions' ? 'list-outline' :
                  tab === 'Cautions' ? 'warning-outline' : 'bandage-outline'
                }
                size={18}
                color={activeTab === tab ? TC.teal : TC.textMuted}
              />
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Tab content ── */}
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── Bottom buttons ── */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.backBtnBottom}
          onPress={() => navigation.goBack()}
          activeOpacity={0.85}
        >
          <Text style={styles.backBtnBottomText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.85}
          onPress={() => Alert.alert('Medication Added', `${med.name} has been added to Amanda's active medications.`)}
        >
          <Text style={styles.addBtnText}>Add Medication</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TC.bg },
  scroll: { flex: 1 },

  backBtn: {
    padding: 14,
    paddingBottom: 4,
  },

  drugCard: {
    backgroundColor: TC.teal,
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  drugCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  fdbBlock: {},
  fdbLogo: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fdbText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a2e',
  },
  fdbSub: {
    fontSize: 8,
    color: '#555',
    textAlign: 'center',
    marginTop: 2,
  },
  drugName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 22,
  },
  drugActions: {
    flexDirection: 'row',
    gap: 8,
  },
  drugActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  drugActionText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: TC.bgCard,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 3,
    position: 'relative',
  },
  tabText: {
    fontSize: 11,
    color: TC.textMuted,
    fontWeight: '500',
  },
  tabTextActive: {
    color: TC.teal,
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: -4,
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: TC.teal,
    borderRadius: 1,
  },

  tabContent: {
    margin: 16,
    gap: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: TC.bgCard,
    borderRadius: 10,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TC.tealLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    fontSize: 14,
    color: TC.textPrimary,
    flex: 1,
  },
  textBlock: {
    backgroundColor: TC.bgCard,
    borderRadius: 10,
    padding: 14,
  },
  instructionText: {
    fontSize: 14,
    color: TC.textPrimary,
    lineHeight: 22,
  },
  cautionItem: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: TC.warningBg,
    borderRadius: 10,
    padding: 12,
    alignItems: 'flex-start',
  },
  cautionText: {
    flex: 1,
    fontSize: 13,
    color: TC.warning,
    lineHeight: 19,
  },

  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    paddingBottom: 24,
    backgroundColor: TC.bgCard,
    borderTopWidth: 1,
    borderTopColor: TC.border,
  },
  backBtnBottom: {
    flex: 1,
    borderWidth: 2,
    borderColor: TC.teal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backBtnBottomText: {
    color: TC.teal,
    fontWeight: '700',
    fontSize: 16,
  },
  addBtn: {
    flex: 1.4,
    backgroundColor: TC.teal,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
