
(function(){
  const host = document.createElement('div');
  host.id = 'toast-host';
  host.style.position = 'fixed';
  host.style.top = '16px';
  host.style.right = '16px';
  host.style.zIndex = '9999';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(host));
  function toast(msg, type='info'){
    const card = document.createElement('div');
    card.className = 'rounded-xl px-4 py-3 mb-2 border';
    card.style.minWidth = '240px';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-8px)';
    card.style.transition = 'all .25s ease';
    const colors = {
      success: 'border-emerald-500/40 text-emerald-200 bg-emerald-500/10',
      warning: 'border-amber-500/40 text-amber-200 bg-amber-500/10',
      error: 'border-red-500/40 text-red-200 bg-red-500/10',
      info: 'border-cyan-500/40 text-cyan-200 bg-cyan-500/10',
    };
    card.className += ' ' + (colors[type] || colors.info);
    card.innerHTML = `<div class="font-semibold">${msg}</div>`;
    host.appendChild(card);
    requestAnimationFrame(()=>{ card.style.opacity = '1'; card.style.transform = 'translateY(0)'; });
    setTimeout(()=>{ card.style.opacity = '0'; card.style.transform = 'translateY(-8px)'; setTimeout(()=> host.removeChild(card), 250); }, 3000);
  }
  window.$toast = toast;
})();