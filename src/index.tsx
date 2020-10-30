import { NativeModules } from 'react-native';

type FindLocalDevicesType = {
  getLocalDevices(timeout: number): Promise<String>;
};

const { FindLocalDevices } = NativeModules;

export default FindLocalDevices as FindLocalDevicesType;
