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

import com.reactnativefindlocaldevices.Device;

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
  public void getLocalDevices(int timeout, Promise promise) {
    this.startPingService(reactContext, timeout, promise);
  }

  @ReactMethod
  public void startPingService(ReactApplicationContext context, int timeout, Promise reactPromise)
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
                if(socketIsAvailable(host, 50001, timeout)) {
                  devices.add(new Device(host));
                }
              }
          }
          if(devices.size() == 0) {            
            reactPromise.resolve("NO_DEVICES");
          } else {
            reactPromise.resolve(devices.toString());
          }
        }
        catch(Exception e){
          reactPromise.resolve(e.getMessage());
        }
      }
    });
    thread.start();
  }

  private Boolean socketIsAvailable(String host, int port, int timeout) {
    Socket soc = new Socket();
    try {
      InetSocketAddress socAddress = new InetSocketAddress(host, 50001);
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
