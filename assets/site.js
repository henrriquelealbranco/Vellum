'use strict';

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
const compactMenu = window.matchMedia('(max-width: 1100px)');
function closeMenu(restoreFocus = false) {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  if (restoreFocus) menuButton.focus();
}
function syncMenu() {
  document.documentElement.classList.add('menu-ready');
  menuButton.hidden = !compactMenu.matches;
  closeMenu();
}
if (menuButton && menu) {
  syncMenu();
  compactMenu.addEventListener('change', syncMenu);
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
  });
}
const track = (event, data) => { if (typeof window.gtag === 'function') window.gtag('event', event, data); };
document.querySelectorAll('[data-diagnostico]').forEach(link => {
  link.addEventListener('click', () => track('cta_diagnostico_click', {
    cta_zona: link.closest('header') ? 'header' : link.closest('.hero') ? 'hero' : 'contato'
  }));
});
const faqs = document.querySelectorAll('.faq details');
faqs.forEach(detail => detail.addEventListener('toggle', () => {
  if (!detail.open) return;
  faqs.forEach(other => { if (other !== detail) other.open = false; });
  track('faq_abrir', { pergunta: detail.querySelector('.q').textContent.trim().slice(0, 80) });
}));
// Conserva os destinos de links antigos, sem manter o formulário removido.
const legacyAnchors = { '#triagem': 'contato', '#servicos': 'solucoes', '#metodo': 'como-funciona', '#paraquem': 'sobre' };
function resolveLegacyAnchor() {
  const id = legacyAnchors[window.location.hash];
  if (id) {
    history.replaceState(null, '', '#' + id);
    document.getElementById(id).scrollIntoView();
  }
}
resolveLegacyAnchor();
window.addEventListener('hashchange', resolveLegacyAnchor);
