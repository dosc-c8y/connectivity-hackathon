import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from '@c8y/ngx-components';
import { LWM2MPostOperationsComponent } from './lwm2m-post-operations.component';
import { LWM2MPostOperationsParametersService } from './../../services';
import { LWM2MPostOperationsParameters } from './../../model';


describe('LWM2MPPostOperationsComponent', () => {
  let component: LWM2MPostOperationsComponent;
  let fixture: ComponentFixture<LWM2MPostOperationsComponent>;
  let lwm2mPostOperationsSvc: LWM2MPostOperationsParametersService;
  let form: FormGroup;

  const postOperationsParameters: LWM2MPostOperationsParameters = {
    id: '',
    type: '',
    commands: 'discover 1\nobserve 1'
  };

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [CoreModule.forRoot(), BrowserAnimationsModule, RouterTestingModule, FormsModule],
      providers: [
        {
          provide: LWM2MPostOperationsParametersService,
          useValue: {
            get: jest.fn().mockReturnValue(
              Promise.resolve({
                status: 200,
                json: () => {
                  return postOperationsParameters;
                }
              })
            ),
            put: jest.fn().mockReturnValue(
              Promise.resolve({
                status: 200,
                json: () => {
                  return postOperationsParameters;
                }
              })
            )
          }
        }
      ]
    });
    lwm2mPostOperationsSvc = TestBed.inject(LWM2MPostOperationsParametersService);
    fixture = TestBed.createComponent(LWM2MPostOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = component.commandsForm.form;
    fixture.detectChanges();
    jest.spyOn(component, 'getPostOperationsParameters').mockImplementation(() => Promise.resolve(postOperationsParameters));
    fixture.detectChanges();
  });

  it('should create component instance', () => {
    expect(component).toBeDefined();
  });

  describe('GET and PUT post operation parameters', () => {
    it('should call get method to get post operation parameters', fakeAsync(() => {
      // given
      form = component.commandsForm.form;
      fixture.detectChanges();

      // when
      component.ngOnInit();
      flush();
      fixture.detectChanges();

      // then
      expect(lwm2mPostOperationsSvc.get).toHaveBeenCalled();
      expect(component.operations.commands).toBe(postOperationsParameters.commands);
      expect(form.get('commands').value).toBe(postOperationsParameters.commands);
    }));

    it('should call put method when component save is triggered', fakeAsync(() => {
      // given
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');
      form.get('commands').setValue(postOperationsParameters.commands);
      form.markAsDirty();
      fixture.detectChanges();

      // when
      btn.click();
      flush();
      fixture.detectChanges();
      // then
      expect(lwm2mPostOperationsSvc.put).toHaveBeenCalledWith(postOperationsParameters);
    }));
  });

  describe('Save button clickable', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should be disabled initally, when form is valid but pristine', () => {
      // given
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

      // when
      fixture.detectChanges();

      // then
      expect(btn.textContent.trim()).toBe('Save');
      expect(form.valid).toBe(true);
      expect(form.dirty).toBe(false);
      expect(btn.hasAttribute('disabled')).toBe(true);
    });

    it('should be enabled when form is valid and dirty', () => {
      // given
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button[type="submit"]');

      // when
      form.markAsDirty();
      fixture.detectChanges();

      // then
      expect(btn.textContent.trim()).toBe('Save');
      expect(form.valid).toBe(true);
      expect(form.dirty).toBe(true);
      expect(btn.hasAttribute('disabled')).toBe(false);
    });
  });
});
