import '../env.js';
import { runMigrations } from './index.js';
import { runSeed } from './seed.js';

runMigrations();
runSeed();
