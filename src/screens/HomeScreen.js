import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

export default function HomeScreen() {
  const tasks = useSelector(state => state.tasks);
  const mood = useSelector(state => state.mood);

  const nextTask = tasks.find(t => !t.completed);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Symphony</Text>
      <Text>Next Task: {nextTask ? nextTask.title : 'All done!'}</Text>
      <Text>Last Mood: {mood.length ? mood[mood.length - 1].value : 'N/A'}</Text>
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
