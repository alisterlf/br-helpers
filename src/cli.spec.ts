import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const cliPath = resolve(__dirname, '..', 'bin', 'br-helpers');

function runCli(args: string[]) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: 'utf8',
  });
}

describe('CLI', () => {
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
