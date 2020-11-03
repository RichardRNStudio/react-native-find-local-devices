import { NativeModules } from 'react-native';

type FindLocalDevicesType = {
  getLocalDevices(timeout: number, ports: String): Promise<String>;
};

const { FindLocalDevices } = NativeModules;

export default FindLocalDevices as FindLocalDevicesType;
