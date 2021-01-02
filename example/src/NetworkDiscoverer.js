import FindLocalDevices from 'react-native-find-local-devices';
import { DeviceEventEmitter } from 'react-native';

const NEW_DEVICE_FOUND = 'NEW_DEVICE_FOUND';
const CHECK = 'CHECK';
const NO_DEVICES = 'NO_DEVICES';
const NO_PORTS = 'NO_PORTS';
const RESULTS = 'RESULTS';
const CONNECTION_ERROR = 'CONNECTION_ERROR';

class NetworkDiscoverer {
  Timeout = 40;
  Ports = [];

  NewDeviceFoundSubscription = null;
  ResultsSubscription = null;
  CheckDeviceSubscription = null;
  NoDevicesSubscription = null;
  NoPortsSubscription = null;
  ConnectionErrorSubscription = null;

  constructor(timeout = 40, ports = []) {
    this.Timeout = timeout;
    this.Ports = ports;
  }

  getLocalDevices = (
    setResults,
    setCheckingDevice,
    setLoading,
    setErrorMsg,
    setNewDevice,
    setDefault
  ) => {
    this.NewDeviceFoundSubscription = DeviceEventEmitter.addListener(
      NEW_DEVICE_FOUND,
      (device) => {
        if (device.ipAddress && device.port) {
          console.log(device);
          setNewDevice(device);
        }
      }
    );

    this.ResultsSubscription = DeviceEventEmitter.addListener(
      RESULTS,
      (devices) => {
        setResults(devices);
        setLoading(false);
        this.cancelDiscovering(setDefault);
      }
    );

    this.CheckDeviceSubscription = DeviceEventEmitter.addListener(
      CHECK,
      (device) => {
        setCheckingDevice(device);
      }
    );

    this.NoDevicesSubscription = DeviceEventEmitter.addListener(
      NO_DEVICES,
      () => {
        setLoading(false);
        setErrorMsg(NO_DEVICES);
        this.cancelDiscovering(setDefault);
      }
    );

    this.NoPortsSubscription = DeviceEventEmitter.addListener(NO_PORTS, () => {
      setLoading(false);
      setErrorMsg(NO_PORTS);
      this.cancelDiscovering(setDefault);
    });

    this.ConnectionErrorSubscription = DeviceEventEmitter.addListener(
      CONNECTION_ERROR,
      (error) => {
        // Handle error messages for each socket connection
        // console.log(error.message);
      }
    );

    FindLocalDevices.getLocalDevices({
      timeout: this.Timeout,
      ports: this.Ports,
    });
  };

  cancelDiscovering = (setDefault) => {
    FindLocalDevices.cancelDiscovering();
    if (this.NewDeviceFoundSubscription) {
      this.NewDeviceFoundSubscription.remove();
    }
    if (this.CheckDeviceSubscription) {
      this.CheckDeviceSubscription.remove();
    }
    if (this.ResultsSubscription) {
      this.ResultsSubscription.remove();
    }
    if (this.NoDevicesSubscription) {
      this.NoDevicesSubscription.remove();
    }
    if (this.NoPortsSubscription) {
      this.NoPortsSubscription.remove();
    }
    if (this.ConnectionErrorSubscription) {
      this.ConnectionErrorSubscription.remove();
    }
    setDefault();
  };
}

export default NetworkDiscoverer;
