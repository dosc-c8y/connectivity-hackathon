import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlertService, CoreModule, Permissions } from '@c8y/ngx-components';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Lwm2mFormWrapperBase } from './form-wrapper-base.component';
import { Endpoint, Settings } from '../../../model';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Lwm2mConfigurationService } from '../../../services';
import { Lwm2mUIThemeModule } from '../../../formly';
import { Component } from '@angular/core';
import { Lwm2mLegendFieldWrapper } from '../../../formly/lwm2m-legend-wrapper.component';
import { Lwm2mFilePickAndReplaceType } from '../../../formly/lwm2m-file-pick-and-replace.type.component';
import { Lwm2mInputGroupAddonType } from '../../../formly/lwm2m-input-group-addon.type.component';

@Component({
  template: '',
  imports: [CoreModule, Lwm2mLegendFieldWrapper, Lwm2mFilePickAndReplaceType, Lwm2mInputGroupAddonType],
  standalone: true
})
class WrapperMock extends Lwm2mFormWrapperBase<Settings> {
  endpoint: Endpoint.deviceSettings;

  createForm(): FormlyFieldConfig[] {
    return [];
  }
}

const alertService = {
  info: () => {},
  remove: () => {}
};

describe('LWM2M FormWrapperBase Component', () => {
  let component: WrapperMock;
  let fixture: ComponentFixture<WrapperMock>;
  let getSettingsForSpy;
  let alertInfoSpy;
  let saveSpy;
  let alertRemoveSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), BrowserAnimationsModule, RouterTestingModule],
      providers: [
        Lwm2mConfigurationService<Settings>,
        { provide: AlertService, useValue: alertService }
      ]
    });
  });

  describe('no permissions', () => {
    beforeEach(() => {
      TestBed.overrideProvider(Permissions, { useValue: { hasRole: () => false } });
      TestBed.compileComponents();
      fixture = TestBed.createComponent(WrapperMock);
      component = fixture.componentInstance;

      alertInfoSpy = jest.spyOn(TestBed.inject(AlertService), 'info');
      alertRemoveSpy = jest.spyOn(TestBed.inject(AlertService), 'remove');

      fixture.detectChanges();
    });

    test('form should be disabled if no permissions', () => {
      expect(component.options.formState.disabled).toBe(true);
    });

    test('should show info alert', () => {
      expect(alertInfoSpy).toHaveBeenCalled();
    });

    test('should remove alert from alerts list', () => {
      component.ngOnDestroy();
      expect(alertRemoveSpy).toHaveBeenCalled();
    });
  });

  describe('with permissions', () => {
    beforeEach(() => {
      TestBed.overrideProvider(Permissions, { useValue: { hasRole: () => true } });
      TestBed.compileComponents();
      fixture = TestBed.createComponent(WrapperMock);
      component = fixture.componentInstance;

      getSettingsForSpy = jest.spyOn(component['service'], 'getSettingsFor');
      saveSpy = jest.spyOn(component['service'], 'updateConfig');

      fixture.detectChanges();
    });

    describe('onInit', () => {
      test('should create', () => {
        expect(component).toBeTruthy();
      });
      test('getSettingsFor called', () => {
        expect(getSettingsForSpy).toHaveBeenCalled();
      });
      test('form should be enabled default', () => {
        expect(component.options.formState.disabled).toBe(false);
      });
      test('should set the model', () => {
        expect(component.model).toEqual({});
      });
    });

    describe('save', () => {
      test('should call service updateConfig', () => {
        component.model = { awakeTime: 1 };
        component.endpoint = Endpoint.deviceSettings;
        component.save();
        fixture.detectChanges();

        expect(saveSpy).toHaveBeenCalledWith({ awakeTime: 1 }, Endpoint.deviceSettings);
      });
    });

    describe('cancel', () => {
      test('should request persisted data to recreate state before user interacted with the form', () => {
        component.endpoint = Endpoint.deviceSettings;
        component.cancel();
        fixture.detectChanges();

        expect(getSettingsForSpy).toHaveBeenCalledWith({ endpoint: Endpoint.deviceSettings });
      });
    });
  });
});
