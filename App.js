import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { StatusBar } from 'react-native';

// EventSource를 글로벌 객체로 설정
global.EventSource = NativeEventSource || EventSourcePolyfill;

export default function App() {
  const [viewedEvents, setViewedEvents] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(
      'https://api.fleaauction.world/v2/sse/event'
    );

    eventSource.addEventListener('sse.auction_viewed', (e) => {
      const data = JSON.parse(e.data);
      setViewedEvents((currentEvents) => [...currentEvents, data]);
    });

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {viewedEvents.map((event, index) => (
          <View key={index} style={styles.item}>
            <Text>경매 {event.auctionId}</Text>
            <Text>조회 수: {event.viewCount}</Text>
          </View>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        style={[styles.scrollView, { marginTop: 20 }]}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {/* 다른 컨텐츠를 표시할 수 있습니다 */}
      </ScrollView>
      <StatusBar barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  scrollView: {
    width: '100%',
  },
  scrollContentContainer: {
    alignItems: 'center',
  },
  item: {
    width: 100,
    margin: 10,
    padding: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
