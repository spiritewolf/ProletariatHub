import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root: string = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcGen: string = join(root, 'src', 'generated');
const distGen: string = join(root, 'dist', 'generated');

await rm(distGen, { recursive: true, force: true });
await mkdir(dirname(distGen), { recursive: true });
await cp(srcGen, distGen, { recursive: true });
