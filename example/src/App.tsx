import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { IDevice } from './Device.interface';
import NetworkDiscoverer from './NetworkDiscoverer';

const networkDiscoverer = new NetworkDiscoverer(40, [50001, 50002]);

export default function App() {
  const [results, setResults] = useState<(IDevice | undefined)[]>([]);
  const [checkingDevice, setCheckingDevice] = useState<IDevice>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [newDevice, setNewDevice] = useState<IDevice | undefined>();

  useEffect(() => {
    setResults([...results, newDevice]);
  }, [newDevice]);

  const setDefault = () => {
    setCheckingDevice(undefined);
    setErrorMsg('');
    setLoading(false);
  };

  const getLocalDevices = () => {
    setDefault();
    setResults([]);
    setLoading(true);
    networkDiscoverer.getLocalDevices(
      setResults,
      setCheckingDevice,
      setLoading,
      setErrorMsg,
      setNewDevice,
      setDefault
    );
  };

  const cancelDiscovering = () => {
    networkDiscoverer.cancelDiscovering(setDefault);
  };

  return (
    <View style={styles.container}>
      <View style={styles.actionContainer}>
        {!loading ? (
          <View style={styles.checkingContainer}>
            {errorMsg !== '' && <Text>{errorMsg}</Text>}
            <Button
              title={'Discover devices'}
              color={'steelblue'}
              onPress={() => getLocalDevices()}
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
            <Button
              title={'Cancel discovering'}
              color={'red'}
              onPress={() => cancelDiscovering()}
            />
          </View>
        )}
      </View>
      {results && results.length > 0 && (
        <View style={styles.itemList}>
          {results.map((result, index) => {
            return (
              result && (
                <View style={styles.item} key={index}>
                  <Text>
                    New device has been found: {result.ipAddress}:{result.port}
                  </Text>
                </View>
              )
            );
          })}
        </View>
      )}
    </View>
  );
}

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
