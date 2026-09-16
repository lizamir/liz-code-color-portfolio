const filter = document.querySelector('#status-filter');
filter?.addEventListener('change', () => document.querySelectorAll('[data-state]').forEach(row => {row.hidden = filter.value !== 'all' && row.dataset.state !== filter.value;}));
const form = document.querySelector('#signature-form');
if (form) {
  const fields = ['name', 'role', 'email'];
  const update = () => {
    fields.forEach(key => {document.querySelector('#out-' + key).textContent = document.querySelector('#sig-' + key).value;});
    document.querySelector('.live-signature').style.setProperty('--sig-color', document.querySelector('#sig-color').value);
  };
  form.addEventListener('input', update);
  form.addEventListener('submit', event => event.preventDefault());
  document.querySelector('#copy-signature').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(fields.map(key => document.querySelector('#sig-' + key).value).join('\n'));
      status.textContent = 'פרטי החתימה הועתקו כטקסט.';
    } catch {status.textContent = 'לא ניתן להעתיק אוטומטית. אפשר לסמן ולהעתיק את הטקסט מהתצוגה.';}
  });
}
