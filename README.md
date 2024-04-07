<h1>🚀 react-native-find-local-devices</h1>

[![npm version](https://img.shields.io/npm/v/react-native-find-local-devices.svg)](https://www.npmjs.com/package/react-native-find-local-devices)
[![build](https://github.com/RichardRNStudio/react-native-find-local-devices/actions/workflows/build-app.yml/badge.svg?branch=main)](https://github.com/RichardRNStudio/react-native-find-local-devices/actions/workflows/build-app.yml)
[![platform](https://img.shields.io/badge/platform-Android-yellow)](https://github.com/RichardRNStudio/react-native-find-local-devices)
[![NPM total downloads](https://img.shields.io/npm/d18m/react-native-find-local-devices.svg?style=flat)](https://npmcharts.com/compare/react-native-find-local-devices?minimal=true)
[![license](https://img.shields.io/badge/license-MIT-green)](https://github.com/RichardRNStudio/react-native-find-local-devices/blob/main/LICENSE)


<p align="center">
  It can be helpful when you try to get a list of your local devices over WiFi when the devices includes at least one websocket connection.
</p>
<p align="center">
  <a href="https://github.com/RichardRNStudio/react-native-find-local-devices/">
    <img src="https://github.com/RichardRNStudio/react-native-find-local-devices/blob/main/docs/android-example.gif?raw=true" height="450"/>
  </a>
</p>

<blockquote>
<p>This package allows you detect all devices over your local network with websocket connection.</p>
<p>You've to add a timeout and an array of ports as parameters. The package will try to create a connection with those ports and return the ip addresses which have successful connection.</p>
<p>See the example: <a href="https://github.com/RichardRNStudio/react-native-find-local-devices/tree/main/example">https://github.com/RichardRNStudio/react-native-find-local-devices/tree/main/example</a></p>
<p>NOTICE: It doesn't work with IOS yet. Related ticket: <a href="https://github.com/RichardRNStudio/react-native-find-local-devices/issues/2">IOS support ticket</a></p>
</blockquote>

<h2>Installation</h2>

```sh
yarn add react-native-find-local-devices
```

or

```sh
npm install react-native-find-local-devices --save
```

<h2>Usage</h2>

```ts
import PortScanner from 'react-native-find-local-devices';

const scanner = new PortScanner({
    timeout: 40,
    ports: [8000],
    onDeviceFound: (device) => {
      console.log('Found device!', device);
    },
    onResults: (devices) => {
      console.log('Finished scanning', devices);
    },
    onCheck: (device) => {
      console.log('Checking IP: ', device.ipAddress);
    },
    onFinished: () => {
      console.log('Done!');
    },
    onError: (device) => {
      // Called when no service found
      console.log('Nothing found', device);
    },
  });

  // You can start the discovering with the following function:
  scanner.start();

  // When the discovering is running, you can cancel that with the following function:
  scanner.stop();

```

<h2>Contributing</h2>

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

<h2>License</h2>

MIT
