import { Injectable, OnDestroy } from '@angular/core';
import { FetchClient, IFetchOptions, IIdentified, IResult, IResultList } from '@c8y/client';
import { BehaviorSubject, NEVER, Observable, Subject, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Lwm2mClientService } from './lwm2m-client.service';
import { AlertService, gettext } from '@c8y/ngx-components';
import {
  Endpoint,
  ServerSettings,
  agentBaseUrl,
  Entity,
  UrlConfig,
  ValidationType,
  ValidationError
} from './../model';

@Injectable({
  providedIn: 'root'
})
export class Lwm2mConfigurationService<T extends IIdentified = Entity>
  extends Lwm2mClientService<T>
  implements OnDestroy
{
  deviceId: string;
  protected override baseUrl = `${agentBaseUrl}/v1`;

  private readonly _destroy$: Subject<void> = new Subject();
  private readonly _listServers$: Subject<void> = new Subject();
  private readonly _servers$: BehaviorSubject<ServerSettings[]> = new BehaviorSubject<ServerSettings[]>([]);
  private readonly _settings$: BehaviorSubject<T> = new BehaviorSubject({} as T);
  private readonly _certificates$: BehaviorSubject<string[]> = new BehaviorSubject([] as string[]);

  servers$: Observable<ServerSettings[]> = this._servers$.asObservable();
  settings$: Observable<T> = this._settings$.asObservable();
  certificates$: Observable<string[]> = this._certificates$.asObservable();

  constructor(client: FetchClient, private alertService: AlertService) {
    super(client);

    this._listServers$
      .pipe(
        switchMap(() =>
          this.listServers$().pipe(
            map(resp => this._servers$.next(resp?.data as unknown as ServerSettings[]))
          )
        ),
        catchError(error => {
          this.alertService.addServerFailure(error);
          return of([]);
        }),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getSettingsFor(urlCfg: UrlConfig) {
    this.detail$(urlCfg)
      .pipe(
        map(({ data }) => data),
        catchError(error => {
          this.alertService.addServerFailure(error);
          return of({} as T);
        }),
        takeUntil(this._destroy$)
      )
      .subscribe(data => this._settings$.next(data as T));
  }

  listServers() {
    this._listServers$.next();
  }

  updateConfig(entity: T, endpoint: Endpoint) {
    this.update$({ ...entity, endpoint })
      .pipe(
        catchError(error => {
          this.alertService.addServerFailure(error);
          return of(null);
        }),
        takeUntil(this._destroy$)
      )
      .subscribe();
  }

  override onBeforeUpdate(entity: Entity) {
    return this.deleteFieldsInRequest(entity);
  }

  override onBeforeCreate(entity: Entity) {
    return this.deleteFieldsInRequest(entity);
  }

  override getDetailUrl(entity: Entity): string {
    const { endpoint } = entity;
    const id = entity.id ?? '';
    const deviceConfigUrl = `device/${this.deviceId}/configuration`;

    if (!endpoint) {
      throw { data: { message: gettext('Unable to find endpoint') } };
    }

    return id.length > 0 && endpoint === Endpoint.servers
      ? `${deviceConfigUrl}/${endpoint}/${id}`
      : `${deviceConfigUrl}/${endpoint}`;
  }

  validate(certificate: string, type: ValidationType): Observable<string> {
    if (certificate?.length > 0) {
      const body = JSON.stringify({
        [type === ValidationType.PRIVATE_KEY ? 'encodedPrivateKey' : 'encodedCertificate']:
          certificate
      });

      return this.fetch$(`device/configuration/${type}/validate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body
      }).pipe(
        switchMap(result =>
          from(result.json() as Promise<{ fingerprint?: string } | { commonName?: string} >).pipe(
            map(data => (data as { fingerprint: string }).fingerprint || (data as { commonName: string }).commonName)
          )
        ),
        catchError((e: IResult<ValidationError>) => {
          const { message, error } = e?.data;
          this.alertService.addServerFailure({
            data: { message, exceptionMessage: error }
          });
          return throwError(e);
        })
      );
    }

    return undefined;
  }

  getServerCertificates() {
    this.fetchServerCertificates$()
      .pipe(
        catchError(error => {
          this.alertService.addServerFailure(error);
          return of([]);
        })
      )
      .subscribe();
  }

  fetchServerCertificates$() {
    return this.fetch$('dictionary/server-certificates').pipe(
      switchMap(result => from(result.json())),
      tap(result => {
        this._certificates$.next(result);
      }),
      takeUntil(this._destroy$)
    ) as Observable<string[]>;
  }

  cleanUpBase64Data(fileReadAsDataURL: string) {
    const base64RegExp = RegExp(/data:\S+;base64,/gi);
    return fileReadAsDataURL?.length > 0 && base64RegExp.test(fileReadAsDataURL)
      ? fileReadAsDataURL.replace(base64RegExp, '')
      : undefined;
  }

  listServers$() {
    this.listUrl = this.getDetailUrl({ endpoint: Endpoint.servers });
    return from(super.list() as Promise<IResultList<ServerSettings>>);
  }

  createServer$(server: ServerSettings) {
    return from(
      super.create({ ...server, endpoint: Endpoint.servers }) as Promise<IResult<ServerSettings>>
    );
  }

  deleteServer$(server: ServerSettings) {
    return from(super.delete({ ...server, endpoint: Endpoint.servers }));
  }

  update$(entity: T) {
    return from(super.update(entity as T) as Promise<IResult<T>>);
  }

  detail$(urlCfg: UrlConfig) {
    return from(super.detail(urlCfg as unknown as T) as Promise<IResult<T>>);
  }

  fetch$(url: string, init?: IFetchOptions) {
    return from(super.fetch(url, init));
  }

  private deleteFieldsInRequest(entity: Entity) {
    delete entity?.id;
    delete entity?.endpoint;
    delete (entity as IIdentified)?.['deviceInfo'];
    return entity as unknown as T;
  }
}
