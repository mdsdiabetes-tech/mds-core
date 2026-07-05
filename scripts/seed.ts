import { loadCore } from '../src/dataStore.js';
console.log(JSON.stringify(await loadCore(), null, 2));
