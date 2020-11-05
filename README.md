# react-native-find-local-devices

It can be helpful when you try to get a list of your local devices over WiFi when the devices includes at least one websocket connection.
This package allows you detect all devices over your local network with websocket connection.
You've to add a timeout and an array of ports. The package will try create a connection with those ports and return the ip adresses which have successful connection.
If the package doesn't find any devices, then you'll get the following message: "no_devices".
See the example: https://github.com/RichardRNStudio/react-native-local-devices/example

NOTICE: It doesn't works under IOS yet. If you can help me in this case please contact me on the following email: info@rnstudio.hu

## Installation

```sh
npm install react-native-find-local-devices --save
```

## Usage

```js
import FindLocalDevices from 'react-native-find-local-devices';
import { DeviceEventEmitter } from 'react-native';

// ...
  DeviceEventEmitter.addListener('new_device_found', (device) => {
    console.log('newDevice_found', d);
    console.log(device.ipAddress); // for example: 192.168.1.12
    console.log(device.port); // that port which has been a successful connection from your list
  });

  DeviceEventEmitter.addListener('connection_error', () => {
    console.log('connection_error');
  });

  DeviceEventEmitter.addListener('no_devices', () => {
    console.log('no_devices');
  });

  DeviceEventEmitter.addListener('no_ports', () => {
    console.log('no_ports');
  });

  const getLocalDevices = () => {
    FindLocalDevices.getLocalDevices({
      timeout: 10,
      ports: [80, 3004],
    });
  };
// ...
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
