import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import FindLocalDevices from 'react-native-find-local-devices';

export default function App() {
  const [result, setResult] = React.useState();

  React.useEffect(() => {
    FindLocalDevices.getLocalDevices(10).then((response) => console.log(response));
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
