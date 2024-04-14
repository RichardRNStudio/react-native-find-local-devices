package com.reactnativefindlocaldevices;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.os.AsyncTask;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;
import java.net.Socket;
import java.net.InetSocketAddress;
import java.io.IOException;
import java.lang.Override;

public class FindLocalDevicesModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private final String NEW_DEVICE_FOUND = "NEW_DEVICE_FOUND";
  private final String CONNECTION_ERROR = "CONNECTION_ERROR";
  private final String NO_DEVICES = "NO_DEVICES";
  private final String NO_PORTS = "NO_PORTS";
  private final String CHECK = "CHECK";
  private final String RESULTS = "RESULTS";

  private final String TIMEOUT_KEY = "timeout";
  private final String PORT_KEY = "ports";

  private DiscoverTask discoverNetwork;

  FindLocalDevicesModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  public String getName() {
    return "FindLocalDevices";
  }

  @ReactMethod
  public void getLocalDevices(ReadableMap params) {
    int timeout;
    if (params.hasKey(TIMEOUT_KEY)) {
      timeout = params.getInt(TIMEOUT_KEY);
    } else {
      timeout = 20;
    }
    if (params.hasKey(PORT_KEY)) {
      ReadableArray ports = params.getArray(PORT_KEY);
      if(ports.size() == 0) {
        WritableMap eventParams = Arguments.createMap();
        sendMapEvent(NO_PORTS, eventParams);
      } else {
        this.discoverNetwork = new DiscoverTask(timeout, ports);
        discoverNetwork.execute();
      }
    } else {
      WritableMap eventParams = Arguments.createMap();
      sendMapEvent(NO_PORTS, eventParams);
    }
  }

  @ReactMethod
  public void cancelDiscovering() {
    if(this.discoverNetwork != null) this.discoverNetwork.cancel(true);
  }

  private class DiscoverTask extends AsyncTask<Void, Void, ArrayList<Device>> {
    int Timeout;
    ReadableArray Ports;

    public DiscoverTask(int timeout, ReadableArray ports) {
      this.Timeout = timeout;
      this.Ports = ports;
    }

    @Override
    protected ArrayList<Device> doInBackground(Void... params) {
      ArrayList<Device> devices = new ArrayList<Device>();
      WifiManager mWifiManager = (WifiManager) reactContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
      WifiInfo mWifiInfo = mWifiManager.getConnectionInfo();
      String subnet = getSubnetAddress(mWifiManager.getDhcpInfo().gateway);
      for(int j=0; j<this.Ports.size(); j++) {
        for (int i=1; i<=255; i++) {
          if(isCancelled()) break;
          String host = subnet + "." + i;
          Device device = new Device(host, this.Ports.getInt(j));
          Boolean reachable = socketIsAvailable(device, this.Timeout);
          if(reachable) {
            sendMapEvent(NEW_DEVICE_FOUND, device.mapToWritableMap());
            devices.add(device);
          }
        }
        if(devices.size() > 0 && j < (this.Ports.size()-1)) break;
      }
      return devices;
    }

    @Override
    protected void onPostExecute(ArrayList<Device> resultDevices) {
      if(resultDevices.size() > 0) {
        WritableArray devices = Arguments.createArray();
        for(int i=0; i<resultDevices.size(); i++) {
          Device device = new Device(resultDevices.get(i).IpAddress, resultDevices.get(i).Port);
          devices.pushMap(device.mapToWritableMap());
        }
        sendArrayEvent(RESULTS, devices);
      }
      if(resultDevices.size() == 0) {
        WritableMap eventParams = Arguments.createMap();
        sendMapEvent(NO_DEVICES, eventParams);
      }
    }
  }

  private Boolean socketIsAvailable(Device device, int timeout) {
    Socket soc = new Socket();
    try {
      sendMapEvent(CHECK, device.mapToWritableMap());
      InetSocketAddress socAddress = new InetSocketAddress(device.IpAddress, device.Port);
      soc.connect(socAddress, timeout);
      soc.close();
      return true;
    } catch(IOException error) {
      Error socketError = new Error(error.getMessage());
      sendMapEvent(CONNECTION_ERROR, socketError.mapToWritableMap());
      error.printStackTrace();
      try {
        soc.close();
      } catch(IOException e) {
        e.printStackTrace();
      }
      return false;
    }
  }

  private String getSubnetAddress(int address)
  {
      String ipString = String.format(
              "%d.%d.%d",
              (address & 0xff),
              (address >> 8 & 0xff),
              (address >> 16 & 0xff));
      return ipString;
  }

  private void sendMapEvent(String eventName, WritableMap params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("FLD_"+eventName, params);
  }

  private void sendArrayEvent(String eventName, WritableArray params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("FLD_"+eventName, params);
  }
}
