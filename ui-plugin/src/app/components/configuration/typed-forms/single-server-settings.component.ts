import { Component, OnInit, inject } from '@angular/core';
import { AlertService, CoreModule, DroppedFile, gettext } from '@c8y/ngx-components';
import { Lwm2mUIThemeModule } from '../../../formly';
import { Lwm2mConfigurationService } from '../../../services';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  BindingMode,
  CertificateUsage,
  Endpoint,
  Mode,
  Security,
  ServerSettings,
  ValidationType
} from '../../../model';
import { Lwm2mFormWrapperBase } from './form-wrapper-base.component';
import { catchError, filter, map, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';

@Component({
  templateUrl: './form-wrapper-base.component.html',
  imports: [CoreModule, Lwm2mUIThemeModule, RouterModule],
  standalone: true
})
export class Lwm2mFormSingleServerSettings
  extends Lwm2mFormWrapperBase<ServerSettings>
  implements OnInit
{
  id: string;
  protected endpoint: Endpoint = Endpoint.servers;
  protected alert: AlertService;
  private readonly COAP = 'coap://';
  private readonly COAPS = 'coaps://';
  private router: Router;
  private route: ActivatedRoute;

  constructor(protected service: Lwm2mConfigurationService<ServerSettings>) {
    super(service);
    this.router = inject(Router);
    this.route = inject(ActivatedRoute);
    this.alert = inject(AlertService);
  }

  ngOnInit(): void {
    this.service.settings$.pipe(takeUntil(this.destroy$)).subscribe(data => (this.model = data));
    this.service.getSettingsFor({ endpoint: this.endpoint, id: this.id });
  }

  createForm() {
    return [
      {
        wrappers: ['legend'],
        fieldGroup: [
          {
            key: 'bootstrap',
            type: 'switch',
            defaultValue: false,
            props: {
              label: gettext('Is bootstrap server'),
              description: gettext('This configuration is for a bootstrap server')
            }
          },
          {
            key: 'uri',
            type: 'input-addon',
            props: {
              label: gettext('Server URI'),
              addonLabel: this.COAP,
              required: true,
              placeholder: '<LWM2M-server-domain>:<coap(s)-port>'
            },
            hooks: {
              onInit: (field: FormlyFieldConfig) => {
                field.props.addonLabel = this.COAP;
                return field.options.fieldChanges.pipe(
                  filter(
                    e => e.type === 'valueChanges' && (e.field === field || e.field.key === 'mode')
                  ),
                  map(e => {
                    if (e.field.key === 'uri')
                      field.formControl.setValue(
                        ((e.value as string) || '').replace(/^.*:\/\//i, '')
                      );
                    field.props.addonLabel =
                      field.model?.security?.mode === Mode.NO_SEC ? this.COAP : this.COAPS;
                    return e;
                  })
                );
              }
            }
          },
          {
            key: 'security',
            wrappers: ['legend'],
            props: {
              label: 'Security'
            },
            fieldGroup: [
              {
                type: '#securityMode',
                props: {
                  options: Object.values(Mode).map(value => ({ label: value, value }))
                }
              },
              { type: '#pskId' },
              { type: '#pskKey' },
              {
                key: 'x509ServerCertificateName',
                type: 'select',
                props: {
                  label: gettext('Server certificate'),
                  placeholder: gettext('Not written'),
                  acceptUndefined: true,
                  removeExempliGratia: true,
                  options: this.service.certificates$.pipe(
                    map(certs => certs.map(value => ({ label: value, value })))
                  )
                },
                expressions: {
                  'props.disabled': (field: FormlyFieldConfig) =>
                    field?.options?.formState?.disabled,
                  hide: (field: FormlyFieldConfig) => {
                    return field.model?.mode !== Mode.X509;
                  }
                }
              },
              {
                key: 'certificateUsage',
                type: 'select',
                props: {
                  label: gettext('Certificate usage'),
                  placeholder: gettext('Not written'),
                  acceptUndefined: true,
                  removeExempliGratia: true,
                  options: Object.values(CertificateUsage).map(value => ({ label: value, value }))
                },
                expressions: {
                  'props.disabled': (field: FormlyFieldConfig) =>
                    field?.options?.formState?.disabled,
                  hide: (field: FormlyFieldConfig) => {
                    return field.model?.mode !== Mode.X509;
                  }
                }
              },
              {
                key: 'certificateDropArea',
                type: 'file',
                props: {
                  accept: 'pem',
                  label: gettext('Certificate'),
                  description: gettext('One .pem file may be uploaded'),
                  forceHideList: true,
                  dropped: async (files: DroppedFile[]) =>
                    this.patchCommonName(
                      this.service.cleanUpBase64Data(
                        (await files?.pop()?.readAsDataURL()) as string
                      )
                    )
                },
                expressions: {
                  hide: (field: FormlyFieldConfig) => {
                    return (
                      field.model?.mode !== Mode.X509 || !!field.model?.x509CertificateCommonName
                    );
                  }
                }
              },
              {
                key: 'x509CertificateCommonName',
                type: 'file-pick-replace',
                props: {
                  label: gettext('Certificate common name'),
                  remove: () => this.removeCertificateAndCommonName(),
                  onPick: certificate => this.patchCommonName(certificate)
                },
                expressions: {
                  'props.disabled': (field: FormlyFieldConfig) =>
                    field?.options?.formState?.disabled,
                  hide: (field: FormlyFieldConfig) => {
                    return (
                      field.model?.mode !== Mode.X509 || !field.model?.x509CertificateCommonName
                    );
                  }
                }
              },
              {
                key: 'privateKeyDropArea',
                type: 'file',
                props: {
                  accept: 'pem',
                  label: gettext('Private key'),
                  description: gettext('One .pem file may be uploaded'),
                  forceHideList: true,
                  disabled: true,
                  dropped: async (files: DroppedFile[]) =>
                    this.patchFingerprint(
                      this.service.cleanUpBase64Data(
                        (await files?.pop()?.readAsDataURL()) as string
                      )
                    )
                },
                expressions: {
                  'props.disabled': (field: FormlyFieldConfig) =>
                    field?.options?.formState?.disabled,
                  hide: (field: FormlyFieldConfig) => {
                    return (
                      field.model?.mode !== Mode.X509 || !!field.model?.x509PrivateKeyFingerPrint
                    );
                  }
                }
              },
              {
                key: 'x509PrivateKeyFingerPrint',
                type: 'file-pick-replace',
                props: {
                  label: gettext('Private key fingerprint'),
                  remove: () => this.removePrivateKeyAndFingerprint(),
                  onPick: privateKey => this.patchFingerprint(privateKey)
                },
                expressions: {
                  'props.disabled': (field: FormlyFieldConfig) =>
                    field?.options?.formState?.disabled,
                  hide: (field: FormlyFieldConfig) => {
                    return (
                      field.model?.mode !== Mode.X509 || !field.model?.x509PrivateKeyFingerPrint
                    );
                  }
                }
              }
            ]
          },
          {
            wrappers: ['legend'],
            props: {
              label: gettext('Server Object configuration')
            },
            fieldGroup: [
              {
                key: 'storeNotifications',
                type: 'switch',
                defaultValue: false,
                props: {
                  label: gettext('Store notifications'),
                  description: gettext(
                    'LWM2M Client to store notify operations when client is offline or LWM2M Server is disabled and forward them to the LWM2M Server when the client is able to connect'
                  )
                }
              },
              {
                key: 'shortServerId',
                type: 'number',
                props: {
                  label: gettext('Short Server ID'),
                  description: gettext('in numbers'),
                  placeholder: '1',
                  min: 0
                }
              },
              {
                key: 'registrationLifetime',
                type: 'number',
                props: {
                  label: gettext('Registration lifetime'),
                  description: gettext('in seconds'),
                  placeholder: '600',
                  min: 0
                }
              },
              {
                key: 'defaultMinPeriod',
                type: 'number',
                props: {
                  label: gettext('Default min period'),
                  description: gettext('in seconds'),
                  placeholder: '10',
                  min: 0
                }
              },
              {
                key: 'defaultMaxPeriod',
                type: 'number',
                props: {
                  label: gettext('Default max period'),
                  description: gettext('in seconds'),
                  placeholder: '60',
                  min: 0
                }
              },
              {
                key: 'bindingMode',
                type: 'select',
                defaultValue: BindingMode.U,
                props: {
                  label: gettext('Binding mode'),
                  options: Object.values(BindingMode).map(value => ({
                    label:
                      value === BindingMode.U ? gettext('UDP') : gettext('UDP with queue mode'),
                    value
                  }))
                }
              },
              {
                key: 'disableTimeout',
                type: 'number',
                props: {
                  label: gettext('Disable timeout'),
                  description: gettext('in seconds'),
                  placeholder: '86400',
                  min: 0
                }
              }
            ]
          }
        ]
      }
    ];
  }

  save() {
    this.service
      .update$({
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

  delete() {
    this.service
      .deleteServer$(this.model)
      .pipe(
        catchError(err => {
          this.alert.addServerFailure(err);
          return of(null);
        })
      )
      .subscribe(_next => this.cancel());
  }

  cancel = () => this.router.navigate(['../servers'], { relativeTo: this.route });

  protected getFullURI() {
    const {
      uri,
      security: { mode = Mode.NO_SEC }
    } = this.model;
    return (mode === Mode.NO_SEC ? this.COAP : this.COAPS).concat(uri);
  }

  private patchFingerprint(privateKey: string) {
    if (privateKey?.length > 0) {
      this.service
        .validate(privateKey, ValidationType.PRIVATE_KEY)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          fingerprint => {
            this.model.security.x509PrivateKey = privateKey;
            this.model.security.x509PrivateKeyFingerPrint = fingerprint;
            this.form.patchValue(this.model);
            this.form.markAsDirty();
          },
          _error => {
            // already catched
          }
        );
    }
  }

  private patchCommonName(certificate: string) {
    if (certificate?.length > 0) {
      this.service
        .validate(certificate, ValidationType.X509)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          commonName => {
            this.model.security.x509Certificate = certificate;
            this.model.security.x509CertificateCommonName = commonName;
            this.form.patchValue(this.model);
            this.form.markAsDirty();
          },
          _error => {
            // already catched
          }
        );
    }
  }

  private removePrivateKeyAndFingerprint() {
    this.form.patchValue({
      security: {
        x509PrivateKey: null,
        x509PrivateKeyFingerPrint: null
      } as Partial<Security>
    });
    delete this.model?.security?.x509PrivateKey;
    delete this.model?.security?.x509PrivateKeyFingerPrint;
    this.form.markAsDirty();
  }

  private removeCertificateAndCommonName() {
    this.form.patchValue({
      security: {
        x509Certificate: null,
        x509CertificateCommonName: null
      } as Partial<Security>
    });
    delete this.model?.security?.x509CertificateCommonName;
    delete this.model?.security?.x509Certificate;
    this.form.markAsDirty();
  }
}
