import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';

const NotificationScreen = () => {
  // Sample notification data
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Like',
      description: 'JohnDoe liked your post.',
      time: '2 minutes ago',
    },
    {
      id: '2',
      title: 'New Comment',
      description: 'JaneSmith commented on your post.',
      time: '10 minutes ago',
    },
    {
      id: '3',
      title: 'New Follower',
      description: 'Alice started following you.',
      time: '30 minutes ago',
    },
    {
      id: '4',
      title: 'New Like',
      description: 'User123 liked your post.',
      time: '1 hour ago',
    },
    // Add more notifications as needed...
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationDescription}>{item.description}</Text>
      <Text style={styles.notificationTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.noNotificationsText}>No new notifications</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
    paddingTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  noNotificationsText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});

export default NotificationScreen;
