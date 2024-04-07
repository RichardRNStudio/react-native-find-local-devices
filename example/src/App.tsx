import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import PortScanner, { type IDevice } from 'react-native-find-local-devices';

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
  itemList: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'column',
    height: '70%',
    maxHeight: '70%',
    minHeight: '70%',
    alignItems: 'center',
  },
  item: {
    marginTop: 20,
    padding: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    height: 30,
    maxHeight: 30,
  },
  itemTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
});

export default function App() {
  const [results, setResults] = useState<(IDevice | undefined)[]>([]);
  const [checkingDevice, setCheckingDevice] = useState<IDevice>(
    Object.create(null)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [, setNewDevice] = useState<IDevice | undefined>(Object.create(null));

  const scanner = new PortScanner({
    timeout: 40,
    ports: [8000],
    onDeviceFound: (device) => {
      console.log('Found device!', device);
      setNewDevice(device);
    },
    onResults: (devices) => {
      console.log('Finished scanning', devices);
      setResults(devices);
    },
    onCheck: (device) => {
      console.log('Checking IP: ', device.ipAddress);
      setCheckingDevice(device);
    },
    onFinished: () => {
      console.log('Done!');
      setLoading(false);
    },
    onError: (device) => {
      // Called when no service found
      console.log('Nothing found', device);
      setErrorMsg('No devices found');
    },
  });

  const start = () => {
    setLoading(true);
    scanner.start();
  };

  const stop = () => {
    setLoading(false);
    scanner.stop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        {!loading ? (
          <View style={styles.checkingContainer}>
            {errorMsg !== '' && <Text>{errorMsg}</Text>}
            <Button
              title="Discover devices"
              color="steelblue"
              onPress={start}
            />
          </View>
        ) : (
          <View style={styles.checkingContainer}>
            <Text>Discover devices...</Text>
            {checkingDevice && (
              <Text>
                {checkingDevice.ipAddress}:{checkingDevice.port}
              </Text>
            )}
            <Button title="Cancel discovering" color="red" onPress={stop} />
          </View>
        )}
      </View>
      {results && results.length > 0 && (
        <View style={styles.itemList}>
          {results.map((result, index) => {
            if (!result) return null;
            return (
              <View style={styles.item} key={index}>
                <Text>
                  New device has been found: {result.ipAddress}:{result.port}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
