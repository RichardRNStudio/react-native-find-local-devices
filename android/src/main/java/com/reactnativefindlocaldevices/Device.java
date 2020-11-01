package com.reactnativefindlocaldevices;

public class Device {
    public String IpAddress;
    public Integer Port;

    public Device(String ip, Integer port) {
        this.IpAddress = ip;
        this.Port = port;
    }

    public Device(String ip) {
        this.IpAddress = ip;
    }
}