<h1>🚀 react-native-find-local-devices</h1>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="90" height="20" role="img" aria-label="npm: package"><title>npm: package</title><linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="r"><rect width="90" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#r)"><rect width="35" height="20" fill="#555"/><rect x="35" width="55" height="20" fill="#4c1"/><rect width="90" height="20" fill="url(#s)"/></g><g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110"><text aria-hidden="true" x="185" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">npm</text><text x="185" y="140" transform="scale(.1)" fill="#fff" textLength="250">npm</text><text aria-hidden="true" x="615" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="450">package</text><text x="615" y="140" transform="scale(.1)" fill="#fff" textLength="450">package</text></g></svg>
<blockquote>
<p>It can be helpful when you try to get a list of your local devices over WiFi when the devices includes at least one websocket connection.</p>
<p>This package allows you detect all devices over your local network with websocket connection.</p>
<p>You've to add a timeout and an array of ports as parameters. The package will try to create a connection with those ports and return the ip adresses which have successful connection.</p>
<p>See the example: <a href="https://github.com/RichardRNStudio/react-native-find-local-devices/tree/main/example">https://github.com/RichardRNStudio/react-native-find-local-devices/tree/main/example</a></p>
<p>NOTICE: It doesn't work with IOS yet. If you can help me in this case please contact me on the following email: info@rnstudio.hu</p>
<p><i>This package has been written for the PC Controller react-native application as a submodule.</i></p>
  <a href="https://pccontroller.rnstudio.hu">Visit the PC Controller website</a>
</p>
</blockquote>

<h2>Installation</h2>

```sh
npm install react-native-find-local-devices --save
```

<h2>Running the example project</h2>
<p>NOTICE: It requires a real device with Wi-Fi connection</p>

```sh
npm run example:android
```

<h2>Usage</h2>

```js
import FindLocalDevices from 'react-native-find-local-devices';
import { DeviceEventEmitter } from 'react-native';

// Don't forget to call DeviceEventEmitter.removeAllListeners() when discovering isn't running. 
// WARNING: DeviceEventEmitter.removeAllListeners will remove all of your listeners. 
// See the example folder. There is an advanced example how you can create and remove listeners independent of any other listeners.
// MAIN BEHAVIOUR: 
// ...
  DeviceEventEmitter.addListener('NEW_DEVICE_FOUND', (device) => {
    console.log(`NEW DEVICE FOUND: ${device.ipAddress}:${device.port}`);
    // This listener will be activated at the moment when the device has been found.
    // FORMAT: {ipAddress: "192.168.1.66", port: 70}
  });

  DeviceEventEmitter.addListener('RESULTS', (devices) => {
    // ALL OF RESULTS when discovering has been finished.
    // FORMAT: [{ipAddress: "192.168.1.66", port: 70}, {ipAddress: "192.168.1.69", port: 85}]
  });

  DeviceEventEmitter.addListener('CHECK', (device) => {
    // This listener will be activated in that moment when package checking a device.
    // FORMAT: {ipAddress: "192.168.1.65", port: 70}
  });

  DeviceEventEmitter.addListener('NO_DEVICES', () => {
    // This listener will be activated at the end of discovering.
  });

  DeviceEventEmitter.addListener('NO_PORTS', () => {
    // This listener will be activated if you don't pass any ports to the package.
  });

  DeviceEventEmitter.addListener('CONNECTION_ERROR', (error) => {
    // Handle error messages for each socket connection
    // console.log(error.message);
  });

  // Getting local devices which have active socket server on the following ports:
  FindLocalDevices.getLocalDevices({
    ports: [70, 85, 1200],
    timeout: 40
  });

  // When the discovering is running, you can cancel that with the following function:
  FindLocalDevices.cancelDiscovering();
// ...
```

<h3>Create a listener and remove it</h3>

```js
  // ...
  const newDeviceFoundSubscription = DeviceEventEmitter.addListener(
    NEW_DEVICE_FOUND,
    (device) => {
      if (device.ipAddress && device.port) {
        console.log(device);
      }
    }
  );
  // ...
  if(newDeviceFoundSubscription) newDeviceFoundSubscription.remove();
  // ...
```

<h2>Contributing</h2>

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

<h2>License</h2>

MIT
