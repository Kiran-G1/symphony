import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTask } from '../store/tasksSlice';

export default function TaskListScreen() {
  const tasks = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => dispatch(toggleTask(item.id))}>
            <Text style={item.completed ? styles.done : styles.item}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    fontSize: 18,
    paddingVertical: 8,
  },
  done: {
    fontSize: 18,
    paddingVertical: 8,
    textDecorationLine: 'line-through',
    color: 'grey',
  },
});
