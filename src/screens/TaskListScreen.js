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
import { Ionicons } from '@expo/vector-icons';
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
          <View style={styles.metaRow}>
            <Text style={styles.meta}>
              {item.due ? new Date(item.due).toLocaleString() : 'N/A'} | urgency:{' '}
              {item.urgency}
            </Text>
            <View style={styles.iconRow}>
              {item.urgent && (
                <Ionicons
                  name="alert-circle"
                  size={12}
                  color="red"
                  style={styles.icon}
                />
              )}
              {item.important && (
                <Ionicons
                  name="star"
                  size={12}
                  color="orange"
                  style={styles.icon}
                />
              )}
            </View>
          </View>
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

  const startOfDay = offset => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    return d;
  };

  const today = startOfDay(0);
  const tomorrow = startOfDay(1);
  const dayAfterTomorrow = startOfDay(2);

  const overdueTasks = [];
  const todayTasks = [];
  const tomorrowTasks = [];
  const upcomingMap = {};

  tasks.forEach(t => {
    const d = t.due ? new Date(t.due) : null;
    if (!d) return;
    if (d < today) overdueTasks.push(t);
    else if (d >= today && d < tomorrow) todayTasks.push(t);
    else if (d >= tomorrow && d < dayAfterTomorrow) tomorrowTasks.push(t);
    else {
      const key = d.toDateString();
      if (!upcomingMap[key]) upcomingMap[key] = [];
      upcomingMap[key].push(t);
    }
  });

  const sections = [];
  if (overdueTasks.length) sections.push({ title: 'Overdue', data: overdueTasks });
  if (todayTasks.length) sections.push({ title: 'Today', data: todayTasks });
  if (tomorrowTasks.length) sections.push({ title: 'Tomorrow', data: tomorrowTasks });
  Object.keys(upcomingMap)
    .sort((a, b) => new Date(a) - new Date(b))
    .forEach(key => {
      sections.push({ title: key, data: upcomingMap[key] });
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
      <Button title="Add Task" onPress={submit} />
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  icon: {
    marginLeft: 2,
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
