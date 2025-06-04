import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTask } from '../store/tasksSlice';

export default function TaskListScreen() {
  const tasks = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => dispatch(toggleTask(item.id))}>
            <Text style={item.completed ? styles.done : styles.item}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  },
  item: {
    fontSize: 18,
    paddingVertical: 8,
    color: colors.text,
  },
  done: {
    fontSize: 18,
    paddingVertical: 8,
    textDecorationLine: 'line-through',
    color: 'grey',
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});
