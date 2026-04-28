import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TC } from '../theme/colors';
import TheraCareHeader from '../components/TheraCareHeader';
import { insuranceCards } from '../data/mockData';

export default function InsuranceCardsScreen() {
  return (
    <View style={styles.container}>
      <TheraCareHeader title="Insurance Cards" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {insuranceCards.map((card) => (
          <View key={card.id} style={[styles.card, { backgroundColor: card.color }]}>
            <View style={styles.cardHeader}>
              <View style={styles.chip} />
              <Ionicons name="wifi" size={20} color="rgba(255,255,255,0.7)" style={{ transform: [{ rotate: '90deg' }] }} />
            </View>
            <Text style={styles.cardProvider}>{card.provider}</Text>
            <Text style={styles.cardPlan}>{card.planName}</Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardFieldLabel}>MEMBER ID</Text>
                <Text style={styles.cardField}>{card.memberId}</Text>
              </View>
              <View>
                <Text style={styles.cardFieldLabel}>GROUP</Text>
                <Text style={styles.cardField}>{card.groupNumber}</Text>
              </View>
              <View>
                <Text style={styles.cardFieldLabel}>EFFECTIVE</Text>
                <Text style={styles.cardField}>{card.effectiveDate}</Text>
              </View>
            </View>
            <Text style={styles.cardHolder}>{card.holderName}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} activeOpacity={0.85}>
          <Ionicons name="add-circle-outline" size={20} color={TC.teal} />
          <Text style={styles.addBtnText}>Add Insurance Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: TC.bg },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 40 },

  card: {
    borderRadius: 18,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 180,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chip: {
    width: 36,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  cardProvider: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginTop: 16,
  },
  cardPlan: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cardFieldLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  cardField: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    marginTop: 2,
  },
  cardHolder: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: 10,
    letterSpacing: 0.5,
  },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: TC.teal,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 15,
    color: TC.teal,
    fontWeight: '600',
  },
});
