import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const notifySlack = vi.fn(async (_key: string, _text: string) => {});
vi.mock('../api/_slack-alert', () => ({ notifySlack }));
// CI ruleaza pe Node 20, fara `node:sqlite` → contoarele din api/_db.ts tinute in memorie.
const kv = new Map<string, unknown>();
vi.mock('../api/_db', () => ({
  kvGet: (k: string) => kv.get(k) ?? null,
  kvPut: (k: string, v: unknown) => { kv.set(k, v); },
  kvDelete: (k: string) => { kv.delete(k); },
}));

beforeEach(() => {
  vi.resetModules();
  notifySlack.mockClear();
  kv.clear();
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const post = (url: string, body: unknown) =>
  new Request(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-real-ip': '203.0.113.7' }, body: JSON.stringify(body) });

describe('alerte Slack', () => {
  it('login admin: alerta la blocarea IP-ului dupa 5 coduri gresite, fara IP in mesaj', async () => {
    vi.stubEnv('ADMIN_PIN', '123456');
    vi.stubEnv('ADMIN_SESSION_SECRET', 'secret-de-test-suficient-de-lung');
    const { default: login } = await import('../api/admin-login');

    for (let i = 0; i < 4; i++) await login(post('http://x/api/admin-login', { pin: '000000' }));
    expect(notifySlack).not.toHaveBeenCalled();

    await login(post('http://x/api/admin-login', { pin: '000000' }));
    expect(notifySlack).toHaveBeenCalledTimes(1);
    expect(notifySlack.mock.calls[0][0]).toBe('login-ip-lock');
    expect(notifySlack.mock.calls[0][1]).not.toContain('203.0.113.7');
  });

  it('formular contact: alerta cand Maileroo refuza, fara datele vizitatorului', async () => {
    vi.stubEnv('MAILEROO_API_KEY', 'k');
    vi.stubEnv('MAILEROO_FROM_ADDRESS', 'site@exemplu.ro');
    vi.stubEnv('MAILEROO_TO_ADDRESS', 'inbox@exemplu.ro');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 500 }));
    const { default: contact } = await import('../api/contact');

    const res = await contact(post('http://x/api/contact', { name: 'Ion Pop', email: 'ion@exemplu.ro', message: 'Buna ziua, am o intrebare.' }));

    expect(res.status).toBe(502);
    expect(notifySlack).toHaveBeenCalledWith('contact-failed', expect.stringContaining('HTTP 500'));
    const text = notifySlack.mock.calls.flat().join(' ');
    expect(text).not.toContain('ion@exemplu.ro');
    expect(text).not.toContain('Ion Pop');
  });
});
