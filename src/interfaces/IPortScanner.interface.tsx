import { type IDevice } from './IDevice.interface';

declare type DefaultPortScannerCallback = (device: IDevice) => void;

export interface IPortScanner {
  ports: number[];
  timeout: number;
  onDeviceFound: DefaultPortScannerCallback;
  onResults: (device: IDevice[]) => void;
  onCheck: DefaultPortScannerCallback;
  onFinished: () => void;
  onError: DefaultPortScannerCallback;
}
