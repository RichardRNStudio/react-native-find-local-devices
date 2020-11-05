import React from 'react';
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

  DeviceEventEmitter.addListener('new_device_found', (device) => {
    console.log('newDevice_found', device);
  });

  DeviceEventEmitter.addListener('connection_error', () => {
    console.log('connection_error');
  });

  DeviceEventEmitter.addListener('no_devices', () => {
    console.log('no_devices');
  });

  DeviceEventEmitter.addListener('no_ports', () => {
    console.log('no_ports');
  });

  const getLocalDevices = () => {
    FindLocalDevices.getLocalDevices({
      timeout: 10,
      ports: [50001, 50002, 50003],
    });
  };

  return (
    <View style={styles.container}>
      <Text>See the results on your console!</Text>
      <Button
        title={'Get local devices'}
        color={'steelblue'}
        onPress={() => getLocalDevices()}
      />
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
