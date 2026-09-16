const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
function closeMenu(){mainNav.classList.remove('is-open');menuToggle.setAttribute('aria-expanded','false');}
menuToggle?.addEventListener('click',()=>{const open=mainNav.classList.toggle('is-open');menuToggle.setAttribute('aria-expanded',String(open));});
mainNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mainNav?.classList.contains('is-open')){closeMenu();menuToggle.focus();}});
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
});

document.querySelectorAll('.mockup').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    card.style.transform = `rotateX(${(e.clientY-r.top-r.height/2)/-35}deg) rotateY(${(e.clientX-r.left-r.width/2)/35}deg)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
});
