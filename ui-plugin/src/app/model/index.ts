import { IManagedObject } from '@c8y/client';
import { Alert, gettext } from '@c8y/ngx-components';

export interface Lwm2mManagedObject extends IManagedObject {
  c8y_IsLwm2mDevice: object;
  c8y_DeviceTypes: string[];
  type: string;
}

export interface LWM2MPostOperationsParameters {
  commands: string;
  id: string;
  type: string;
}

export enum Endpoint {
  deviceSettings = 'basic',
  connectivity = 'connectivity',
  firmware = 'firmware',
  servers = 'servers',
  bootstrap = 'bootstrap'
}

export interface Lwm2mBootstrapParameters {
  bindingMode?: BindingMode | null;
  bootstrapId?: string | null;
  bootstrapKey?: string | null;
  bootstrapShortServerId?: number | null;
  defaultMaximumPeriod?: number | null;
  defaultMinimumPeriod?: number | null;
  securityMode?: SecurityMode | null;
  endpoint?: string | null;
  generateBootstrapServerConfig?: boolean | null;
  lwm2mShortServerId?: number | null;
  serverUri?: string | null;
  registrationLifeTime?: number | null;
  serverPublicKey?: string | null;
  securityInstanceOffset?: number | null;
  publicKeyOrId?: string | null;
  secretKey?: string | null;
  id?: string | null;
}

export enum SecurityMode {
  NO_SEC = 'NO_SEC',
  PSK = 'PSK'
}

export enum Mode {
  NO_SEC = 'NO_SEC',
  PSK = 'PSK',
  X509 = 'X509'
}

export enum BindingMode {
  U = 'U',
  UQ = 'UQ'
}

export enum BinaryEncoding {
  OPAQUE = 'OPAQUE',
  TLV = 'TLV'
}

export enum SerializationFormat {
  TLV = 'TLV',
  JSON = 'JSON',
  CBOR = 'CBOR',
  TEXT = 'TEXT',
  OPAQUE = 'OPAQUE',
  SENML_JSON = 'SENML_JSON',
  SENML_CBOR = 'SENML_CBOR'
}

export enum CertificateUsage {
  CA_CONSTRAINT = 'CA_CONSTRAINT',
  SC_CONSTRAINT = 'SERVICE_CERTIFICATE_CONSTRAINT',
  TA_ASSERTION = 'TRUST_ANCHOR_ASSERTION',
  DI_CERTIFICATE = 'DOMAIN_ISSUER_CERTIFICATE'
}

export enum FWU_DeliveryMethod {
  PULL = 'PULL',
  PUSH = 'PUSH',
  BOTH = 'BOTH'
}

export enum FWU_SupportedDeviceProtocol {
  COAP = 'COAP',
  COAPS = 'COAPS',
  HTTP = 'HTTP',
  HTTPS = 'HTTPS'
}

export enum FWU_ResetMechanism {
  PACKAGE = 'PACKAGE',
  PACKAGE_URI = 'PACKAGE_URI'
}

export enum ValidationType {
  X509 = 'x509certificate',
  PRIVATE_KEY = 'certificatePrivateKey'
}

export const agentName = 'lwm2m-agent';
export const agentBaseUrl = `/service/${agentName}`;
export const c8y_lwm2m = 'c8y_lwm2m';

export type Settings =
  | BootstrapSettings
  | DeviceSettings
  | FirmwareSettings
  | ConnectivitySettings
  | ServerSettings
  | object;

export type Entity = Settings & UrlConfig;

export interface ValidationError {
  error: string;
  message: string;
}

export interface UrlConfig {
  endpoint?: Endpoint;
  id?: string;
}

export interface ServerSettings {
  id: string;
  uri: string;
  serverId: number;
  registrationLifetime: number;
  defaultMinPeriod: number;
  defaultMaxPeriod: number;
  disableTimeout: number;
  bootstrap: boolean;
  storeNotifications: boolean;
  bindingMode: BindingMode;
  security: Security;
}

export interface Security {
  mode: Mode;
  x509PrivateKey?: string;
  x509PrivateKeyFingerPrint?: string;
  x509Certificate?: string;
  x509CertificateCommonName?: string;
  x509ServerCertificateName?: string;
  certificateUsage?: string;
  pskKey?: string;
  pskId?: string;
}

export interface DeviceSettings {
  endpointId: string;
  awakeTime: number;
  requestTimeout: number;
  keepOldValuesOnOperationFail: boolean;
  useTimestampResources: boolean;
  binaryEncoding: BinaryEncoding;
  serializationFormat: SerializationFormat;
}

export interface ConnectivitySettings {
  bootstrapConnectivity: Connectivity;
  serverConnectivity: Connectivity;
}

export interface Connectivity {
  mode: Mode;
  pskKey?: string;
  pskId?: string;
}

export interface FirmwareSettings {
  url: string;
  resetStateMachineOnStart: boolean;
  resetMethod: FWU_ResetMechanism;
  supportedDeviceProtocol: FWU_SupportedDeviceProtocol;
  firmwareDeliveryMethod: FWU_DeliveryMethod;
}

export interface BootstrapSettings {
  bootstrapServerId: number;
  securityInstanceOffset: number;
  generateBootstrapServer: boolean;
}

export const permissionAlert: Alert = {
  text: gettext('You do not have write permissions. This form is read-only.'),
  type: 'info'
};
