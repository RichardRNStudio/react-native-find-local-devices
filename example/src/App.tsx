import React, { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import PortScanner, { type IDevice } from 'react-native-find-local-devices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    maxHeight: '100%',
    minHeight: '100%',
    marginTop: 10,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 10,
    minHeight: 20,
  },
  warning: {
    textAlign: 'center',
    color: 'red',
    fontSize: 20,
    marginBottom: 20,
  },
});

export default function App() {
  const [deviceFound, setDeviceFound] = useState<IDevice[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [checkedDevice, setCheckedDevice] = useState<IDevice | null>(null);

  const scanner = new PortScanner({
    timeout: 40,
    ports: [78999],
    onDeviceFound: (device) => {
      console.log('Found device!', device);
      setDeviceFound((prev) => [...prev, device]);
    },
    onFinish: (devices) => {
      console.log('Finished scanning', devices);
      scanner.stop();
      setIsFinished(true);
      setCheckedDevice(null);
    },
    onCheck: (device) => {
      console.log('Checking IP: ', device.ip, device.port);
      setCheckedDevice(device);
    },
    onNoDevices: () => {
      console.log('Done without results!');
      setIsFinished(true);
      setCheckedDevice(null);
    },
    onError: (error) => {
      // Handle error messages for each socket connection
      console.log('Error', error);
    },
  });

  const start = () => {
    console.log('init');
    setDeviceFound([]);
    setIsFinished(false);
    scanner?.start();
  };

  const stop = () => {
    scanner?.stop();
    setCheckedDevice(null);
    setIsFinished(false);
    setDeviceFound([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.warning}>Wi-Fi connection is required!</Text>
      {!checkedDevice && (
        <View style={styles.wrapper}>
          <Button title="Discover devices" color="steelblue" onPress={start} />
        </View>
      )}
      {checkedDevice && (
        <View style={styles.wrapper}>
          <Text>
            Under checking: {checkedDevice.ip}:{checkedDevice.port}
          </Text>
        </View>
      )}
      {deviceFound.length > 0 && (
        <View style={styles.wrapper}>
          {deviceFound.map((device) => (
            <Text key={device.ip}>
              New device found: {device.ip}:{device.port}
            </Text>
          ))}
        </View>
      )}
      {isFinished && (
        <View style={styles.wrapper}>
          <Text>Finished scanning!</Text>
        </View>
      )}
      {checkedDevice && (
        <View style={styles.wrapper}>
          <Button title="Cancel discovering" color="red" onPress={stop} />
        </View>
      )}
    </SafeAreaView>
  );
}
