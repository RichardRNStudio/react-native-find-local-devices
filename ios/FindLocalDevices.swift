@objc(FindLocalDevices)
class FindLocalDevices: NSObject {

    @objc(getLocalDevices:withResolver:withRejecter:)
    func getLocalDevices(timeout: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }
}
