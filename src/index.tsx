import { NativeModules } from 'react-native';

type FindLocalDevicesType = {
  multiply(a: number, b: number): Promise<number>;
};

const { FindLocalDevices } = NativeModules;

export default FindLocalDevices as FindLocalDevicesType;
