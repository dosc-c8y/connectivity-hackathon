import { ModuleWithProviders, NgModule } from '@angular/core';
import { hookNavigator, hookRoute, hookTab } from '@c8y/ngx-components';
import {
  LWM2MPostOpertaionsNavigationFactory
} from './factories';
import {
  Lwm2mMicroserviceGuard,
  Lwm2mDeviceTypeGuard,
  Lwm2mConfigurationApiGuard,
  Lwm2mBootstrapParametersApiGuard
} from './guards';
import { LWM2MBulkRegFactory } from './factories/lwm2m-bulk-reg.factory';

@NgModule()
export class Lwm2mModule {
  static forRoot(): ModuleWithProviders<Lwm2mModule> {
    return {
      ngModule: Lwm2mModule,
      providers: [
        hookNavigator(LWM2MBulkRegFactory),
        hookRoute({
          path: 'lwm2m-configuration',
          loadComponent: () =>
            import(
              './components/bulk-registration'
            ).then(m => m.LWM2MBulkRegMainComponent),
          icon: 'terminal',
          priority: 2000,
          canActivate: [Lwm2mMicroserviceGuard]
        })
      ]
    };
  }
}

@NgModule({ imports: [Lwm2mModule.forRoot()] })
export class Lwm2mModuleWrapper {}
