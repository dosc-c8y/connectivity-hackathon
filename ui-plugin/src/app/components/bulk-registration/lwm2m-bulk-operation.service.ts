import { Injectable } from '@angular/core';
import { LWM2MBulkRegistration, LWM2MBulRegistrationDetailData } from '.';
import { Observable, of } from 'rxjs';
import { Client, FetchClient, Service } from '@c8y/client';
import { Lwm2mClientService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class Lwm2mBulkRegistrationService extends Lwm2mClientService<unknown> {
  private readonly detailUrl: string = '/v1/registration';

  constructor(protected client: FetchClient) {
    super(client)
  }

  // Mock data for bulk registrations
  private bulkRegistrations: LWM2MBulkRegistration[] = [
    {
      csv: 'devices_1.csv',
      uploadDate: '2023-09-17',
      totalDevices: 100,
      successfulDevices: 90,
      failedDevices: 3,
      id: 1
    },
    {
      csv: 'devices_2.csv',
      uploadDate: '2023-09-15',
      totalDevices: 200,
      successfulDevices: 90,
      failedDevices: 0,
      id: 2
    }
  ];

  // Mock data for registration details
  private registrationDetails: LWM2MBulRegistrationDetailData[] = [
    {
      endpoint: 'device-001',
      status: 'SUCCESS',
      processedTime: '2023-09-17T10:00:00Z',
      csvId: 1
    },
    {
      endpoint: 'device-002',
      status: 'FAILED',
      processedTime: '2023-09-17T10:05:00Z',
      failureReason: 'Network Error',
      csvId: 1
    },
    {
      endpoint: 'device-101',
      status: 'PENDING',
      csvId: 2
    },
    {
      endpoint: 'device-102',
      status: 'SUCCESS',
      processedTime: '2023-09-15T09:00:00Z',
      csvId: 2
    }
  ];

  // Observable to get all bulk registrations
   getBulkRegistrations() {
    return of(this.bulkRegistrations);
  }

  // Observable to get registration details by CSV id
  getRegistrationDetailsByCsvId(csvId: number): Observable<LWM2MBulRegistrationDetailData[]> {
    const details = this.registrationDetails.filter(detail => detail.csvId === csvId);
    return of(details);
  }
  
  async getRegistrations() {
    const resp = await super.fetch(this.detailUrl);
    const data = await resp.json();
  }
}
