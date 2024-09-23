import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LWM2MPostOperationsParametersService } from '../../services';
import { AlertService, CoreModule, CommonModule, gettext } from '@c8y/ngx-components';
import { LWM2MPostOperationsParameters } from '../../model';
import { Lwm2mBulkRegistrationService } from './lwm2m-bulk-operation.service';
import { LWM2MBulkRegistration, LWM2MBulRegistrationDetailData } from '.';
import { OPERATION_STATUS_OPTIONS_MAP, OperationStatusOption, OperationStatusOptionsMapShared } from '@c8y/ngx-components/operations/shared';
import { OperationStatus } from '@c8y/client';
import { Observable, of } from 'rxjs';
import { StatusFilterModule } from '@c8y/ngx-components/operations/status-filter';
import { LWM2MDetailsComponent } from './details.component';

@Component({
  selector: 'lwm2m-bulk-reg-main',
  templateUrl: './bulk-reg-main.component.html',
  standalone: true,
  imports: [CommonModule, CoreModule, LWM2MDetailsComponent]
})
export class LWM2MBulkRegMainComponent implements OnInit {
  bulkRegistrations: LWM2MBulkRegistration[] = [];
  registrationDetails$: Observable<LWM2MBulRegistrationDetailData[]> = of([]);
  progressBar = 0;
  detailsCollapsed = true;

  OPERATION_STATUS_OPTIONS_MAP: OperationStatusOptionsMapShared = OPERATION_STATUS_OPTIONS_MAP;

  options = {
    SUCCESS: {
      label: 'SUCCESS',
      status: OperationStatus.SUCCESSFUL
    } as OperationStatusOption,
    FAILED: {
      label: 'FAILED',
      status: OperationStatus.FAILED
    } as OperationStatusOption,
    PENDING: {
      label: 'PENDING',
      status: OperationStatus.PENDING
    } as OperationStatusOption
  }

  constructor(private bulkRegistrationService: Lwm2mBulkRegistrationService) {}

  ngOnInit(): void {
    this.bulkRegistrationService.getRegistrations();

    // Fetch all bulk registrations
    this.bulkRegistrationService.getBulkRegistrations().subscribe(data => {
      this.bulkRegistrations = data;
    });
  }

  getRegistrationDetails(csvId: number) {
    return this.bulkRegistrationService.getRegistrationDetailsByCsvId(csvId);
  }

  progressBarProgressFn(id: number) {
    return (
      ((this.bulkRegistrations[id].successfulDevices + this.bulkRegistrations[id].failedDevices) /
        this.bulkRegistrations[id].totalDevices) *
      100
    );
  }

  getOperationsByStatus($event, index) {
    //return this.registrationDetails;
  }
}
