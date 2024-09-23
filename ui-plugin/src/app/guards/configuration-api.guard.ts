import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Lwm2mConfigurationService } from '../services';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Lwm2mConfigurationApiGuard {
  private NOT_FOUND = 404;
  constructor(protected lwm2mConfigService: Lwm2mConfigurationService) {}
  canActivate() {
    return this.lwm2mConfigService.fetchServerCertificates$().pipe(
      switchMap(_data => of(true)),
      catchError(err => {
        return err?.res?.status === this.NOT_FOUND ? of(false) : of(true);
      })
    );
  }
}
