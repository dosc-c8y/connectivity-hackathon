import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AlertService, CoreModule, Permissions } from '@c8y/ngx-components';
import { Lwm2mUIThemeModule } from '../../../formly';
import { FormlyFieldConfig, FormlyFormBuilder, FormlyFormOptions } from '@ngx-formly/core';
import { Endpoint, permissionAlert } from '../../../model';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Lwm2mConfigurationService } from '../../../services';

@Component({
  templateUrl: './form-wrapper-base.component.html',
  imports: [CoreModule, Lwm2mUIThemeModule],
  standalone: true
})
export abstract class Lwm2mFormWrapperBase<T> implements OnInit, OnDestroy {
  private alertService: AlertService;
  protected abstract endpoint: Endpoint;
  protected destroy$: Subject<void> = new Subject();

  model = {} as T;
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  buttons = {};
  options: FormlyFormOptions = {
    formState: { disabled: false }
  };

  constructor(protected service: Lwm2mConfigurationService<T>) {
    this.fields = this.createForm();

    inject(FormlyFormBuilder)?.buildForm(this.form, this.fields, this.model, this.options);

    if (!inject(Permissions)?.hasRole('ROLE_INVENTORY_ADMIN')) {
      this.alertService = inject(AlertService);
      this.alertService.info(permissionAlert.text as string);
      this.form.disable();
      this.options.formState.disabled = true;
    }
  }

  abstract createForm(): FormlyFieldConfig[];

  ngOnInit(): void {
    this.service.settings$.pipe(takeUntil(this.destroy$)).subscribe(next => (this.model = next));
    this.service.getSettingsFor({ endpoint: this.endpoint });
  }

  ngOnDestroy(): void {
    this.alertService?.remove(permissionAlert);
    this.destroy$.next();
    this.destroy$.complete();
  }

  save() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.service.updateConfig(this.model, this.endpoint);
  }

  cancel = () => {
    this.options.resetModel();
    this.service.getSettingsFor({ endpoint: this.endpoint });
  };
}
