import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TC } from '../theme/colors';
import { Medication } from '../data/mockData';

interface MedicationCardProps {
  medication: Medication;
  onPress: () => void;
  onMenu: () => void;
}

export default function MedicationCard({ medication, onPress, onMenu }: MedicationCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Pill bottle icon */}
      <View style={[styles.thumb, { backgroundColor: medication.color + '22' }]}>
        <Ionicons name="medical" size={26} color={medication.color} />
      </View>

      <Text style={styles.name} numberOfLines={1}>{medication.name}</Text>

      <TouchableOpacity style={styles.menuBtn} onPress={onMenu} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="ellipsis-vertical" size={20} color={TC.textSecondary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TC.bgCard,
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: TC.textPrimary,
  },
  menuBtn: {
    padding: 4,
  },
});
