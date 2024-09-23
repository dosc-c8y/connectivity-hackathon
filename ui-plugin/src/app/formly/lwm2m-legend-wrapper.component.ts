import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FieldWrapper, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'c8y-lwm2m-legend-wrapper',
  templateUrl: './lwm2m-legend-wrapper.component.html',
  standalone: true,
  imports: [CommonModule, FormlyModule]
})
export class Lwm2mLegendFieldWrapper extends FieldWrapper {}
