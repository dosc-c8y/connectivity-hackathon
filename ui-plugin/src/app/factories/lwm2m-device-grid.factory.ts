import { Injectable } from '@angular/core';
import { FetchClient, IIdentified, IResult } from '@c8y/client';
import { DeviceGridExtensionFactory, DeviceGridActionHook } from '@c8y/ngx-components/device-grid';
import {
  AlertService,
  gettext,
  ModalService,
  Status,
  TenantUiService,
  BuiltInActionType
} from '@c8y/ngx-components';
import { TranslateService } from '@ngx-translate/core';
import { Lwm2mClientService } from '../services';
import { agentName, Lwm2mManagedObject } from '../model';

@Injectable({
  providedIn: 'root'
})
export class Lwm2mDeviceGridFactory
  extends Lwm2mClientService<Lwm2mManagedObject>
  implements DeviceGridExtensionFactory
{
  protected listUrl = 'deviceRegistration';

  constructor(
    client: FetchClient,
    private tenantService: TenantUiService,
    private modal: ModalService,
    private translateService: TranslateService,
    private alertService: AlertService
  ) {
    super(client);
  }

  get() {
    console.log('R:P: device grid: delete action');
    return {
      type: BuiltInActionType.Delete,
      deviceMatches: (mo: Lwm2mManagedObject) => super.isLwm2mDevice(mo),
      onAction: (mo: Lwm2mManagedObject) => this.onDelete(mo),
      refreshAfterActionDone: true
    } as DeviceGridActionHook;
  }

  async onDelete(device: Lwm2mManagedObject) {
    if (this.tenantService.isMicroserviceSubscribedInCurrentTenant(agentName)) {
      try {
        await this.modal.confirm(
          gettext('REMOTE Delete LWM2M device'),
          this.translateService.instant(
            gettext(`You are about to delete device "{{ name }}". Do you want to proceed?`),
            device
          ),
          Status.DANGER,
          { ok: gettext('Delete'), cancel: gettext('Cancel') }
        );
        await this.delete(device);
        this.alertService.success(gettext('Device deleted.'));
        return Promise.resolve();
      } catch (ex) {
        if (ex) {
          this.alertService.addServerFailure(ex);
        }
        return Promise.reject();
      }
    } else {
      this.alertService.danger(
        this.translateService.instant(
          gettext(`You can't delete this device. The service "{{ name }}" is not subscribed.`),
          { name: agentName }
        )
      );
      return Promise.reject();
    }
  }

  delete(entityOrId: string | number | IIdentified): Promise<IResult<null>> {
    return super.delete(entityOrId);
  }
}
