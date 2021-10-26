import {NativeModules, DeviceEventEmitter} from 'react-native';
const {FindLocalDevices} = NativeModules;

class PortScan {

  _listeners: Array<any> = [];

  constructor({
            ports = [],
            timeout = 40,
            onDeviceFound,
            onResults,
            onCheck,
            onFinished,
            onError
          }){

    this._listeners = [];

    if (!ports.length) {
      throw new Error("Must include at least 1 port to scan");
    }

    if (onDeviceFound) {
      this._listeners.push(
        DeviceEventEmitter.addListener('FLD_NEW_DEVICE_FOUND', (device) => {
          // This listener will be activated at the moment when the device has been found.
          // FORMAT: {ipAddress: "192.168.1.66", port: 70}
          onDeviceFound(device);
        })
      );
    }

    if (onResults) {
      this._listeners.push(
        DeviceEventEmitter.addListener('FLD_RESULTS', (devices) => {
          // ALL OF RESULTS when discovering has been finished.
          // FORMAT: [{ipAddress: "192.168.1.66", port: 70}, {ipAddress: "192.168.1.69", port: 85}]
          onResults(devices);
        })
      );
    }

    if(onCheck) {
      this._listeners.push(
      DeviceEventEmitter.addListener('FLD_CHECK', (device) => {
        // This listener will be activated in that moment when package checking a device.
        // FORMAT: {ipAddress: "192.168.1.65", port: 70}
        onCheck(device);
      }));
    }

    this._listeners.push(
      DeviceEventEmitter.addListener('FLD_NO_DEVICES', () => {
        // This listener will be activated at the end of discovering.
        this._listeners.forEach(l => l.remove());
        if(onFinished) onFinished();
      })
    )

    if(onError){
      this._listeners.push(
        DeviceEventEmitter.addListener('FLD_CONNECTION_ERROR', (error) => {
        // Handle error messages for each socket connection
          onError(error);
        })
      );
    }

    FindLocalDevices.getLocalDevices({
      ports,
      timeout
    });
  }

  stop = () => {
    FindLocalDevices.cancelDiscovering();
    this._listeners.forEach(l => l.remove());
  }
}

export default PortScan;




