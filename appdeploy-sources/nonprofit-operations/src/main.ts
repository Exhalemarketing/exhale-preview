import './styles.css';
import { api } from '@appdeploy/client';
const put = (id: string, value: string) => {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
};
const calc = document.querySelector<HTMLFormElement>('#calc');
let lastDetail = '';
if (calc) {
  const calculate = (event?: Event) => {
    event?.preventDefault();
    const frequency = Number(
      (document.getElementById('frequency') as HTMLInputElement).value
    );
    const minutes = Number(
      (document.getElementById('minutes') as HTMLInputElement).value
    );
    const target = Number(
      (document.getElementById('target') as HTMLInputElement).value
    );
    const valid =
      [frequency, minutes, target].every(Number.isFinite) &&
      frequency >= 1 &&
      frequency <= 100000 &&
      minutes >= 1 &&
      minutes <= 1440 &&
      target >= 0 &&
      target < minutes;
    if (!valid) {
      put(
        'calc-error',
        'Enter valid numbers and a target lower than the current time.'
      );
      return;
    }
    put('calc-error', '');
    const current = (frequency * minutes) / 60,
      possible = (frequency * (minutes - target)) / 60;
    const fmt = (x: number) =>
      x.toLocaleString('en-CA', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    put('current', fmt(current));
    put('potential', fmt(possible));
    (document.getElementById('bar-second') as HTMLElement).style.width =
      Math.round((target / minutes) * 100) + '%';
    const task = (document.getElementById('kind') as HTMLSelectElement).value;
    put(
      'interpretation',
      task +
        ': at the target time, the process would consume ' +
        fmt((frequency * target) / 60) +
        ' hours per week instead of ' +
        fmt(current) +
        '. The useful next question is what can really be changed.'
    );
    lastDetail =
      'Workflow: ' +
      task +
      '. ' +
      frequency +
      ' occurrences weekly, ' +
      minutes +
      ' minutes now, ' +
      target +
      ' minute target. Assumed possible capacity release: ' +
      fmt(possible) +
      ' hours per week. We would like help assessing feasibility.';
  };
  calc.addEventListener('submit', calculate);
  calculate();
  const cta = document.getElementById('diag-cta');
  cta?.addEventListener('click', () => {
    const box = document.getElementById(
      'challenge'
    ) as HTMLTextAreaElement | null;
    if (box && lastDetail && !box.value.trim()) box.value = lastDetail;
  });
}
const form = document.querySelector<HTMLFormElement>('#enquiry-form');
const submit = document.querySelector<HTMLButtonElement>('#send');
if (form && submit) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    put('status', '');
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const payload = {
      name: String(values.get('name') || '').trim(),
      email: String(values.get('email') || '').trim(),
      organization: String(values.get('organization') || '').trim(),
      challenge: String(values.get('challenge') || '').trim(),
      engagement: String(values.get('engagement') || 'not-sure'),
      website: String(values.get('website') || ''),
    };
    submit.disabled = true;
    submit.textContent = 'Sending…';
    try {
      const response = await api.post('/api/enquiries', payload);
      if (!response.data?.ok) throw new Error('Save failed');
      form.reset();
      put('status', 'Thank you. Your enquiry has been received.');
    } catch {
      put('status', 'Your enquiry could not be sent. Please try again.');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send enquiry ↗';
    }
  });
}
