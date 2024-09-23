import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LWM2MPostOperationsParametersService } from '../../services';
import { AlertService, CoreModule, CommonModule, gettext } from '@c8y/ngx-components';
import { LWM2MPostOperationsParameters } from '../../model';
import { filter, Observable, of } from 'rxjs';
import { LWM2MBulRegistrationDetailData } from '.';
import { Lwm2mBulkRegistrationService } from './lwm2m-bulk-operation.service';
import { StatusFilterModule } from '@c8y/ngx-components/operations/status-filter';
import { OperationStatusOption, OperationStatusOptionsMapShared } from '@c8y/ngx-components/operations/shared';
import { OperationStatus } from '@c8y/client';
import { data } from 'cypress/types/jquery';

@Component({
  selector: 'lwm2m-registrations-details',
  templateUrl: './details.component.html',
  standalone: true,
  imports: [CommonModule, CoreModule, StatusFilterModule]
})
export class LWM2MDetailsComponent implements OnInit {
  @Input()
  csvId: number;

  OPERATION_STATUS_OPTIONS_MAP: OperationStatusOptionsMapShared = {
    PENDING: {
      label: 'Pending',
      status: OperationStatus.PENDING,
      icon: 'clock-o',
      styleClass: ''
    } as unknown as OperationStatusOption,
    SUCCESSFUL: {
      label: 'Success',
      status: OperationStatus.SUCCESSFUL,
      icon: 'check-circle',
      styleClass: 'text-success'
    } as unknown as OperationStatusOption,
    FAILED: {
      label: 'Failed',
      status: OperationStatus.FAILED,
      icon: 'exclamation-circle',
      styleClass: 'text-danger'
    } as unknown as OperationStatusOption
  };

  registrationDetails$: Observable<LWM2MBulRegistrationDetailData[]> = of([]);

  constructor(private service: Lwm2mBulkRegistrationService) {}

  ngOnInit(): void {
    console.log('INIT');
    this.registrationDetails$ = this.service.getRegistrationDetailsByCsvId(this.csvId);
  }

  getOperationsByStatus([evt]) {
    const { status } = evt;
    console.log('s', status);
  }
}
