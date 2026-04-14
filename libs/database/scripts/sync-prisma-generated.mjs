import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcGen = join(root, 'src', 'generated');
const distGen = join(root, 'dist', 'generated');

await rm(distGen, { recursive: true, force: true });
await mkdir(dirname(distGen), { recursive: true });
await cp(srcGen, distGen, { recursive: true });
