package com.reactnativefindlocaldevices;

import android.content.Context;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.net.InetAddress;
import java.io.IOException;
import java.util.List;
import java.util.ArrayList;
import java.net.Socket;
import java.net.InetSocketAddress;

import com.google.gson.*;
import com.reactnativefindlocaldevices.Device;
import com.reactnativefindlocaldevices.Port;

public class FindLocalDevicesModule extends ReactContextBaseJavaModule {
  private static ReactApplicationContext reactContext;

  FindLocalDevicesModule(ReactApplicationContext context) {
    super(context);
    reactContext = context;
  }

  public String getName() {
    return "FindLocalDevices";
  }

  @ReactMethod
  public void getLocalDevices(int timeout, String ports, Promise promise) {
    Gson gson = new Gson();
    Port[] portList = gson.fromJson(ports, Port[].class);
    this.startPingService(reactContext, timeout, portList, promise);
  }

  public void startPingService(ReactApplicationContext context, int timeout, Port[] portList, Promise reactPromise)
  {
    Thread thread = new Thread(new Runnable() {
      List<Device> devices = new ArrayList<Device>();
      @Override
      public void run() {
        try {
          WifiManager mWifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
          WifiInfo mWifiInfo = mWifiManager.getConnectionInfo();
          String subnet = getSubnetAddress(mWifiManager.getDhcpInfo().gateway);

          for (int i=1; i<255; i++) {
              String host = subnet + "." + i;
              if (InetAddress.getByName(host).isReachable(timeout)) {
                if(portList.length > 0) {
                  for(int j=0; j<portList.length; j++) {
                    if(socketIsAvailable(host, portList[j].value, timeout)) {
                      devices.add(new Device(host, portList[j].value));
                    }
                  }          
                } else {
                  devices.add(new Device(host));
                }
              }
          }
          if(devices.size() == 0) {            
            reactPromise.resolve("NO_DEVICES");
          } else {
            Gson gson = new Gson();
            reactPromise.resolve(gson.toJson(devices));
          }
        }
        catch(Exception e){
          reactPromise.reject(e.getMessage());
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
}
