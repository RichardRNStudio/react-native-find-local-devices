import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import PortScanner from 'react-native-find-local-devices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    maxHeight: '100%',
    minHeight: '100%',
  },
  actionContainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    height: '30%',
    minHeight: '30%',
    maxHeight: '30%',
  },
  checkingContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default function App() {
  const scanner = new PortScanner({
    timeout: 40,
    ports: [50001],
    onDeviceFound: (device) => {
      console.log('Found device!', device);
    },
    onResults: (devices) => {
      console.log('Finished scanning', devices);
    },
    onCheck: (device) => {
      console.log('Checking IP: ', device.ipAddress, device.port);
    },
    onFinished: () => {
      console.log('Done!');
    },
    onError: (device) => {
      // Called when no service found
      console.log('Nothing found', device);
    },
  });

  const start = () => {
    scanner.start();
  };

  const stop = () => {
    scanner.stop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        <View style={styles.checkingContainer}>
          <Button title="Discover devices" color="steelblue" onPress={start} />
        </View>
        <View style={styles.checkingContainer}>
          <Button title="Cancel discovering" color="red" onPress={stop} />
        </View>
      </View>
    </View>
  );
}
