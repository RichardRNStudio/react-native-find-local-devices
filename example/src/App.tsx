import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Dimensions } from 'react-native';
import FindLocalDevices from 'react-native-find-local-devices';

export default function App() {
  const [result, setResult] = useState<String>('');
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState<number>(0);
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
    FindLocalDevices.getLocalDevices(20, JSON.stringify(ports))
      .then((response) => {
        setResult(response);
        setLoading(false);
      })
      .catch((e) => {
        setResult(JSON.stringify(e));
        setLoading(false);
      });
  };

  useEffect(() => {
    if(loading) {
      setTime(new Date().getTime());
    } else {
      if(time > 0) {
        setTime(new Date().getTime() - time);
      }
    }
  }, [loading])

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
      {!loading && (
        <View>
        {result.length > 0 && <Text>Result(s):</Text>}
        {result.length > 0 && <Text>{result}</Text>}
        {time > 0 && <Text>Time: {time}ms</Text>}
        </View>
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
    textAlign: 'center'
  },
});
