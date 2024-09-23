import { Component } from '@angular/core';
import { CoreModule, gettext } from '@c8y/ngx-components';
import { Lwm2mUIThemeModule } from '../../../formly';
import {
  BinaryEncoding,
  DeviceSettings,
  Endpoint,
  SerializationFormat
} from '../../../model';
import { Lwm2mFormWrapperBase } from './form-wrapper-base.component';
import { Lwm2mConfigurationService } from '../../../services';

@Component({
  templateUrl: './form-wrapper-base.component.html',
  imports: [CoreModule, Lwm2mUIThemeModule],
  standalone: true
})
export class Lwm2mFormDeviceSettings extends Lwm2mFormWrapperBase<DeviceSettings> {
  protected endpoint: Endpoint = Endpoint.deviceSettings;
  constructor(protected service: Lwm2mConfigurationService<DeviceSettings>) {
    super(service);
  }

  createForm() {
    return [
      {
        wrappers: ['legend'],
        fieldGroup: [
          {
            key: 'endpointId',
            label: gettext('Endpoint client ID'),
            type: 'string',
            props: {
              required: true
            }
          },
          {
            key: 'awakeTime',
            type: 'number',
            props: {
              label: gettext('Awake time registration parameter'),
              description: gettext('in milliseconds, 0 means device is always online'),
              placeholder: '0',
              min: 0
            }
          },
          {
            key: 'requestTimeout',
            type: 'number',
            props: {
              label: gettext('LWM2M request timeout'),
              description: gettext('in milliseconds'),
              placeholder: '180000',
              min: 0
            }
          },
          {
            key: 'binaryEncoding',
            type: 'select',
            defaultValue: BinaryEncoding.OPAQUE,
            props: {
              label: gettext('Binary delivery encoding'),
              options: Object.values(BinaryEncoding).map(value => ({ label: value, value }))
            }
          },
          {
            key: 'serializationFormat',
            type: 'select',
            defaultValue: SerializationFormat.TEXT,
            props: {
              label: gettext('Serialization format'),
              options: [
                ...Object.values(SerializationFormat).map(value => ({ label: value, value }))
              ],
              description: gettext(
                'Indicates the preferred content format for LWM2M Agent to use to communicate with the device'
              )
            }
          },
          {
            key: 'useTimestampResources',
            type: 'switch',
            defaultValue: false,
            props: {
              label: gettext('Use source timestamp'),
              description: gettext(
                'Use common timestamp resources 5518 and 6050 or object specific timestamp for object 6 reported by the device if available.'
              )
            }
          },
          {
            key: 'keepOldValuesOnOperationFail',
            type: 'switch',
            defaultValue: false,
            props: {
              label: gettext('Keep old values'),
              description: gettext('Keep old values in the objects tab if an operation fails.')
            }
          }
        ]
      }
    ];
  }
}
