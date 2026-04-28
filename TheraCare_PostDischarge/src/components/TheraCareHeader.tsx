import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TC } from '../theme/colors';

interface TheraCareHeaderProps {
  title: string;
  onProfilePress?: () => void;
  onMenuPress?: () => void;
}

export default function TheraCareHeader({ title, onProfilePress, onMenuPress }: TheraCareHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Logo */}
      <View style={styles.logoArea}>
        <View style={styles.logoIcon}>
          <Ionicons name="hardware-chip" size={22} color={TC.teal} />
        </View>
        <Text style={styles.logoText}>
          <Text style={styles.logoBold}>TheraCare</Text>
          <Text style={styles.logoAi}>.ai</Text>
        </Text>
      </View>

      {/* Page title */}
      <Text style={styles.title}>{title}</Text>

      {/* Right icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={onProfilePress} style={styles.iconBtn}>
          <Ionicons name="person-outline" size={22} color={TC.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMenuPress} style={styles.iconBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color={TC.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TC.bgCard,
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 54 : (StatusBar.currentHeight ?? 24) + 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: TC.border,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 10,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: TC.teal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: TC.tealLight,
  },
  logoText: {
    fontSize: 15,
  },
  logoBold: {
    fontWeight: '800',
    color: TC.textPrimary,
  },
  logoAi: {
    fontWeight: '400',
    color: TC.textPrimary,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: TC.textPrimary,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 2,
  },
  iconBtn: {
    padding: 6,
  },
});
