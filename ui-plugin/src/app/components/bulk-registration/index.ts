export * from './bulk-reg-main.component';

export interface LWM2MBulkRegistration {
  csv: string,
  uploadDate: string,
  totalDevices: number,
  successfulDevices: number,
  failedDevices: number,
  id: number
};

export interface LWM2MBulRegistrationDetailData {
  endpoint: string,
  status: 'SUCCESS' | 'FAILED' | 'PENDING',
  processedTime?: string,
  failureReason?: string,
  csvId: number
}

