const printButton = document.querySelector('.print');
let openBeforePrint = [];
window.addEventListener('beforeprint', () => {
  openBeforePrint = [...document.querySelectorAll('details')].map(detail => detail.open);
  document.querySelectorAll('details').forEach(detail => { detail.removeAttribute('name'); detail.open = true; });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('details').forEach((detail, i) => { detail.open = openBeforePrint[i]; detail.setAttribute('name', 'projects'); });
});
printButton.addEventListener('click', () => window.print());

const track = (name, params) => window.gtag?.('event', name, params);
const locationOf = el => el.closest('section')?.id || el.closest('header, footer')?.localName || 'page';
window.addEventListener('beforeprint', () => track('print_page'));
document.addEventListener('click', event => {
  const summary = event.target.closest('details.project > summary');
  if (summary && !summary.parentElement.open) {
    track('project_expand', { project: summary.querySelector('.project-title').firstChild.textContent.trim() });
  }
  const link = event.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  const link_location = locationOf(link);
  if (href.startsWith('mailto:')) track('contact_click', { method: 'email', link_location });
  else if (href.startsWith('#')) track('nav_click', { target: href.slice(1) || 'top', link_location });
  else if (link.classList.contains('personal-card')) track('select_content', { content_type: 'project', item_id: link.querySelector('strong').textContent });
  else track('social_click', { network: new URL(link.href).hostname.replace('www.', ''), link_location });
});
const seenSections = new Set();
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  const halfVisible = entry.intersectionRatio >= 0.5 || entry.intersectionRect.height >= innerHeight / 2;
  if (!halfVisible || seenSections.has(entry.target.id)) return;
  seenSections.add(entry.target.id);
  track('section_view', { section: entry.target.id });
}), { threshold: [0, 0.25, 0.5, 0.75, 1] });
document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
