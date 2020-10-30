#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FindLocalDevices, NSObject)

RCT_EXTERN_METHOD(getLocalDevices:(int)timeout
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

@end
