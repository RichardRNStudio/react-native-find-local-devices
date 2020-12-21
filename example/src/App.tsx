import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import FindLocalDevices from 'react-native-find-local-devices';

export default function App() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // DeviceEventEmitter.addListener('new_device_found', (device) => {
  //   setResults([...results, device]);
    // setLoading(false);
  // });

  DeviceEventEmitter.addListener('connection_error', () => {
    setError(true);
    setErrorMsg('connection_error');
    setLoading(false);
  });

  DeviceEventEmitter.addListener('no_devices', () => {
    setError(true);
    setErrorMsg('no_devices');
    setLoading(false);
  });

  DeviceEventEmitter.addListener('no_ports', () => {
    setError(true);
    setErrorMsg('no_ports');
    setLoading(false);
  });

  DeviceEventEmitter.addListener('error', () => {
    setError(true);
    setErrorMsg('unknown_error');
    setLoading(false);
  });

  DeviceEventEmitter.addListener('reached', (device) => {
    console.log(device);
    setResults([...results, device]);
    setLoading(false);
  });

  const getLocalDevices = () => {
    setError(false);
    setErrorMsg('');
    setResults([]);
    setLoading(true);
    FindLocalDevices.getLocalDevices({
      timeout: 15
    });
  };

  return (
    <View style={styles.container}>
      {!loading ? (
        <View>
        {/* {results && results.length > 0 && (
          results.map(result => {
            return <Text>{result.toString()}</Text>
          })
        )} */}
        {error && <Text>{errorMsg}</Text>}
        <Button
          title={'Get local devices'}
          color={'steelblue'}
          onPress={() => getLocalDevices()}
        />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Dimensions.get('screen').height * 0.5,
    maxHeight: Dimensions.get('screen').height * 0.5,
    textAlign: 'center',
  },
});
