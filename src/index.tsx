import { NativeModules, NativeEventEmitter } from 'react-native';
import type { IDevice } from './interfaces/IDevice.interface';
import type { IPortScanner } from './interfaces/IPortScanner.interface';

const { FindLocalDevices } = NativeModules;

if (!FindLocalDevices) {
  console.error('FindLocalDevices module is not available.');
}

const NativeEmitter = new NativeEventEmitter(FindLocalDevices);
class PortScanner {
  _listeners: Array<any> = [];
  readonly ports: number[] = [];
  readonly timeout: number = 40;
  readonly onDeviceFound: (device: IDevice) => void;
  readonly onFinish: (devices: IDevice[]) => void;
  readonly onCheck: (device: IDevice) => void;
  readonly onNoDevices: () => void;
  readonly onError: (error: string) => void;

  constructor({
    ports = [],
    timeout = 40,
    onDeviceFound,
    onFinish,
    onCheck,
    onNoDevices,
    onError,
  }: IPortScanner) {
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

    // Immediately initialize listeners to ensure they're ready
  }

  initListeners = () => {
    this._listeners.push(
      NativeEmitter.addListener('FLD_NEW_DEVICE_FOUND', (device: IDevice) => {
        this.onDeviceFound(device);
      })
    );

    this._listeners.push(
      NativeEmitter.addListener('FLD_RESULTS', (devices) => {
        this.onFinish(devices);
      })
    );

    this._listeners.push(
      NativeEmitter.addListener('FLD_CHECK', (device) => {
        this.onCheck(device);
      })
    );

    this._listeners.push(
      NativeEmitter.addListener('FLD_NO_DEVICES', () => {
        this.clearListeners();
        this.onNoDevices();
      })
    );

    this._listeners.push(
      NativeEmitter.addListener('FLD_CONNECTION_ERROR', (error) => {
        this.onError(error);
      })
    );

    console.log('Event listeners registered');
  };

  clearListeners = () => {
    this._listeners.forEach((l) => l.remove());
    this._listeners = [];
  };

  start = () => {
    this.initListeners();
    FindLocalDevices.getLocalDevices({
      ports: this.ports,
      timeout: this.timeout,
    });
  };

  stop = () => {
    FindLocalDevices.cancelDiscovering();
    this.clearListeners();
  };
}

export default PortScanner;
export { type IDevice, type IPortScanner };
