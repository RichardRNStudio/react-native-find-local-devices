# react-native-find-local-devices

PLEASE NOTICE THIS PACKAGE IS A BETA VERSION.

It can be helpful when you try to get a list of your local devices over WiFi.
This package allow you detect all devices on your local network.

The results will be available in the following format:
"[{IpAddress: "192.168.1.40", Port: 84}, {IpAddress: "192.168.1.45", Port: 86}]".

As you can see you need to parse this json to an array on react native side.

You add an array of ports, the package will check them by socket connection and return the ip adresses which has a succesfull socket connection.

If the package doesn't find any devices, then you'll get the following message: "NO_DEVICES".
See the example: https://github.com/RichardRNStudio/react-native-local-devices/tree/master/example

It doesn't work under IOS yet.

## Installation

```sh
npm install react-native-find-local-devices
```

## Usage

```js
import FindLocalDevices from 'react-native-find-local-devices';

// ...

const ports = [
  // optional, when you add some ports, the package will check them by socket connection
  {
    value: 120,
  },
  {
    value: 80,
  },
];

FindLocalDevices.getLocalDevices(100, JSON.stringify(ports))
  .then((response) => {
    const devices = JSON.parse(response); // you will have the response as a string so you've to parse that
  })
  .catch((e) => {
    console.log(e);
  });
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
