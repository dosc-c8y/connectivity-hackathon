import { NgModule } from '@angular/core';
import { FORMLY_CONFIG, FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyPresetModule } from '@ngx-formly/core/preset';
import { Lwm2mLegendFieldWrapper } from './lwm2m-legend-wrapper.component';
import { Mode } from '../model';
import { Lwm2mFilePickAndReplaceType } from './lwm2m-file-pick-and-replace.type.component';
import { Lwm2mInputGroupAddonType } from './lwm2m-input-group-addon.type.component';
import {
  gettext,
  CommonModule as C8yCommonModule,
  FormsModule as C8yFormsModule,
  DynamicFormsModule
} from '@c8y/ngx-components';

@NgModule({
  imports: [C8yCommonModule, C8yFormsModule, DynamicFormsModule, FormlyPresetModule],
  declarations: [Lwm2mLegendFieldWrapper, Lwm2mFilePickAndReplaceType, Lwm2mInputGroupAddonType],
  providers: [
    {
      provide: FORMLY_CONFIG,
      multi: true,
      useValue: {
        wrappers: [
          {
            name: 'legend',
            component: Lwm2mLegendFieldWrapper
          }
        ],
        presets: [
          {
            name: 'securityMode',
            config: {
              key: 'mode',
              type: 'select',
              defaultValue: Mode.NO_SEC,
              props: {
                label: gettext('Mode')
              }
            }
          },
          {
            name: 'pskId',
            config: {
              key: 'pskId',
              type: 'string',
              props: {
                label: gettext('PSK ID'),
                required: true
              },
              expressions: {
                'props.disabled': (field: FormlyFieldConfig) => field?.options?.formState?.disabled,
                hide: (field: FormlyFieldConfig) => {
                  return field.model?.mode !== Mode.PSK;
                }
              }
            }
          },
          {
            name: 'pskKey',
            config: {
              key: 'pskKey',
              type: 'string',
              props: {
                label: gettext('Pre-shared key'),
                placeholder: '0123456789abcdef',
                pattern: '^([a-fA-F0-9]{2})+$',
                required: true
              },
              expressions: {
                'props.disabled': (field: FormlyFieldConfig) => field?.options?.formState?.disabled,
                hide: (field: FormlyFieldConfig) => {
                  return field.model?.mode !== Mode.PSK;
                }
              }
            }
          }
        ],
        types: [
          {
            name: 'switch',
            extends: 'checkbox',
            defaultOptions: {
              props: {
                switchMode: true,
                indeterminate: false
              }
            }
          },
          {
            name: 'file-pick-replace',
            component: Lwm2mFilePickAndReplaceType,
            wrappers: ['c8y-form-field']
          },
          {
            name: 'input-addon',
            component: Lwm2mInputGroupAddonType,
            wrappers: ['c8y-form-field']
          }
        ],
        validationMessages: [
          {
            name: 'invalidType',
            message: gettext('The selected file is not supported.')
          },
          {
            name: 'strReplaceError',
            message: gettext('The selected file is not processable.')
          }
        ]
      }
    }
  ]
})
export class Lwm2mUIThemeModule {}
