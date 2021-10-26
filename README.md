<h1>🚀 react-native-find-local-devices</h1>

![npm version](https://img.shields.io/npm/v/react-native-find-local-devices.svg)
![build](https://img.shields.io/circleci/build/github/RichardRNStudio/react-native-find-local-devices/main)
![platform](https://img.shields.io/badge/platform-android-yellow)
![license](https://img.shields.io/badge/license-MIT-green)

![example](https://github.com/RichardRNStudio/react-native-find-local-devices/blob/main/docs/android-example.gif?raw=true)

<blockquote>
<p>It can be helpful when you try to get a list of your local devices over WiFi when the devices includes at least one websocket connection.</p>
<p>This package allows you detect all devices over your local network with websocket connection.</p>
<p>You've to add a timeout and an array of ports as parameters. The package will try to create a connection with those ports and return the ip adresses which have successful connection.</p>
<p>See the example: <a href="https://github.com/RichardRNStudio/react-native-find-local-devices/tree/main/example">https://github.com/RichardRNStudio/react-native-find-local-devices/tree/main/example</a></p>
<p>NOTICE: It doesn't work with IOS yet. If you can help me in this case please contact me on the following email: info@rnstudio.hu</p>
<p>
<i>This package has been written for the PC Controller react-native application as a submodule.</i>
</p>
<p><a href="https://pccontroller.rnstudio.hu">Visit the PC Controller website</a></p>
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
import PortScanner from 'react-native-find-local-devices';

const scanner = new PortScanner({
  ports: [8000],
  onDeviceFound: (device) => {
    consoe.log('Found device!', device);
  },
  onResults: (devices) => {
    console.log('Finished scanning', devices);
  },
  onCheck: (device) => {
    console.log('Checking IP: ', device.ipAddress);
  },
  onFinished: () => {
    console.log("Done!");
  },
  onError: (device) => {
    // Called when no service found
    console.log("Nothing found", device);
  }
})
  // When the discovering is running, you can cancel that with the following function:
scanner.stop();
// ...
```

<h2>Contributing</h2>

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

<h2>License</h2>

MIT
