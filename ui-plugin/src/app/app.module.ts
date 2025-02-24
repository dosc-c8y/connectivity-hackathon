import { EnvironmentProviders, importProvidersFrom, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule as ngRouterModule } from '@angular/router';
import { BootstrapComponent, CoreModule, RouterModule } from '@c8y/ngx-components';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ngRouterModule.forRoot([], { enableTracing: false, useHash: true }),
    RouterModule.forRoot(),
    CoreModule.forRoot()
  ],
  bootstrap: [BootstrapComponent]
})
export class AppModule {}
