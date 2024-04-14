import { type IDevice } from './IDevice.interface';

declare type DefaultPortScannerCallback = (device: IDevice) => void;

export interface IPortScanner {
  ports: number[];
  timeout: number;
  onDeviceFound: DefaultPortScannerCallback;
  onFinish: (device: IDevice[]) => void;
  onCheck: DefaultPortScannerCallback;
  onNoDevices: () => void;
  onError: (error: string) => void;
}
