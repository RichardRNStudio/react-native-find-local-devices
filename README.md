<h1>react-native-find-local-devices</h1>
<blockquote>
<p>It can be helpful when you try to get a list of your local devices over WiFi when the devices includes at least one websocket connection.</p>
<p>This package allows you detect all devices over your local network with websocket connection.</p>
<p>You've to add a timeout and an array of ports as parameters. The package will try to create a connection with those ports and return the ip adresses which have successful connection.</p>
<p>See the example: <a href=" https://github.com/RichardRNStudio/react-native-local-devices/example">https://github.com/RichardRNStudio/react-native-local-devices/example</a></p>
<p>NOTICE: It doesn't works under IOS yet. If you can help me in this case please contact me on the following email: info@rnstudio.hu</p>
<p><i>This package has been written for the PC Controller react-native application as a submodule.</i></p>
  <a href="https://pccontroller.rnstudio.hu">Visit the PC Controller website</a>
</p>
</blockquote>

<h2>Installation</h2>

```sh
npm install react-native-find-local-devices --save
```

<h2>Usage</h2>

```js
import FindLocalDevices from 'react-native-find-local-devices';
import { DeviceEventEmitter } from 'react-native';

// Don't forget to call DeviceEventEmitter.removeAllListeners() when discovering isn't running. 
// See the example folder for an advanced example.
// ...
  DeviceEventEmitter.addListener('NEW_DEVICE_FOUND', (device) => {
    console.log(`NEW DEVICE FOUND: ${device.ipAddress}:${device.port}`);
    // This listener will be activated in that moment when the device has been found.
    // FORMAT: {ipAddress: "192.168.1.12", port: 70}
  });

  DeviceEventEmitter.addListener('RESULTS', (devices) => {
    // ALL OF RESULTS when discovering has been finished.
    // FORMAT: [{ipAddress: "192.168.1.12", port: 70}, {ipAddress: "192.168.1.13", port: 75}]
  });

  DeviceEventEmitter.addListener('CHECK', (device) => {
    // This listener will be activated in that moment when package checking a device.
    // FORMAT: {ipAddress: "192.168.1.2", port: 70}
  });

  DeviceEventEmitter.addListener('NO_DEVICES', () => {
    // This listener will be activated at the end of discovering.
  });

  DeviceEventEmitter.addListener('NO_PORTS', () => {
    // This listener will be activated if you don't pass any ports to the package.
  });

  FindLocalDevices.getLocalDevices({
    ports: [70, 85, 1200],
    timeout: 40
  });
// ...
```

<h2>Contributing</h2>

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

<h2>License</h2>

MIT
