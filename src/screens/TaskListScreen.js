import React, { useState, useEffect } from 'react';
import {
  View,
  SectionList,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Switch,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, toggleTask, startTask, stopTask } from '../store/tasksSlice';

export default function TaskListScreen() {
  const tasks = useSelector(state => state.tasks);
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [due, setDue] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [urgency, setUrgency] = useState('');
  const [urgent, setUrgent] = useState(false);
  const [important, setImportant] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState(null);

  const submit = () => {
    if (!title) return;
    dispatch(
      addTask({
        id: Date.now().toString(),
        title,
        due: due.toISOString(),
        urgency,
        urgent,
        important,
        completed: false,
        startedAt: null,
        timeSpent: 0,
      })
    );
    setTitle('');
    setDue(new Date());
    setUrgency('');
    setUrgent(false);
    setImportant(false);
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
          <Text style={styles.meta}>
            {item.due ? new Date(item.due).toLocaleString() : 'N/A'} | urgency:{' '}
            {item.urgency} |{item.urgent ? ' urgent' : ''}
            {item.important ? ', important' : ''}
          </Text>
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

  const isToday = d => {
    const t = new Date();
    return (
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear()
    );
  };
  const isYesterday = d => {
    const t = new Date();
    t.setDate(t.getDate() - 1);
    return (
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear()
    );
  };
  const isTomorrow = d => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    return (
      d.getDate() === t.getDate() &&
      d.getMonth() === t.getMonth() &&
      d.getFullYear() === t.getFullYear()
    );
  };
  const isThisMonth = d => {
    const t = new Date();
    return d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  };
  const isThisYear = d => {
    const t = new Date();
    return d.getFullYear() === t.getFullYear();
  };

  const sections = [
    { title: 'Today', data: [] },
    { title: 'Yesterday', data: [] },
    { title: 'Tomorrow', data: [] },
    { title: 'This Month', data: [] },
    { title: 'This Year', data: [] },
  ];

  tasks.forEach(t => {
    const d = t.due ? new Date(t.due) : null;
    if (!d) return;
    if (isToday(d)) sections[0].data.push(t);
    else if (isYesterday(d)) sections[1].data.push(t);
    else if (isTomorrow(d)) sections[2].data.push(t);
    else if (isThisMonth(d)) sections[3].data.push(t);
    else if (isThisYear(d)) sections[4].data.push(t);
  });

  const filterByPriority = t => {
    if (!priorityFilter) return true;
    const map = {
      UI: t.urgent && t.important,
      UN: t.urgent && !t.important,
      NI: !t.urgent && t.important,
      NN: !t.urgent && !t.important,
    };
    return map[priorityFilter];
  };

  sections.forEach(sec => {
    sec.data = sec.data.filter(filterByPriority);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks</Text>
      <TextInput
        style={styles.input}
        placeholder="Task title"
        value={title}
        onChangeText={setTitle}
      />
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text>{due.toLocaleString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={due}
          mode="datetime"
          onChange={(e, date) => {
            setShowPicker(false);
            if (date) setDue(date);
          }}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Urgency 1-5"
        value={urgency}
        onChangeText={setUrgency}
      />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Urgent</Text>
        <Switch value={urgent} onValueChange={setUrgent} />
        <Text style={[styles.switchLabel, { marginLeft: 16 }]}>Important</Text>
        <Switch value={important} onValueChange={setImportant} />
      </View>
      <View style={styles.filterRow}>
        {[
          ['UI', 'Urgent & Important'],
          ['UN', 'Urgent & Non-Important'],
          ['NI', 'Non-Urgent & Important'],
          ['NN', 'Non-Urgent & Non-Important'],
        ].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterBtn,
              priorityFilter === key && styles.filterBtnActive,
            ]}
            onPress={() =>
              setPriorityFilter(priorityFilter === key ? null : key)
            }
          >
            <Text
              style={
                priorityFilter === key
                  ? styles.filterTextActive
                  : styles.filterText
              }
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TaskItem item={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
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
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    marginBottom: 8,
    backgroundColor: colors.card,
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
    backgroundColor: colors.border,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabel: {
    fontSize: 14,
    color: colors.text,
    marginRight: 4,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    color: colors.text,
    fontSize: 12,
  },
  filterTextActive: {
    color: '#fff',
    fontSize: 12,
  },
  sectionHeader: {
    backgroundColor: colors.card,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
