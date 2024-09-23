import { Injectable } from '@angular/core';
import {
  FetchClient,
  IFetchOptions,
  IFetchResponse,
  IIdentified,
  IResult,
  Service
} from '@c8y/client';
import {
  Lwm2mManagedObject,
  c8y_lwm2m,
  agentBaseUrl
} from '../model';

@Injectable({
  providedIn: 'root'
})
export class Lwm2mClientService<T extends IIdentified> extends Service<IIdentified> {
  protected listUrl = 'device';
  protected baseUrl = agentBaseUrl;

  constructor(client: FetchClient) {
    super(client);
  }

  isLwm2mDevice(mo: Lwm2mManagedObject) {
    return (
      !!mo?.c8y_IsLwm2mDevice || mo?.c8y_DeviceTypes?.includes(c8y_lwm2m) || mo?.type === c8y_lwm2m
    );
  }

  detail(entityOrId: string | number | T, filter: object = {}): Promise<IResult<T | any>> {
    return super.detail(entityOrId, filter) as Promise<IResult<T | any>>;
  }

  update(entity: T): Promise<IResult<T | any>> {
    return super.update(entity) as Promise<IResult<T | any>>;
  }

  fetch(url: string, init?: IFetchOptions): Promise<IFetchResponse> {
    return super.fetch(url, init);
  }
}
