import { Injectable } from '@angular/core';
import { FetchClient, IFetchResponse } from '@c8y/client';
import { Lwm2mClientService } from './lwm2m-client.service';
import { LWM2MPostOperationsParameters } from '../model';

@Injectable({
  providedIn: 'root'
})
export class LWM2MPostOperationsParametersService extends Lwm2mClientService<LWM2MPostOperationsParameters> {
  private readonly detailUrl: string = '/postRegistrationOptions';

  constructor(client: FetchClient) {
    super(client);
  }

  get(): Promise<IFetchResponse> {
    return super.fetch(this.detailUrl);
  }

  put(data: LWM2MPostOperationsParameters) {
    const headers = { 'content-type': 'application/json', accept: 'application/json' };
    return super.fetch(this.detailUrl, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: headers
    });
  }
}
