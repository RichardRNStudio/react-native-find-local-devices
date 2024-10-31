#import "FindLocalDevices-Bridging-Header.h"
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <SystemConfiguration/CaptiveNetwork.h>
#import <netinet/in.h>
#import <sys/socket.h>
#import <ifaddrs.h>
#import <arpa/inet.h>

@implementation FindLocalDevices  {
  BOOL isDiscovering;
  BOOL hasListeners;
  NSMutableSet *discoveredDevices; // Track unique devices
}

RCT_EXPORT_MODULE(FindLocalDevices)

+ (BOOL)requiresMainQueueSetup {
  return YES; // Return YES if the module needs to be initialized on the main thread
}

- (instancetype)init {
  self = [super init];
  isDiscovering = YES;  // Initialize discovery state to YES by default
  hasListeners = NO;
  NSMutableSet *discoveredDevices; // Track unique devices
  return self;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"FLD_NEW_DEVICE_FOUND", @"FLD_CONNECTION_ERROR", @"FLD_NO_DEVICES", @"FLD_NO_PORTS", @"FLD_CHECK", @"FLD_RESULTS"];
}

- (void)startObserving {
  hasListeners = YES; // Set flag to true when JS starts listening
  RCTLogInfo(@"FindLocalDevices: JavaScript listeners started (hasListeners = YES)");
}

- (void)stopObserving {
  hasListeners = NO; // Set flag to false when JS stops listening
  RCTLogInfo(@"FindLocalDevices: JavaScript listeners stopped (hasListeners = NO)");
}
RCT_EXPORT_METHOD(getLocalDevices:(NSDictionary *)params) {
  int timeout = [params[@"timeout"] intValue] ?: 20;
  NSArray *ports = params[@"ports"];

  if (ports.count == 0) {
    if (hasListeners) {
      RCTLogInfo(@"FindLocalDevices: Sending 'FLD_NO_PORTS' event");
      [self sendEventWithName:@"FLD_NO_PORTS" body:@{}];
    } else {
      RCTLogInfo(@"FindLocalDevices: No listeners registered for 'FLD_NO_PORTS' event");
    }
    return;
  }

  isDiscovering = YES;
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    [self discoverDevicesWithTimeout:timeout ports:ports];
  });
}
- (void)discoverDevicesWithTimeout:(int)timeout ports:(NSArray *)ports {
    NSString *subnet = [self getSubnetAddress];
    NSMutableArray *devices = [NSMutableArray new];
    dispatch_group_t group = dispatch_group_create();

    for (NSNumber *port in ports) {
        int portInt = [port intValue];

        for (int i = 1; i <= 255 && isDiscovering; i++) {
            NSString *host = [NSString stringWithFormat:@"%@.%d", subnet, i];

            // Enter the dispatch group before starting the async operation
            dispatch_group_enter(group);

            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                BOOL isAvailable = [self socketIsAvailableForHost:host port:portInt timeout:timeout];

                if (isAvailable) {
                    NSDictionary *deviceInfo = @{@"ip": host, @"port": @(portInt)};
                    if (hasListeners) {
                        [self sendEventWithName:@"FLD_NEW_DEVICE_FOUND" body:deviceInfo];
                    }
                    [devices addObject:deviceInfo];
                }

                // Leave the dispatch group after the check
                dispatch_group_leave(group);
            });
        }
    }

    // Wait for all port checks to complete
    dispatch_group_notify(group, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        if (devices.count > 0 && isDiscovering) {
            if (hasListeners) {
                [self sendEventWithName:@"FLD_RESULTS" body:devices];
            }
        } else if (isDiscovering) {
            if (hasListeners) {
                [self sendEventWithName:@"FLD_NO_DEVICES" body:@{}];
            }
        }
    });
}

- (NSString *)getSubnetAddress {
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    NSString *subnet = nil;

    if (getifaddrs(&interfaces) == 0) {
        temp_addr = interfaces;

        while (temp_addr != NULL) {
            if (temp_addr->ifa_addr->sa_family == AF_INET) {
                if ([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"]) {
                    struct sockaddr_in *addr = (struct sockaddr_in *)temp_addr->ifa_addr;
                    NSString *ipAddress = [NSString stringWithUTF8String:inet_ntoa(addr->sin_addr)];
                    NSArray *components = [ipAddress componentsSeparatedByString:@"."];

                    if (components.count >= 3) {
                        subnet = [NSString stringWithFormat:@"%@.%@.%@", components[0], components[1], components[2]];
                    }
                    break;
                }
            }
            temp_addr = temp_addr->ifa_next;
        }
    }

    freeifaddrs(interfaces);
    return subnet;
}

- (BOOL)socketIsAvailableForHost:(NSString *)host port:(int)port timeout:(int)timeout {
  // Create a socket
  int sock = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP);
  if (sock < 0) {
    RCTLogError(@"Failed to create socket.");
    return NO;
  }

  // Define socket address
  struct sockaddr_in addr;
  addr.sin_family = AF_INET;
  addr.sin_port = htons(port);
  inet_pton(AF_INET, [host UTF8String], &addr.sin_addr);

  // Configure the timeout in microseconds (milliseconds * 1000)
  struct timeval tv;
  tv.tv_sec = timeout / 1000;
  tv.tv_usec = (timeout % 1000) * 1000;

  setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, (const char*)&tv, sizeof(tv));
  setsockopt(sock, SOL_SOCKET, SO_SNDTIMEO, (const char*)&tv, sizeof(tv));

  // Attempt to connect
  int result = connect(sock, (struct sockaddr *)&addr, sizeof(addr));
  close(sock);

  if (result == 0) {
    return YES;
  } else {
    if (hasListeners) {
      RCTLogInfo(@"FindLocalDevices: No open port at %@:%d within %d ms timeout", host, port, timeout);
      NSDictionary *errorInfo = @{@"ip": host, @"port": @(port)};
      [self sendEventWithName:@"FLD_CONNECTION_ERROR" body:errorInfo];
    }
    return NO;
  }
}


RCT_EXPORT_METHOD(cancelDiscovering) {
  isDiscovering = NO;  // Set flag to NO to cancel discovery
}

@end
