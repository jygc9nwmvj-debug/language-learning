import test from 'node:test';
import assert from 'node:assert/strict';
import { installEnvironment } from '../src/core/offline/install.ts';
const nav = (userAgent, extra = {}) => ({ userAgent, platform: '', maxTouchPoints: 0, ...extra });
const iphone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 Version/26.0 Mobile/15E148 Safari/604.1';
test('UA client hints take precedence over device fallback', () => {
  assert.deepEqual(installEnvironment(nav('Android', { userAgentData: { mobile: false } })), { mobile: false, safari: false });
  assert.deepEqual(installEnvironment(nav('unknown', { userAgentData: { mobile: true } })), { mobile: true, safari: false });
});
test('Android and iPhone Safari work without UA client hints', () => {
  assert.deepEqual(installEnvironment(nav('Mozilla/5.0 (Linux; Android 15) Chrome/140 Mobile Safari/537.36')), { mobile: true, safari: false });
  assert.deepEqual(installEnvironment(nav(iphone)), { mobile: true, safari: true });
});
test('desktop Safari and touch-capable desktop Chromium are excluded', () => {
  assert.deepEqual(installEnvironment(nav('Macintosh Version/26.0 Safari/605.1.15', { platform: 'MacIntel' })), { mobile: false, safari: false });
  assert.deepEqual(installEnvironment(nav('Windows Chrome/140 Safari/537.36', { maxTouchPoints: 10 })), { mobile: false, safari: false });
});
test('iPad desktop UA uses touch/platform fallback', () => {
  assert.deepEqual(installEnvironment(nav('Macintosh Version/26.0 Safari/605.1.15', { platform: 'MacIntel', maxTouchPoints: 5 })), { mobile: true, safari: true });
});
test('other iOS browsers and embedded webviews do not receive Safari instructions', () => {
  for (const browser of ['CriOS', 'FxiOS', 'EdgiOS', 'OPiOS']) assert.equal(installEnvironment(nav(iphone.replace('Version/26.0', browser + '/140'))).safari, false);
  assert.equal(installEnvironment(nav('iPhone AppleWebKit/605.1.15 Mobile/15E148')).safari, false);
});
