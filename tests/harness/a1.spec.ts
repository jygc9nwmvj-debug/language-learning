import { test, expect } from '@playwright/test';
import content from '../../src/languages/mandarin/content/lesson-001.json' with { type: 'json' };
test('all recalls, repeatable evaluation, interpreter and no persistence', async ({ page }) => {
  // Any attempt to open the learner DB, mutate web storage or register a worker fails the test.
  await page.addInitScript(() => {
    (window as any).persistenceCalls = [];
    for (const [object, method] of [[IDBFactory.prototype, 'open'], [Storage.prototype, 'setItem'], [Storage.prototype, 'removeItem'], [Storage.prototype, 'clear']] as const) {
      Object.defineProperty(object, method, { value: () => { (window as any).persistenceCalls.push(method); throw new Error('Test harness must not persist'); } });
    }
  });
  await page.goto('/__test/a1');
  await expect(page.getByRole('heading', { name: 'A1 Test Harness', exact: true })).toBeVisible();
  const picker = page.getByLabel('Lernschritt', { exact: true });
  for (const task of content.tasks.filter(task => task.kind === 'recall')) {
    await expect(picker.locator(`option[value="${task.id}"]`)).toHaveCount(1);
    await picker.selectOption(task.id);
    await page.getByLabel('Deine Antwort', { exact: true }).fill('absichtlich falsch');
    await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Weiter', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Reset / erneut testen', exact: true }).click();
    await expect(page.getByLabel('Deine Antwort', { exact: true })).toHaveValue('');
  }
  await picker.selectOption('recall-wojiao');
  for (const [input, expected] of [['wo3 jiao4 Wolfram','Richtig.'],['wo jiao Wolfram','Tonangaben fehlen'],['wo2 jiao4 Wolfram','Tonnotation braucht eine Korrektur']]) {
    await page.getByLabel('Deine Antwort', { exact: true }).fill(input);
    await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
    await expect(page.getByRole('status')).toContainText(expected);
    await page.getByRole('button', { name: 'Reset / erneut testen', exact: true }).click();
    await expect(page.getByTestId('test-events')).toHaveText('[]');
  }
  await picker.selectOption('read-hao');
  await page.getByLabel('Deine Antwort', { exact: true }).fill('gut');
  await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Richtig.');
  await picker.selectOption('recall-xiexie');
  await page.getByLabel('Deine Antwort', { exact: true }).fill('谢谢');
  await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Richtig.');
  await page.getByLabel('Erwartetes Item').selectOption('hao');
  for (const [input, notation] of [['hao3','correct'], ['hao','omitted'], ['hao2','different']]) {
    await page.getByLabel('Testeingabe', { exact: true }).fill(input);
    await page.getByRole('button', { name: 'Interpreter prüfen', exact: true }).click();
    const result = JSON.parse((await page.getByTestId('interpreter-result').textContent())!);
    expect(result.toneNotation).toBe(notation); expect(result.spokenTones).toBe('unknown');
  }
  expect(await page.evaluate(() => (window as any).persistenceCalls)).toEqual([]);
  expect(await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await expect(page.getByLabel('Testeingabe', { exact: true })).toHaveValue('');
  await expect(page.getByTestId('test-events')).toHaveText('[]');
});


test('current curriculum uses the same policy in exercises and the direct interpreter', async ({page}) => {
 await page.goto('/__test/a1');
 await page.getByLabel('Lernschritt',{exact:true}).selectOption('recall-xiexie');
 await page.getByLabel('Erwartetes Item').selectOption('xiexie');
 for(const input of ['xie4 xie5','xièxie','谢谢','xie4 xie','xie4 xie4']) {
  await page.getByLabel('Deine Antwort',{exact:true}).fill(input);
  await page.getByRole('button',{name:'Prüfen',exact:true}).click();
  await expect(page.getByRole('region',{name:'Ausgewählter Lernschritt'}).getByRole('status')).toHaveText('Richtig.');
  await page.getByRole('button',{name:'Reset / erneut testen',exact:true}).click();
  await page.getByLabel('Testeingabe',{exact:true}).fill(input);
  await page.getByRole('button',{name:'Interpreter prüfen',exact:true}).click();
  const result=JSON.parse((await page.getByTestId('interpreter-result').textContent())!);
  expect(result.fullyCorrect).toBe(true);expect(result.correction).toBe('');expect(result.spokenTones).toBe('unknown');
 }
 await page.getByLabel('Erwartetes Item').selectOption('wo');
 for(const [input,tone] of [['wo3','correct'],['wo2','different'],['wo','omitted']]) {
  await page.getByLabel('Testeingabe',{exact:true}).fill(input);
  await page.getByRole('button',{name:'Interpreter prüfen',exact:true}).click();
  const result=JSON.parse((await page.getByTestId('interpreter-result').textContent())!);
  expect(result.content).toBe('correct');expect(result.toneNotation).toBe(tone);expect(result.spokenTones).toBe('unknown');
 }
});
