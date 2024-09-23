import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyFieldConfig, FormlyFormBuilder, FormlyFormOptions } from '@ngx-formly/core';
import {
  BindingMode,
  Lwm2mBootstrapParameters,
  SecurityMode
} from '../../model';
import {
  gettext,
  AlertService,
  Permissions,
  Alert,
  CommonModule,
  CoreModule
} from '@c8y/ngx-components';
import { Lwm2mBootstrapParametersService } from '../../services';

@Component({
  selector: 'c8y-lwm2m-bootstrap-parameters',
  templateUrl: './lwm2m-bootstrap-parameters.component.html',
  imports: [CommonModule, CoreModule],
  standalone: true
})
export class Lwm2mBootstrapParametersComponent implements OnInit, OnDestroy {
  fields: FormlyFieldConfig[];
  form: FormGroup = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {
    formState: {
      disabled: false,
      mainModel: this.model
    }
  };

  private readonly writePermissionMissingAlert: Alert = {
    text: gettext('You do not have write permissions. This form is read-only.'),
    type: 'info'
  };

  private readonly DISABLED_HINT_TEXT: string = gettext(
    'Change the security mode to enable this field.'
  );
  private readonly pattern: RegExp = /^([a-fA-F0-9]{2})+$/;
  private deviceId: string;

  constructor(
    private alertService: AlertService,
    private permissions: Permissions,
    private builder: FormlyFormBuilder,
    private lwm2mBootstrapParametersSvc: Lwm2mBootstrapParametersService,
    private route: ActivatedRoute
  ) {
    this.deviceId = this.route?.snapshot?.parent?.params?.['id'];
  }

  async ngOnInit() {
    const parameters: Lwm2mBootstrapParameters = await this.getBootstrapParameters();
    const {
      bindingMode,
      bootstrapId,
      bootstrapKey,
      bootstrapShortServerId,
      defaultMaximumPeriod,
      defaultMinimumPeriod,
      securityMode,
      endpoint,
      generateBootstrapServerConfig,
      lwm2mShortServerId,
      serverUri,
      registrationLifeTime,
      serverPublicKey,
      securityInstanceOffset,
      publicKeyOrId,
      secretKey
    }: Lwm2mBootstrapParameters = parameters;

    const leftFields: FormlyFieldConfig[] = [
      {
        key: 'endpoint',
        id: 'bs-endpoint',
        type: 'string',
        defaultValue: endpoint,
        props: {
          label: gettext('Endpoint'),
          placeholder: 'urn:imei:012345678901234',
          readonly: true
        }
      },
      {
        key: 'securityMode',
        id: 'bs-securityMode',
        type: 'select',
        defaultValue: securityMode || SecurityMode.NO_SEC,
        props: {
          label: gettext('Security mode'),
          options: [
            { label: SecurityMode.NO_SEC, value: SecurityMode.NO_SEC },
            { label: SecurityMode.PSK, value: SecurityMode.PSK }
          ],
          required: true
        }
      },
      {
        key: 'bootstrapId',
        id: 'bs-bootstrapId',
        type: 'string',
        props: {
          label: gettext('Bootstrap PSK ID'),
          description: this.DISABLED_HINT_TEXT,
          required: true
        },
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            field?.formControl?.patchValue(bootstrapId);
          }
        },
        expressions: {
          'props.disabled': (field: FormlyFieldConfig) =>
            this.disablePSKField(field)
        }
      },
      {
        key: 'bootstrapKey',
        id: 'bs-bootstrapKey',
        type: 'string',
        props: {
          label: gettext('Bootstrap pre-shared key'),
          description: this.DISABLED_HINT_TEXT,
          placeholder: '0123456789abcdef',
          required: true,
          pattern: this.pattern
        },
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            field?.formControl?.patchValue(bootstrapKey);
          }
        },
        expressions: {
          'props.disabled': (field: FormlyFieldConfig) =>
            this.disablePSKField(field)
        }
      },
      {
        key: 'securityInstanceOffset',
        id: 'bs-securityInstanceOffset',
        type: 'number',
        defaultValue: securityInstanceOffset,
        props: {
          label: gettext('Security instance offset'),
          placeholder: '0',
          min: 0
        }
      },
      {
        key: 'bootstrapShortServerId',
        id: 'bs-bootstrapShortServerId',
        type: 'number',
        defaultValue: bootstrapShortServerId,
        props: {
          label: gettext('LWM2M bootstrap short server ID'),
          placeholder: '0',
          min: 0
        }
      },
      {
        key: 'registrationLifeTime',
        id: 'bs-registrationLifeTime',
        type: 'number',
        defaultValue: registrationLifeTime,
        props: {
          label: gettext('Registration lifetime'),
          description: gettext('in seconds'),
          placeholder: '600',
          min: 0
        }
      },
      {
        key: 'bindingMode',
        id: 'bs-bindingMode',
        type: 'select',
        defaultValue: bindingMode || BindingMode.U,
        props: {
          label: gettext('Binding mode'),
          options: [
            { label: gettext('UDP'), value: BindingMode.U },
            { label: gettext('UDP with queue mode'), value: BindingMode.UQ }
          ]
        }
      }
    ];

    const rightFields: FormlyFieldConfig[] = [
      {
        key: 'serverPublicKey',
        id: 'bs-serverPublicKey',
        type: 'string',
        defaultValue: serverPublicKey,
        props: {
          label: gettext('Server public key'),
          placeholder: 'AAAAB3NzaC1yc2E…'
        }
      },
      {
        key: 'serverUri',
        id: 'bs-serverUri',
        type: 'string',
        defaultValue: serverUri,
        props: {
          label: gettext('LWM2M server URI'),
          placeholder: 'coaps://<LWM2M-server-domain>:<coaps-port>'
        }
      },
      {
        key: 'publicKeyOrId',
        id: 'bs-publicKeyOrId',
        type: 'string',
        props: {
          label: gettext('LWM2M PSK ID'),
          description: this.DISABLED_HINT_TEXT,
          required: true
        },
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            field?.formControl?.patchValue(publicKeyOrId);
          }
        },
        expressions: {
          'templateOptions.disabled': (field: FormlyFieldConfig) =>
            this.disablePSKField(field)
        }
      },
      {
        key: 'secretKey',
        id: 'bs-secretKey',
        type: 'string',
        props: {
          label: gettext('LWM2M pre-shared key'),
          description: this.DISABLED_HINT_TEXT,
          placeholder: '0123456789abcdef',
          required: true,
          pattern: this.pattern
        },
        hooks: {
          onInit: (field: FormlyFieldConfig) => {
            field?.formControl?.patchValue(secretKey);
          }
        },
        expressions: {
          'props.disabled': (field: FormlyFieldConfig) =>
            this.disablePSKField(field)
        }
      },
      {
        key: 'lwm2mShortServerId',
        id: 'bs-lwm2mShortServerId',
        type: 'number',
        defaultValue: lwm2mShortServerId,
        props: {
          label: gettext('LWM2M short server ID'),
          placeholder: '0',
          min: 0
        }
      },
      {
        key: 'generateBootstrapServerConfig',
        id: 'bs-generateBootstrapServerConfig',
        type: 'select',
        defaultValue: generateBootstrapServerConfig || false,
        props: {
          label: gettext('Generate bootstrap server config'),
          options: [
            { label: gettext('Yes'), value: true },
            { label: gettext('No'), value: false }
          ]
        }
      },
      {
        key: 'defaultMinimumPeriod',
        id: 'bs-defaultMinimumPeriod',
        type: 'number',
        defaultValue: defaultMinimumPeriod,
        props: {
          label: gettext('Default minimum period'),
          description: gettext('in seconds'),
          placeholder: '10',
          min: 0
        }
      },
      {
        key: 'defaultMaximumPeriod',
        id: 'bs-defaultMaximumPeriod',
        type: 'number',
        defaultValue: defaultMaximumPeriod,
        props: {
          label: gettext('Default maximum period'),
          description: gettext('in seconds'),
          placeholder: '60',
          min: 0
        }
      }
    ];

    this.fields = [
      {
        fieldGroupClassName: 'card-block d-grid grid__col--6-6',
        fieldGroup: [
          {
            fieldGroupClassName: 'form-group p-24 p-t-8 p-b-8 m-b-0',
            fieldGroup: leftFields
          },
          {
            fieldGroupClassName: 'form-group p-24 p-t-8 p-b-8 m-b-0',
            fieldGroup: rightFields
          }
        ]
      }
    ];

    this.builder.buildForm(this.form, this.fields, this.model, this.options);

    const userHasWritePermission = this.permissions.hasRole('ROLE_INVENTORY_ADMIN');

    if (Object.keys(parameters).length === 0 || !userHasWritePermission) {
      this.form.disable();
      this.options.formState.disabled = true;
    }

    if (!userHasWritePermission) {
      this.alertService.info(this.writePermissionMissingAlert.text as string);
    }
  }

  ngOnDestroy() {
    // alertService checks if given alert exists.
    // save to remove it without additional checks
    this.alertService.remove(this.writePermissionMissingAlert);
  }

  disablePSKField(
    field: FormlyFieldConfig
  ) {
    if (this.options.formState.disabled) {
      delete field?.props?.description;
      return true;
    } else if (
      !this.options.formState.mainModel.securityMode ||
      this.options.formState.mainModel.securityMode === SecurityMode.NO_SEC
    ) {
      field.props.description = this.DISABLED_HINT_TEXT;
      field?.formControl?.patchValue(null);
      return true;
    }
    delete field?.props?.description;
    return false;
  }

  async save() {
    try {
      await this.lwm2mBootstrapParametersSvc.update({ ...this.model, ...{ id: this.deviceId } });
      this.alertService.success(gettext('Bootstrap parameters updated'));
      // disables save button
      this.form.markAsPristine();
      this.form.updateValueAndValidity();
    } catch (error) {
      this.alertService.addServerFailure(error);
    }
  }

  async getBootstrapParameters(): Promise<Lwm2mBootstrapParameters> {
    try {
      return (await this.lwm2mBootstrapParametersSvc.detail(this.deviceId))
        .data as Lwm2mBootstrapParameters;
    } catch (error) {
      this.alertService.addServerFailure(error);
      return {};
    }
  }
}
