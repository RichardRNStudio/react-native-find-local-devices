import { type IDevice } from './IDevice.interface';

declare type PortScannerCallback = (device: IDevice) => void;

export interface IPortScanner {
  ports: number[];
  timeout: number;
  onDeviceFound: PortScannerCallback;
  onResults: (device: IDevice[]) => void;
  onCheck: PortScannerCallback;
  onFinished: () => void;
  onError: PortScannerCallback;
}
