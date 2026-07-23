import process from 'node:process';
import childProcess from 'node:child_process';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

const [pidsFile, depth, title, ignoreSigterm, isRoot = 'true'] = process.argv.slice(2);

if (title) {
	process.title = title;
}

if (ignoreSigterm === 'all' || (ignoreSigterm === 'descendants' && isRoot === 'false')) {
	process.on('SIGTERM', () => {});
}

fs.appendFileSync(pidsFile, `${process.pid}\n`);

if (Number(depth) > 0) {
	childProcess.spawn(process.execPath, [
		fileURLToPath(import.meta.url),
		pidsFile,
		String(Number(depth) - 1),
		'',
		ignoreSigterm,
		'false',
	], {
		stdio: 'ignore',
	});
} else {
	fs.writeFileSync(`${pidsFile}.ready`, '');
}

setInterval(() => {}, 10_000);
