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
    const leads = Number(
      (document.getElementById('leads') as HTMLInputElement).value
    );
    const contacted = Number(
      (document.getElementById('contacted') as HTMLInputElement).value
    );
    const won = Number(
      (document.getElementById('won') as HTMLInputElement).value
    );
    const valid =
      [leads, contacted, won].every(
        x => Number.isFinite(x) && Number.isInteger(x)
      ) &&
      leads >= 1 &&
      leads <= 10000000 &&
      contacted >= 0 &&
      contacted <= leads &&
      won >= 0 &&
      won <= contacted;
    if (!valid) {
      put(
        'calc-error',
        'Enter whole numbers: contacted cannot exceed leads, and customers won cannot exceed contacted.'
      );
      return;
    }
    put('calc-error', '');
    const gap = leads - contacted;
    const rate = (contacted / leads) * 100,
      close = (won / leads) * 100;
    put('current', gap.toLocaleString('en-CA'));
    put('potential', rate.toFixed(1) + '%');
    (document.getElementById('bar-second') as HTMLElement).style.width =
      rate + '%';
    put(
      'interpretation',
      gap.toLocaleString('en-CA') +
        ' leads had no recorded contact. Lead-to-customer conversion: ' +
        close.toFixed(1) +
        '%. This alone does not tell us whether any were recoverable.'
    );
    lastDetail =
      'Lead flow: ' +
      leads +
      ' leads, ' +
      contacted +
      ' contacted, ' +
      won +
      ' won in one cohort. ' +
      gap +
      ' had no recorded contact; conversion ' +
      close.toFixed(1) +
      "%. We'd like to investigate the handoffs.";
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
