import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LWM2MPostOperationsParametersService } from '../../services';
import { AlertService, CoreModule, CommonModule, gettext } from '@c8y/ngx-components';
import { LWM2MPostOperationsParameters } from '../../model';

@Component({
  selector: 'lwm2m-post-operations',
  templateUrl: './lwm2m-post-operations.component.html',
  standalone: true,
  imports: [CommonModule, CoreModule]
})
export class LWM2MPostOperationsComponent implements OnInit {
  @ViewChild('commandsForm') commandsForm: NgForm;

  exampleCommands = [
    {
      command: 'discover',
      resource: '<objectId>',
      description: gettext('Discover all resources of Object 3300, the generic sensor.')
    },
    {
      command: 'read',
      resource: '<objectId>/<objectInstanceId>/<resourceId>',
      description: gettext('Read maximum sensor value')
    },
    {
      command: 'write',
      resource: '<objectId>/<objectInstanceId>/<resourceId> <applicationType>',
      description: gettext('Write application type "CO2" to device')
    },
    {
      command: 'execute',
      resource: '<objectId>/<objectInstanceId>/<resourceId>',
      description: gettext('Reset min and max values')
    },
    {
      command: 'observe',
      resource: '<objectId>/<objectInstanceId>/<resourceId>',
      description: gettext('Observe sensor value. Causes device to send every new sensor value')
    },
    {
      command: 'writeattr',
      resource: '<objectId>/<objectInstanceId>/<resourceId> greater=<value>',
      description: gettext('Only send observations if sensor value is higher than 100')
    }
  ];

  operations: LWM2MPostOperationsParameters = {
    commands: '',
    type: '',
    id: ''
  };

  constructor(
    private lwm2mPostOperationsSvc: LWM2MPostOperationsParametersService,
    private alertService: AlertService
  ) {}

  async ngOnInit() {
    this.operations = (await this.getPostOperationsParameters()) as LWM2MPostOperationsParameters;
  }

  async save(operations: LWM2MPostOperationsParameters) {
    try {
      await this.lwm2mPostOperationsSvc.put(operations);
      this.alertService.success(gettext('Post-operations saved'));
      this.commandsForm.form.markAsPristine();
    } catch (error) {
      this.alertService.addServerFailure(error);
    }
  }

  async getPostOperationsParameters() {
    try {
      const res = await this.lwm2mPostOperationsSvc.get();
      return (await res.json()) as LWM2MPostOperationsParameters;
    } catch (error) {
      this.alertService.addServerFailure(error);
      return {};
    }
  }
}
