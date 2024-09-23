import { Component, OnInit } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { gettext } from '@c8y/ngx-components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'c8y-lwm2m-input-group-addon',
  templateUrl: './lwm2m-input-group-addon.type.component.html',
  standalone: true,
  imports: [CommonModule, FormlyModule]
})
export class Lwm2mInputGroupAddonType extends FieldType<FieldTypeConfig> implements OnInit {
  ngOnInit() {
    this.props.addonLabel = this.props?.addonLabel || gettext('undefined');
  }
}
