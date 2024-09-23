import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule, Permissions } from '@c8y/ngx-components';
import { keys } from 'lodash-es';
import { Lwm2mBootstrapParametersComponent } from './lwm2m-bootstrap-parameters.component';
import { Lwm2mBootstrapParametersService } from '../../services';
import { BindingMode, Lwm2mBootstrapParameters, SecurityMode } from '../../model';

describe('Lwm2mBootstrapParametersComponent', () => {
  let component: Lwm2mBootstrapParametersComponent;
  let fixture: ComponentFixture<Lwm2mBootstrapParametersComponent>;
  let lwm2mBootstrapParametersSvc: Lwm2mBootstrapParametersService;
  let hasRoleSpy;
  let permissions: Permissions;
  let form: FormGroup;
  const deviceId = 123;

  const bootstrapParameters: Lwm2mBootstrapParameters = {
    endpoint: 'my-test-endpoint',
    securityInstanceOffset: 10,
    bootstrapShortServerId: 1,
    registrationLifeTime: 10,
    serverPublicKey: 'pub-key-1',
    serverUri: 'my-test-server-uri',
    lwm2mShortServerId: 1,
    defaultMinimumPeriod: 1,
    defaultMaximumPeriod: 10,
    bootstrapId: null,
    bootstrapKey: null,
    publicKeyOrId: null,
    secretKey: null,
    securityMode: SecurityMode.NO_SEC,
    bindingMode: BindingMode.UQ,
    generateBootstrapServerConfig: true
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), BrowserAnimationsModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              parent: { params: { id: deviceId } }
            }
          }
        },
        {
          provide: Lwm2mBootstrapParametersService,
          useValue: {
            detail: jest.fn().mockReturnValue(
              Promise.resolve({
                res: { status: 200 },
                data: bootstrapParameters
              })
            ),
            update: jest.fn().mockReturnValue(
              Promise.resolve({
                res: { status: 200 },
                data: bootstrapParameters
              })
            )
          }
        }
      ]
    });
    permissions = TestBed.inject(Permissions);
    lwm2mBootstrapParametersSvc = TestBed.inject(Lwm2mBootstrapParametersService);
    fixture = TestBed.createComponent(Lwm2mBootstrapParametersComponent);
    component = fixture.componentInstance;
    form = component.form;

    hasRoleSpy = jest.spyOn(permissions, 'hasRole').mockImplementation(() => true);

    fixture.detectChanges();
  });

  it('should create component instance', () => {
    expect(component).toBeDefined();
  });

  describe('GET and PUT bootstrap parameters', () => {
    it('should call detail method to get bootsrtap parameters', fakeAsync(() => {
      // given
      //getBootstrapParametersSpy.and.callThrough();

      // when
      component.ngOnInit();
      flush();
      fixture.detectChanges();

      // then
      expect(lwm2mBootstrapParametersSvc.detail).toHaveBeenCalledWith(deviceId);
      expect(component.model).toEqual(bootstrapParameters);
    }));

    it('should call update method when component save is triggered', fakeAsync(() => {
      // given
      fixture.detectChanges();

      // when
      component.save();
      flush();

      // then
      expect(lwm2mBootstrapParametersSvc.update).toHaveBeenCalledWith({
        ...bootstrapParameters,
        ...{ id: deviceId }
      });
    }));

    it('should render form when GET request fails', fakeAsync(() => {
      // given
      lwm2mBootstrapParametersSvc.detail = jest.fn().mockReturnValue(Promise.resolve({ res: { status: 404 }, data: {} }))

      // when
      component.ngOnInit();
      flush();
      fixture.detectChanges();

      // then
      expect(fixture.nativeElement.querySelectorAll('formly-form').length).toEqual(1);
    }));

    it('should mark form as disabled when GET request fails', async () => {
      // given
      lwm2mBootstrapParametersSvc.detail = jest.fn().mockReturnValue(Promise.resolve({ res: { status: 404 }, data: {} }));

      // when
      await component.ngOnInit();

      // then
      expect(component.options.formState.disabled).toBe(true);
      expect(form.disabled).toBe(true);
    });
  });

  describe('Handling of PSK fields and values', () => {
    const invalid = {
      value: '0123456789abcdefg'
    };
    let field;
    beforeEach(() => {
      // mock
      field = {
        props: {
          description: ''
        },
        formControl: {
          patchValue: jest.fn()
        }
      };
      fixture.detectChanges();
    });

    it('should raise an error for the field with key: "bootstrapKey"', () => {
      // given
      const bootstrapKey = form.controls['bootstrapKey'];

      // when
      form.controls['securityMode'].patchValue(SecurityMode.PSK);
      fixture.detectChanges();
      bootstrapKey.patchValue(invalid.value);
      fixture.detectChanges();

      expect(bootstrapKey.value).toBe(invalid.value);
      expect(bootstrapKey.invalid).toBe(true);
      expect(keys(bootstrapKey.errors).some(k => k === 'pattern')).toBe(true);
    });

    it('should raise an error for the field with key: "secretKey"', () => {
      // given
      const secretKey = form.controls['secretKey'];

      // when
      form.controls['securityMode'].patchValue(SecurityMode.PSK);
      fixture.detectChanges();
      secretKey.patchValue(invalid.value);
      fixture.detectChanges();

      expect(secretKey.value).toBe(invalid.value);
      expect(secretKey.invalid).toBe(true);
      expect(keys(secretKey.errors).some(k => k === 'pattern')).toBe(true);
    });

    it('should check if field is disabled', () => {
      // given
      // mock: field

      // when
      fixture.detectChanges();

      // then
      expect(component.disablePSKField(field)).toBe(true);
      expect(field.formControl.patchValue).toHaveBeenCalledWith(null);
      expect(field.props.description).toBeDefined();
      expect(field.props.description.length).toBeGreaterThan(0);
    });

    it('should check if field is enabled', () => {
      // given
      // mock: field

      // when
      form.controls['securityMode'].patchValue(SecurityMode.PSK);
      fixture.detectChanges();

      // then
      expect(component.disablePSKField(field)).toBe(false);
      expect(field.formControl.patchValue).toHaveBeenCalledTimes(0);
      expect(keys(field.props).some(k => k === 'description')).toBe(false);
    });

    it('should be disabled when security mode is "NO_SEC"', () => {
      // when
      // then
      expect(form.controls['bootstrapId'].disabled).toBe(true);
      expect(form.controls['bootstrapKey'].disabled).toBe(true);
      expect(form.controls['publicKeyOrId'].disabled).toBe(true);
      expect(form.controls['secretKey'].disabled).toBe(true);
    });

    it('should be enabled when security mode is "PSK"', () => {
      // when
      form.controls['securityMode'].patchValue(SecurityMode.PSK);
      fixture.detectChanges();

      // then
      expect(form.controls['bootstrapId'].disabled).toBe(false);
      expect(form.controls['bootstrapKey'].disabled).toBe(false);
      expect(form.controls['publicKeyOrId'].disabled).toBe(false);
      expect(form.controls['secretKey'].disabled).toBe(false);
    });

    it('PSK fields should be disabled, when whole form is disabled', async () => {
      // given
      component.model = { securityMode: SecurityMode.PSK };
      hasRoleSpy.mockReturnValue(false);
      await component.ngOnInit();

      // then
      expect(component.options.formState.disabled).toBe(true);
      expect(form.controls['securityMode'].value).toBe(SecurityMode.PSK);

      expect(form.disabled).toBe(true);

      expect(form.controls['bootstrapId'].disabled).toBe(true);
      expect(form.controls['bootstrapKey'].disabled).toBe(true);
      expect(form.controls['publicKeyOrId'].disabled).toBe(true);
      expect(form.controls['secretKey'].disabled).toBe(true);
    });
  });

  describe('Permissions', () => {
    beforeEach(() => {
      hasRoleSpy.mockReturnValue(false);
    });

    it('should render save button', async () => {
      // given
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      const container = btn.parentElement;
      hasRoleSpy.mockReturnValue(true);

      // when
      await component.ngOnInit();

      // then
      expect(btn?.textContent?.trim()).toBe('Save');
      expect(container).toBeDefined();
      expect((container as HTMLElement).className).toContain('card-footer');
      expect((container as HTMLElement).hasAttribute('hidden')).toBe(false);
    });

    it('should hide container with save button', async () => {
      // given
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
      const container = btn.parentElement;
      await component.ngOnInit();

      // when
      fixture.detectChanges();

      // then
      expect(btn?.textContent?.trim()).toBe('Save');
      expect(container).toBeDefined();
      expect((container as HTMLElement).className).toContain('card-footer');
      expect((container as HTMLElement).hasAttribute('hidden')).toBe(true);
    });

    it('forms should be disabled when write permissions for user are missing', async () => {
      // given
      // when
      await component.ngOnInit();

      // then
      expect(form.disabled).toBe(true);
    });
  });

  describe('Save button clickable', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be disabled initally, when form is valid but pristine', () => {
      // given
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      // when
      fixture.detectChanges();

      // then
      expect(btn?.textContent?.trim()).toBe('Save');
      expect(form.valid).toBe(true);
      expect(form.dirty).toBe(false);
      expect(btn.hasAttribute('disabled')).toBe(true);
    });

    it('should be enabled when form is valid and dirty', () => {
      // given
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      // when
      form.markAsDirty();
      fixture.detectChanges();

      // then
      expect(btn?.textContent?.trim()).toBe('Save');
      expect(form.valid).toBe(true);
      expect(form.dirty).toBe(true);
      expect(btn.hasAttribute('disabled')).toBe(false);
    });

    it('should be disabled when form gets invalid again', () => {
      // given
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');

      // when
      form.markAsDirty();
      fixture.detectChanges();

      // then
      expect(btn?.textContent?.trim()).toBe('Save');
      expect(form.valid).toBe(true);
      expect(form.dirty).toBe(true);
      expect(btn.hasAttribute('disabled')).toBe(false);

      // when
      // min value is 0, -1 will be invalid
      form.controls['defaultMaximumPeriod'].patchValue(-1);
      fixture.detectChanges();

      // then
      expect(form.valid).toBe(false);
      expect(btn.hasAttribute('disabled')).toBe(true);
    });
  });
});
