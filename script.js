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
