import { Component, ElementRef, ViewChild } from '@angular/core';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { Lwm2mConfigurationService } from '../services';
import { AlertService, FilesService } from '@c8y/ngx-components';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'c8y-lwm2m-file-pick-replace-type',
  templateUrl: './lwm2m-file-pick-and-replace.type.component.html',
  standalone: true,
  imports: [CommonModule, FormlyModule]
})
export class Lwm2mFilePickAndReplaceType extends FieldType<FieldTypeConfig> {
  @ViewChild('picker', { static: false }) picker: ElementRef<HTMLInputElement>;
  private fileReader = new FileReader();

  constructor(
    private service: Lwm2mConfigurationService<unknown>,
    private fileService: FilesService,
    private alertService: AlertService
  ) {
    super();
  }

  onFocus() {
    this.picker?.nativeElement.click();
    this.field.focus = true;
  }

  onPick(event) {
    this.formControl.setErrors(null);

    this.fileService.getFileExtension(event?.target?.files[0]) === 'pem'
      ? this.fileReader.readAsDataURL(event?.target?.files[0])
      : this.field?.formControl.setErrors({ invalidType: true });

    if (this.props?.onPick instanceof Function && !this.formControl?.errors) {
      this.fileReader.onload = () =>
        this.onLoad(this.props.onPick, (error: DOMException) =>
          this.alertService.danger(error.message)
        );
    }
  }

  remove() {
    if (this.props.remove instanceof Function) {
      this.props.remove();
    }
  }

  private onLoad(resolve, reject) {
    if (this.fileReader.readyState !== 2) {
      return;
    }

    if (this.fileReader.error) {
      reject(this.fileReader.error);
    }

    const result = this.service.cleanUpBase64Data(this.fileReader.result as string);
    if (!result) this.formControl.setErrors({ strReplaceError: true });

    resolve(result);
  }
}
