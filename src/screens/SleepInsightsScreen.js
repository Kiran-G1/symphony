import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SleepInsightsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sleep Insights</Text>
      <Text>Integration with Health data coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
});
