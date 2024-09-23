import { defineConfig } from 'cypress';
const { isFileExist } = require('cy-verify-downloads');
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');
const del = require('delete');

export default defineConfig({
  defaultCommandTimeout: 10000,
  env: {
    C8Y_USERNAME: 'usr',
    C8Y_PASSWORD: 'Passw0rd_d',
    C8Y_TENANT: 't253621',
    grepOmitFiltered: true,
  },
  reporter: 'spec',
  retries: {
    runMode: 2,
    openMode: 0
  },
  trashAssetsBeforeRuns: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  video: true,
  videoCompression: true,
  screenshotsFolder: 'cypress/snapshots/actual',
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('task', { isFileExist });

      on('after:run', (results:CypressCommandLine.CypressRunResult) => {
        let failure;
        results.runs.forEach((run) => {
          if (run && run.video) {
            failure = run.tests.some((test) => test.attempts.some((attempt) => attempt.state === 'failed'))
            if (!failure) {
              del(run.video);
            }
          }
        });
      });

      require('@cypress/grep/src/plugin')(config);
      require('cypress-failed-log/on')(on);
      getCompareSnapshotsPlugin(on, config);
      return config;
    },
    baseUrl: 'https://ui-lwm2m-2766177-1.latest.stage.c8y.io/',
  }
})