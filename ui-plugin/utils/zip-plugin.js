import pkg from '../package.json' assert { type: 'json'};
import { zip } from 'zip-a-folder';

await zip('dist/ui-plugin',`dist/lwm2m-ui-plugin-${pkg.version}.zip`);
