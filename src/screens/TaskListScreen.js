import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import { colors } from '../theme';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, toggleTask, startTask, stopTask } from '../store/tasksSlice';

export default function TaskListScreen() {
  const tasks = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [urgency, setUrgency] = useState('');

  const submit = () => {
    if (!title) return;
    dispatch(
      addTask({
        id: Date.now().toString(),
        title,
        due,
        urgency,
        completed: false,
        startedAt: null,
        timeSpent: 0,
      })
    );
    setTitle('');
    setDue('');
    setUrgency('');
  };

  const TaskItem = ({ item }) => {
    const isRunning = !!item.startedAt;
    const [remaining, setRemaining] = useState(1500);

    useEffect(() => {
      let interval;
      if (isRunning) {
        const update = () => {
          const elapsed = Math.floor((Date.now() - item.startedAt) / 1000);
          const r = 1500 - elapsed;
          setRemaining(r > 0 ? r : 0);
        };
        update();
        interval = setInterval(update, 1000);
      }
      return () => clearInterval(interval);
    }, [isRunning, item.startedAt]);

    const format = secs => {
      const m = Math.floor(secs / 60)
        .toString()
        .padStart(2, '0');
      const s = Math.floor(secs % 60)
        .toString()
        .padStart(2, '0');
      return `${m}:${s}`;
    };

    return (
      <View style={styles.taskRow}>
        <TouchableOpacity
          style={styles.taskInfo}
          onPress={() => dispatch(toggleTask(item.id))}
        >
          <Text style={item.completed ? styles.done : styles.item}>{item.title}</Text>
          <Text style={styles.meta}>{item.due} | urgency: {item.urgency}</Text>
          {isRunning && (
            <Text style={styles.timer}>Pomodoro {format(remaining)}</Text>
          )}
        </TouchableOpacity>
        <Button
          title={isRunning ? 'Stop' : 'Start'}
          onPress={() =>
            isRunning
              ? dispatch(stopTask(item.id))
              : dispatch(startTask(item.id))
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks</Text>
      <TextInput
        style={styles.input}
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Due (YYYY-MM-DD HH:MM)"
        value={due}
        onChangeText={setDue}
      />
      <TextInput
        style={styles.input}
        placeholder="Urgency 1-5"
        value={urgency}
        onChangeText={setUrgency}
      />
      <Button title="Add Task" color={colors.primary} onPress={submit} />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskItem item={item} />}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  meta: {
    color: '#666',
    fontSize: 12,
  },
  timer: {
    fontSize: 12,
    color: colors.primary,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
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
