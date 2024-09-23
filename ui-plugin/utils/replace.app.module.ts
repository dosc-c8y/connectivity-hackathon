import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UpgradeModule as NgUpgradeModule } from '@angular/upgrade/static';
import { CoreModule, RouterModule } from '@c8y/ngx-components';
import { ActilityDeviceRegistrationModule } from '@c8y/ngx-components/actility-device-registration';
import { AssetsNavigatorModule } from '@c8y/ngx-components/assets-navigator';
import { BinaryFileDownloadModule } from '@c8y/ngx-components/binary-file-download';
import { BookmarksModule } from '@c8y/ngx-components/bookmarks';
import { ChildDevicesModule } from '@c8y/ngx-components/child-devices';
import {
  DeviceInfoDashboardModule,
  DeviceManagementHomeDashboardModule
} from '@c8y/ngx-components/context-dashboard';
import { DeviceListModule } from '@c8y/ngx-components/device-list';
import { DeviceProfileModule } from '@c8y/ngx-components/device-profile';
import { DeviceProtocolsModule } from '@c8y/ngx-components/device-protocols';
import { DeviceShellModule } from '@c8y/ngx-components/device-shell';
import { DiagnosticsModule } from '@c8y/ngx-components/diagnostics';
import { LocationModule } from '@c8y/ngx-components/location';
import { LoriotDeviceRegistrationModule } from '@c8y/ngx-components/loriot-device-registration';
import { OperationsModule } from '@c8y/ngx-components/operations';
import { LpwanProtocolModule } from '@c8y/ngx-components/protocol-lpwan';
import { OpcuaProtocolModule } from '@c8y/ngx-components/protocol-opcua';
import { RegisterDeviceModule } from '@c8y/ngx-components/register-device';
import { RepositoryModule } from '@c8y/ngx-components/repository';
import { SearchModule } from '@c8y/ngx-components/search';
import { ServicesModule } from '@c8y/ngx-components/services';
import { SigfoxDeviceRegistrationModule } from '@c8y/ngx-components/sigfox-device-registration';
import { SubAssetsModule } from '@c8y/ngx-components/sub-assets';
import { trackingFeatureProvider } from '@c8y/ngx-components/tracking';
import { TrustedCertificatesModule } from '@c8y/ngx-components/trusted-certificates';
import {
  DashboardUpgradeModule,
  HybridAppModule,
  UPGRADE_ROUTES,
  UpgradeModule
} from '@c8y/ngx-components/upgrade';
import { cockpitWidgets } from '@c8y/ngx-components/widgets/cockpit';
import { deviceManagementWidgets } from '@c8y/ngx-components/widgets/device-management';

@NgModule({
  imports: [
    // Upgrade module must be the first
    UpgradeModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([...UPGRADE_ROUTES]),
    CoreModule.forRoot(),
    AssetsNavigatorModule.config({
      smartGroups: true
    }),
    OperationsModule,
    OpcuaProtocolModule,
    TrustedCertificatesModule,
    NgUpgradeModule,
    DashboardUpgradeModule,
    RepositoryModule,
    DeviceProfileModule,
    BinaryFileDownloadModule,
    SearchModule,
    ServicesModule,
    LpwanProtocolModule,
    SubAssetsModule,
    ChildDevicesModule,
    DeviceManagementHomeDashboardModule,
    deviceManagementWidgets(),
    cockpitWidgets(['cockpit.welcome.widget', 'Cockpit Welcome']),
    DeviceInfoDashboardModule,
    RegisterDeviceModule,
    SigfoxDeviceRegistrationModule,
    ActilityDeviceRegistrationModule,
    LoriotDeviceRegistrationModule,
    DeviceShellModule,
    DeviceProtocolsModule,
    DiagnosticsModule,
    DeviceListModule,
    BookmarksModule,
    LocationModule.config({ addLocation: true })
  ],
  providers: [trackingFeatureProvider]
})
export class AppModule extends HybridAppModule {
  constructor(protected upgrade: NgUpgradeModule) {
    super();
  }
}
