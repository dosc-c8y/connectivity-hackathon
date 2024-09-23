import { EnvironmentOptions } from '@c8y/devkit/dist/options';
import { author, description, version } from './package.json';

export default {
  runTime: {
    author,
    description,
    version,
    name: 'devicemanagement',
    contextPath: 'devicemanagement',
    key: 'devicemanagement-application-key',
    rightDrawer: true,
    breadcrumbs: false,
    contentSecurityPolicy:
      "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
    dynamicOptionsUrl: '/apps/public/public-options/options.json',
    contextHelp: true,
    upgrade: true,
    remotes: {
      "lwm2m-ui-plugin": [
        "Lwm2mModuleWrapper"
      ]
    }
  },
  buildTime: {
    federation: [
      '@angular/animations',
      '@angular/cdk',
      '@angular/common',
      '@angular/compiler',
      '@angular/core',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/router',
      '@angular/upgrade',
      '@c8y/client',
      '@c8y/ngx-components',
      'angular',
      'ngx-bootstrap',
      '@ngx-translate/core',
      '@ngx-formly/core'
    ]
  }
} as const satisfies EnvironmentOptions;
