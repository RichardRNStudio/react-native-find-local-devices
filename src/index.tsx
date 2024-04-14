import { NativeModules, DeviceEventEmitter } from 'react-native';
import type { IDevice } from './interfaces/IDevice.interface';
import type { IPortScanner } from './interfaces/IPortScanner.interface';
const { FindLocalDevices } = NativeModules;

class PortScanner {
  _listeners: Array<any> = [];
  readonly ports: number[] = [];
  readonly timeout: number = 40;
  readonly onDeviceFound: (device: IDevice) => void;
  readonly onFinish: (devices: IDevice[]) => void;
  readonly onCheck: (device: IDevice) => void;
  readonly onNoDevices: () => void;
  readonly onError: (error: string) => void;

  static cancelDiscovering: () => void = FindLocalDevices.cancelDiscovering;
  static getLocalDevices: () => void = FindLocalDevices.getLocalDevices;

  init = () => {
    this._listeners.push(
      DeviceEventEmitter.addListener(
        'FLD_NEW_DEVICE_FOUND',
        (device: IDevice) => {
          // This listener will be activated at the moment when the device has been found.
          // FORMAT: {ipAddress: "192.168.1.66", port: 70}
          this.onDeviceFound(device);
        }
      )
    );

    this._listeners.push(
      DeviceEventEmitter.addListener('FLD_RESULTS', (devices) => {
        // ALL OF RESULTS when discovering has been finished.
        // FORMAT: [{ipAddress: "192.168.1.66", port: 70}, {ipAddress: "192.168.1.69", port: 85}]
        this.onFinish(devices);
      })
    );

    this._listeners.push(
      DeviceEventEmitter.addListener('FLD_CHECK', (device) => {
        // This listener will be activated in that moment when package checking a device.
        // FORMAT: {ipAddress: "192.168.1.65", port: 70}
        this.onCheck(device);
      })
    );

    this._listeners.push(
      DeviceEventEmitter.addListener('FLD_NO_DEVICES', () => {
        // This listener will be activated at the end of discovering.
        this._listeners.forEach((l) => l.remove());
        this.onNoDevices();
      })
    );

    this._listeners.push(
      DeviceEventEmitter.addListener('FLD_CONNECTION_ERROR', (error) => {
        // Handle error messages for each socket connection
        this.onError(error);
      })
    );
  };

  constructor({
    ports = [],
    timeout = 40,
    onDeviceFound,
    onFinish,
    onCheck,
    onNoDevices,
    onError,
  }: IPortScanner) {
    this._listeners = [];

    if (!ports.length) {
      throw new Error('Must include at least 1 port to scan');
    }

    this.ports = ports;
    this.timeout = timeout;
    this.onDeviceFound = onDeviceFound;
    this.onFinish = onFinish;
    this.onCheck = onCheck;
    this.onNoDevices = onNoDevices;
    this.onError = onError;
  }

  start = () => {
    this.init();
    FindLocalDevices.getLocalDevices({
      ports: this.ports,
      timeout: this.timeout,
    });
  };

  stop = () => {
    FindLocalDevices.cancelDiscovering();
    this._listeners.forEach((l) => l.remove());
  };
}

export default PortScanner;
export { type IDevice, type IPortScanner };
