import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useDispatch } from 'react-redux';
import { addMoodEntry } from '../store/moodSlice';

export default function MoodJournalScreen() {
  const [value, setValue] = useState('');
  const dispatch = useDispatch();

  const submit = () => {
    dispatch(addMoodEntry({ id: Date.now().toString(), value }));
    setValue('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mood Journal</Text>
      <TextInput
        style={styles.input}
        placeholder="How do you feel?"
        value={value}
        onChangeText={setValue}
      />
      <Button title="Save" color={colors.primary} onPress={submit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 4,
  },
});
