package com.reactnativefindlocaldevices;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class Device {
    public String IpAddress;
    public int Port;

    public Device(String ip, int port) {
        this.IpAddress = ip;
        this.Port = port;
    }

    public Device(String ip) {
        this.IpAddress = ip;
    }

    public WritableMap mapToWritableMap() {
        WritableMap device = Arguments.createMap();
        device.putString("ipAddress", this.IpAddress);
        device.putInt("port", this.Port);
        return device;
    }
}