import React from 'react';
import { View, Text, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { TC } from '../theme/colors';

// Screens
import InsuranceCardsScreen from '../screens/InsuranceCardsScreen';
import MedicationsScreen from '../screens/MedicationsScreen';
import MedicationDetailScreen from '../screens/MedicationDetailScreen';
import SchedulesScreen from '../screens/SchedulesScreen';
import TheraCareAIScreen from '../screens/TheraCareAIScreen';
import DischargeHomeScreen from '../screens/discharge/DischargeHomeScreen';
import DischargeAnalysisScreen from '../screens/discharge/DischargeAnalysisScreen';
import DischargeRemindersScreen from '../screens/discharge/DischargeRemindersScreen';

const Tab = createBottomTabNavigator();
const MedStack = createNativeStackNavigator();
const DischargeStack = createNativeStackNavigator();

function MedicationsStack() {
  return (
    <MedStack.Navigator screenOptions={{ headerShown: false }}>
      <MedStack.Screen name="MedicationsList" component={MedicationsScreen} />
      <MedStack.Screen name="MedicationDetail" component={MedicationDetailScreen} />
    </MedStack.Navigator>
  );
}

function DischargeStackNav() {
  return (
    <DischargeStack.Navigator screenOptions={{ headerShown: false }}>
      <DischargeStack.Screen name="DischargeHome" component={DischargeHomeScreen} />
      <DischargeStack.Screen name="DischargeAnalysis" component={DischargeAnalysisScreen} />
      <DischargeStack.Screen name="DischargeReminders" component={DischargeRemindersScreen} />
    </DischargeStack.Navigator>
  );
}

type TabIconName =
  | 'card'
  | 'card-outline'
  | 'medical'
  | 'medical-outline'
  | 'calendar'
  | 'calendar-outline'
  | 'hardware-chip'
  | 'hardware-chip-outline'
  | 'document-text'
  | 'document-text-outline';

const TAB_CONFIG: Array<{
  name: string;
  label: string;
  activeIcon: TabIconName;
  inactiveIcon: TabIconName;
  component: React.ComponentType<any>;
  badge?: boolean;
}> = [
  {
    name: 'Insurance',
    label: 'Insurance',
    activeIcon: 'card',
    inactiveIcon: 'card-outline',
    component: InsuranceCardsScreen,
  },
  {
    name: 'Medications',
    label: 'Medications',
    activeIcon: 'medical',
    inactiveIcon: 'medical-outline',
    component: MedicationsStack,
  },
  {
    name: 'Schedules',
    label: 'Schedules',
    activeIcon: 'calendar',
    inactiveIcon: 'calendar-outline',
    component: SchedulesScreen,
  },
  {
    name: 'TheraCareAI',
    label: 'AI',
    activeIcon: 'hardware-chip',
    inactiveIcon: 'hardware-chip-outline',
    component: TheraCareAIScreen,
  },
  {
    name: 'Discharge',
    label: 'Discharge',
    activeIcon: 'document-text',
    inactiveIcon: 'document-text-outline',
    component: DischargeStackNav,
    badge: true,
  },
];

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => {
          const tab = TAB_CONFIG.find((t) => t.name === route.name);
          return {
            headerShown: false,
            tabBarStyle: {
              backgroundColor: TC.bgCard,
              borderTopColor: TC.border,
              borderTopWidth: 1,
              height: Platform.OS === 'ios' ? 84 : 64,
              paddingBottom: Platform.OS === 'ios' ? 28 : 8,
              paddingTop: 8,
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
            },
            tabBarIcon: ({ focused, size }) => {
              const iconName = focused ? tab?.activeIcon : tab?.inactiveIcon;
              const color = focused ? TC.teal : TC.textMuted;

              if (tab?.badge) {
                return (
                  <View>
                    <Ionicons name={iconName ?? 'document-text-outline'} size={size} color={color} />
                    {!focused && (
                      <View
                        style={{
                          position: 'absolute',
                          top: -2,
                          right: -4,
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: TC.teal,
                        }}
                      />
                    )}
                  </View>
                );
              }
              return <Ionicons name={iconName ?? 'medical-outline'} size={size} color={color} />;
            },
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: focused ? '700' : '400',
                  color: focused ? TC.teal : TC.textMuted,
                }}
              >
                {tab?.label}
              </Text>
            ),
          };
        }}
      >
        {TAB_CONFIG.map((tab) => (
          <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
