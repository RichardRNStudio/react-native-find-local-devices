import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  DeviceEventEmitter,
} from 'react-native';
import Device from './Device';
import FindLocalDevices from 'react-native-find-local-devices';

export default function App() {
  const [results, setResults] = useState<Device[]>([]);
  const [checkingDevice, setCheckingDevice] = useState<Device>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const setDefault = () => {
    DeviceEventEmitter.removeAllListeners();
    setCheckingDevice(undefined);
    setError(false);
    setErrorMsg('');
    setResults([]);
    setLoading(false);
  };

  const getLocalDevices = () => {   
    setDefault();
    setLoading(true);
    DeviceEventEmitter.addListener('NEW_DEVICE_FOUND', (device) => {
      console.log(`NEW DEVICE FOUND: ${device.ipAddress}:${device.port}`);
    });

    DeviceEventEmitter.addListener('RESULTS', (devices) => {
      setResults(devices);
      setLoading(false);
    });

    DeviceEventEmitter.addListener('CHECK', (device) => {
      setCheckingDevice(device);
    });

    DeviceEventEmitter.addListener('NO_DEVICES', () => {
      setResults([]);
      setError(true);
      setErrorMsg('No devices found.');
      setLoading(false);
    });

    DeviceEventEmitter.addListener('NO_PORTS', () => {
      setError(true);
      setErrorMsg('You did not pass any ports.');
      setLoading(false);
    });
  
    FindLocalDevices.getLocalDevices({
      ports: [50001, 50002, 50003],
      timeout: 40
    });
  };

  const cancelDiscovering = () => {    
    FindLocalDevices.cancelDiscovering();
    setDefault();
  };

  return (
    <View style={styles.container}>
      {!loading ? (
        <View>
        {error && <Text>{errorMsg}</Text>}
        <Button
          title={'Discover devices'}
          color={'steelblue'}
          onPress={() => getLocalDevices()}
        />
        </View>
      ) : (
        <View>
          <Text>Discover devices...</Text>          
          {checkingDevice && (
            <Text>{checkingDevice.ipAddress}:{checkingDevice.port}</Text>
          )}
          <Button
            title={'Cancel discovering'}
            color={'red'}
            onPress={() => cancelDiscovering()}
          />
        </View>
      )}
      {!loading && results && results.length > 0 && (
        <View style={styles.itemList}>
          {results.map((result, index) => {
            return (
              <View style={styles.item}>
                <Text key={index}>{result.ipAddress}:{result.port}</Text>
              </View>
            );
          })}
        </View>        
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  itemList: {
    marginTop: 50,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    marginTop: 20,
    flex: 1,
  },
  itemTitle: {
    flex: 1,
    fontWeight: 'bold',
  }
});
