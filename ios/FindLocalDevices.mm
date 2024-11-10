#import "FindLocalDevices-Bridging-Header.h"
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <SystemConfiguration/CaptiveNetwork.h>
#import <netinet/in.h>
#import <sys/socket.h>
#import <ifaddrs.h>
#import <arpa/inet.h>
#include <fcntl.h>

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

    dispatch_semaphore_t semaphore = dispatch_semaphore_create(10); // Limit to 10 concurrent scans

    for (NSNumber *port in ports) {
        int portInt = [port intValue];
        for (int i = 1; i <= 255 && isDiscovering; i++) {
            NSString *host = [NSString stringWithFormat:@"%@.%d", subnet, i];

            // Enter the dispatch group and wait for the semaphore
            dispatch_semaphore_wait(semaphore, DISPATCH_TIME_FOREVER);
            dispatch_group_enter(group);

            dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
                NSDictionary *deviceInfo = @{@"ip": host, @"port": @(portInt)};
                [self sendEventWithName:@"FLD_CHECK" body:deviceInfo];
                BOOL isAvailable = [self socketIsAvailableForHost:host port:portInt timeout:timeout];
                if (isAvailable) {
                    NSDictionary *deviceInfo = @{@"ip": host, @"port": @(portInt)};
                    [devices addObject:deviceInfo];
                    if (hasListeners) {
                        [self sendEventWithName:@"FLD_NEW_DEVICE_FOUND" body:deviceInfo];
                    }
                }
                dispatch_semaphore_signal(semaphore); // Release semaphore
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

void setSocketTimeout(int sock, long milliseconds) {
  struct timeval timeout;
  timeout.tv_sec = milliseconds / 1000;                  // Convert to seconds
  timeout.tv_usec = (milliseconds % 1000) * 1000;        // Convert remainder to microseconds

  // Set receive timeout
  if (setsockopt(sock, SOL_SOCKET, SO_RCVTIMEO, (const char*)&timeout, sizeof(timeout)) < 0) {
      throw std::runtime_error("Failed to set receive timeout");
  }

  // Set send timeout
  if (setsockopt(sock, SOL_SOCKET, SO_SNDTIMEO, (const char*)&timeout, sizeof(timeout)) < 0) {
      throw std::runtime_error("Failed to set send timeout");
  }
}

- (BOOL)socketIsAvailableForHost:(NSString *)host port:(int)port timeout:(int)timeout {
  int sock = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP);
  if (sock < 0) {
    RCTLogError(@"Failed to create socket.");
    return NO;
  }

  // Set the socket to non-blocking mode
  int flags = fcntl(sock, F_GETFL, 0);
  if (flags == -1 || fcntl(sock, F_SETFL, flags | O_NONBLOCK) == -1) {
    close(sock);
    return NO;
  }

  struct sockaddr_in addr;
  addr.sin_family = AF_INET;
  addr.sin_port = htons(port);
  inet_pton(AF_INET, [host UTF8String], &addr.sin_addr);

  int result = connect(sock, (struct sockaddr *)&addr, sizeof(addr));

  if (result == 0) {
    close(sock);
    return YES; // Connected successfully
  } else if (errno != EINPROGRESS) {
    close(sock);
    return NO; // Connection failed immediately for non-timeout reasons
  }

  // Use select() to wait for the socket to become writable within the timeout
  fd_set writefds;
  struct timeval tv;
  tv.tv_sec = timeout / 1000;  // Seconds
  tv.tv_usec = (timeout % 1000) * 1000;  // Microseconds

  FD_ZERO(&writefds);
  FD_SET(sock, &writefds);

  int selectResult = select(sock + 1, NULL, &writefds, NULL, &tv);
  close(sock);

  if (selectResult > 0 && FD_ISSET(sock, &writefds)) {
    // The connection attempt was successful
    return YES;
  } else {
    // Report connection error if listeners are active
    if (hasListeners) {
      NSDictionary *errorInfo = @{@"ip": host, @"port": @(port)};
      [self sendEventWithName:@"FLD_CONNECTION_ERROR" body:errorInfo];
    }
    return NO; // Connection failed or timed out
  }
}


RCT_EXPORT_METHOD(cancelDiscovering) {
  isDiscovering = NO;  // Set flag to NO to cancel discovery
}

@end
