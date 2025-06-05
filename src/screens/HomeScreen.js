import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useSelector } from 'react-redux';

export default function HomeScreen() {
  const tasks = useSelector(state => state.tasks);
  const mood = useSelector(state => state.mood);

  const nextTask = tasks.find(t => !t.completed);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Symphony</Text>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Next Task</Text>
        <Text style={styles.cardValue}>
          {nextTask
            ? `${nextTask.title} (due ${nextTask.due || 'N/A'})`
            : 'All done!'}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Last Mood</Text>
        <Text style={styles.cardValue}>
          {mood.length ? mood[mood.length - 1].value : 'N/A'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    fontSize: 28,
    marginBottom: 24,
    color: colors.primary,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 18,
    color: colors.text,
  },
});
