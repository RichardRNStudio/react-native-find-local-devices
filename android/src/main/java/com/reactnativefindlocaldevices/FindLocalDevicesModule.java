package com.reactnativefindlocaldevices;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;

import java.util.List;
import java.util.ArrayList;
import java.net.Socket;
import java.net.InetSocketAddress;
import java.net.InetAddress;
import java.io.IOException;

import com.reactnativefindlocaldevices.Device;

public class FindLocalDevicesModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;
  private final String new_device_found = "new_device_found";
  private final String connection_error = "connection_error";
  private final String no_devices = "no_devices";
  private final String no_ports = "no_ports";

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
    if (params.hasKey("reconnect")) {
      timeout = params.getInt("timeout");
    } else {
      timeout = 20;
    }
    ReadableArray ports = params.getArray("ports");
    if(ports.size() == 0) {
      WritableMap eventParams = Arguments.createMap();
      sendEvent(no_ports, eventParams);
    } else {
      startPingService(timeout, ports);
    }
  }

  private void startPingService(int timeout, @Nullable ReadableArray ports)
  {
    ArrayList<Device> devices = new ArrayList<Device>();
    Thread thread = new Thread(new Runnable() {
      @Override
      public void run() {
        try {
          WifiManager mWifiManager = (WifiManager) reactContext.getSystemService(Context.WIFI_SERVICE);
          WifiInfo mWifiInfo = mWifiManager.getConnectionInfo();
          String subnet = getSubnetAddress(mWifiManager.getDhcpInfo().gateway);
          if(ports.size() > 0) {
            for(int j=0; j<ports.size(); j++) {
              for (int i=1; i<255; i++) {
                String host = subnet + "." + i;
                if(socketIsAvailable(host, ports.getInt(j), timeout)) {
                  WritableMap eventParams = Arguments.createMap();
                  eventParams.putString("ipAddress", host);
                  eventParams.putInt("port", ports.getInt(j));
                  devices.add(new Device(host, ports.getInt(j)));
                  sendEvent(new_device_found, eventParams);
                }   
              }  
            }      
            if(devices.size() == 0) {
              WritableMap eventParams = Arguments.createMap();
              sendEvent(no_devices, eventParams);
            }
          } else {
            WritableMap eventParams = Arguments.createMap();
            sendEvent(no_ports, eventParams);
          }
        }
        catch(Exception e){
        }
      }
    });
    thread.start();
  }

  private Boolean socketIsAvailable(String host, int port, int timeout) {
    Socket soc = new Socket();
    try {      
      InetSocketAddress socAddress = new InetSocketAddress(host, port);
      soc.connect(socAddress, timeout);
      return true;
    } catch(IOException e) {
      e.printStackTrace();
      return false;
    } finally {
      try {
        soc.close();
      } catch(IOException e) {
        e.printStackTrace();
      }
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

  private void sendEvent(String eventName, @Nullable WritableMap params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }
}
