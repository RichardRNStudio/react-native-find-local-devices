import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Dimensions } from 'react-native';
import FindLocalDevices from 'react-native-find-local-devices';

export default function App() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const ports = [
    {
      value: 50001,
    },
    {
      value: 50002,
    },
    {
      value: 50003,
    },
  ];

  const getLocalDevices = () => {
    setLoading(true);
    FindLocalDevices.getLocalDevices(100, JSON.stringify(ports))
      .then((response) => {
        setResult(response);
        setLoading(false);
      })
      .catch((e) => {
        setResult(JSON.stringify(e));
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      {!loading && (
        <Button
          title={'Get local devices'}
          color={'steelblue'}
          onPress={() => getLocalDevices()}
        />
      )}
      {loading && <Text>Loading...</Text>}
      {result.length > 0 && !loading && <Text>Result: {result}</Text>}
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
  },
});
