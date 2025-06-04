import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import TaskListScreen from './screens/TaskListScreen';
import MoodJournalScreen from './screens/MoodJournalScreen';
import SleepInsightsScreen from './screens/SleepInsightsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';
            if (route.name === 'Tasks') iconName = 'checkmark-circle-outline';
            if (route.name === 'Mood') iconName = 'happy-outline';
            if (route.name === 'Sleep') iconName = 'moon';
            if (route.name === 'Settings') iconName = 'settings-outline';
            if (route.name === 'Home') iconName = 'home';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerStyle: { backgroundColor: '#6200ee' },
          headerTintColor: '#fff',
          tabBarActiveTintColor: '#6200ee',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Tasks" component={TaskListScreen} />
        <Tab.Screen name="Mood" component={MoodJournalScreen} />
        <Tab.Screen name="Sleep" component={SleepInsightsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
