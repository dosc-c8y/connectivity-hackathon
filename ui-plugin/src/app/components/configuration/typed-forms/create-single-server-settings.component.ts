import { Component, OnInit } from '@angular/core';
import { CoreModule } from '@c8y/ngx-components';
import { Lwm2mUIThemeModule } from '../../../formly';
import { ServerSettings } from '../../../model';
import { Lwm2mConfigurationService } from '../../../services';
import { Lwm2mFormSingleServerSettings } from './single-server-settings.component';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  templateUrl: './form-wrapper-base.component.html',
  imports: [CoreModule, Lwm2mUIThemeModule],
  standalone: true
})
export class Lwm2mFormCreateSingleServerSettings
  extends Lwm2mFormSingleServerSettings
  implements OnInit
{
  constructor(protected service: Lwm2mConfigurationService<ServerSettings>) {
    super(service);
  }

  ngOnInit() {
    // override by design
  }

  create() {
    this.service
      .createServer$({
        ...this.model,
        uri: this.getFullURI()
      })
      .pipe(
        catchError(err => {
          this.alert.addServerFailure(err);
          return of(null);
        })
      )
      .subscribe(_next => this.cancel());
  }
}
