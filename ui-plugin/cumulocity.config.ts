import { EnvironmentOptions } from '@c8y/devkit/dist/options';
import { version, author, description } from './package.json';

const options: EnvironmentOptions = {
  runTime: {
    author,
    description,
    version,
    name: 'LWM2M hackathon plugin',
    contextPath: 'hackathon-plugin',
    key: 'lwm2m-hackathon-plugin-application-key',
    contentSecurityPolicy:
      "base-uri 'none'; default-src 'self' 'unsafe-inline' http: https: ws: wss:; connect-src 'self' http: https: ws: wss:;  script-src 'self' *.bugherd.com *.twitter.com *.twimg.com *.aptrinsic.com 'unsafe-inline' 'unsafe-eval' data:; style-src * 'unsafe-inline' blob:; img-src * data: blob:; font-src * data:; frame-src *; worker-src 'self' blob:;",
    dynamicOptionsUrl: '/apps/public/public-options/options.json',
    package: 'plugin',
    isPackage: true,
    noAppSwitcher: true,
    exports: [
      {
        name: "LWM2M plugin",
        module: "Lwm2mModuleWrapper",
        path: "./src/app/lwm2m.module.ts",
        description: "LWM2M hackathon Plugin with module federation"
      }
    ],
    remotes: {
      "lwm2m-ui-plugin": ['Lwm2mModuleWrapper']
    },
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
      'ngx-bootstrap',
      '@ngx-translate/core',
      '@ngx-formly/core'
    ]
  }
};

export default options;
