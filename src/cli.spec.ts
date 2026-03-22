import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const rootDir = resolve(__dirname, '..');
const cliPath = resolve(__dirname, '..', 'bin', 'br-helpers');
const distEntryPath = resolve(__dirname, '..', 'dist', 'index.js');

function ensureCliBuild() {
  if (existsSync(distEntryPath)) {
    return;
  }

  const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npmCommand, ['run', 'build'], {
    cwd: rootDir,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Failed to build CLI for tests.\nSTDOUT:\n${result.stdout}\nSTDERR:\n${result.stderr}`);
  }
}

function runCli(args: string[]) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: 'utf8',
  });
}

describe('CLI', () => {
  beforeAll(() => {
    ensureCliBuild();
  }, 30_000);

  it('Should show global help', () => {
    const result = runCli(['--help']);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('br-helpers <command> [options]');
    expect(result.stdout).toContain('cpf <value>');
    expect(result.stdout).toContain('identifier <value>');
  });

  it('Should support cpf field output as json', () => {
    const result = runCli(['cpf', '13768663663', '--field', 'digits', '--output', 'json']);

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('{\n  "digits": "13768663663"\n}\n');
  });

  it('Should return exit code 2 for invalid cpf', () => {
    const result = runCli(['cpf', '00000000000']);

    expect(result.status).toBe(2);
    expect(result.stdout).toContain('Valido: false');
  });

  it('Should support identifier command', () => {
    const result = runCli(['identifier', 'CPF: 137.686.636-63']);

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('{\n  "numeric": "13768663663",\n  "alphanumeric": "CPF13768663663"\n}\n');
  });
});
