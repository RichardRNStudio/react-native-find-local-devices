package com.reactnativefindlocaldevices;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class Error {
    public String Message;

    public Error(String msg) {
        this.Message = msg;
    }

    public WritableMap mapToWritableMap() {
        WritableMap error = Arguments.createMap();
        error.putString("message", this.Message);
        return error;
    }
}