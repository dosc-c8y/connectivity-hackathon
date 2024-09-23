import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CoreModule, gettext } from '@c8y/ngx-components';
import { Lwm2mUIThemeModule } from '../../../formly';
import { ServerSettings } from '../../../model';
import { Lwm2mConfigurationService } from '../../../services';
import { Lwm2mFormSingleServerSettings } from './single-server-settings.component';
import { map, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Lwm2mFormCreateSingleServerSettings } from './create-single-server-settings.component';
import { Observable, Subject } from 'rxjs';

@Component({
  templateUrl: './server-settings.component.html',
  imports: [CoreModule, Lwm2mUIThemeModule, Lwm2mFormSingleServerSettings, RouterModule],
  standalone: true
})
export class Lwm2mFormServerSettings implements OnInit {
  private componentRef: ComponentRef<
    Lwm2mFormSingleServerSettings | Lwm2mFormCreateSingleServerSettings
  >;
  private destroy$: Subject<void> = new Subject();
  @ViewChild('singleServerForm', { read: ViewContainerRef, static: true })
  formContainer: ViewContainerRef;
  cmp: Lwm2mFormSingleServerSettings;
  id: string;
  listelements$: Observable<Object>;

  constructor(
    protected service: Lwm2mConfigurationService<ServerSettings>,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit() {
    this.listelements$ = this.service.servers$.pipe(
      map(servers =>
        servers.map(server => ({
          title: server.uri || gettext('Invalid server configuration'),
          icon: 'server',
          id: server.id
        }))
      )
    );
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(({ id }) => {
      this.id = id;
      this.service.listServers();
      this.createComponent(id);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  select(id) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { id },
      queryParamsHandling: 'merge'
    });
  }

  createComponent(id) {
    this.formContainer.clear();
    this.cmp = null;

    if (!id) return;

    this.componentRef = this.formContainer.createComponent(
      id !== 'create' ? Lwm2mFormSingleServerSettings : Lwm2mFormCreateSingleServerSettings
    );
    this.cmp = this.componentRef?.instance;
    this.cmp.id = id;
  }
}
