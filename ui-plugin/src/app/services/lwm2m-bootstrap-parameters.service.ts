import { Injectable } from '@angular/core';
import { FetchClient, IResult } from '@c8y/client';
import { Lwm2mBootstrapParameters } from '../model';
import { Lwm2mClientService } from './lwm2m-client.service';

@Injectable({
  providedIn: 'root'
})
export class Lwm2mBootstrapParametersService extends Lwm2mClientService<Lwm2mBootstrapParameters> {
  constructor(client: FetchClient) {
    super(client);
  }

  detail(id: string): Promise<IResult<Lwm2mBootstrapParameters | any>> {
    return super.detail(id);
  }

  update(entity: Lwm2mBootstrapParameters): Promise<IResult<Lwm2mBootstrapParameters | any>> {
    return super.update(entity);
  }

  onBeforeUpdate(entity: Lwm2mBootstrapParameters): Lwm2mBootstrapParameters {
    delete entity.id;
    return entity;
  }

  getDetailUrl(entity: Lwm2mBootstrapParameters): string {
    return `${this.listUrl}/${super.getEntityId(entity)}/bootstrapParams`;
  }
}
