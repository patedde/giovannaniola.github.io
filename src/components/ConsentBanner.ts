// Minimal consent gate for Calendly embed (no analytics cookies).
// Shows only if a page contains [data-requires-calendly-consent]
const KEY = 'calendly-consent';
const pageNeedsCalendly = !!document.querySelector('[data-requires-calendly-consent]');

function renderBanner() {
  const div = document.createElement('div');
  div.id = 'consent-banner';
  div.setAttribute('role', 'dialog');
  div.setAttribute('aria-labelledby', 'consent-title');
  div.style.position = 'fixed';
  div.style.insetInline = '0';
  div.style.bottom = '0';
  div.style.background = 'white';
  div.style.borderTop = '1px solid #e5e7eb';
  div.style.padding = '12px 16px';
  div.style.display = 'flex';
  div.style.justifyContent = 'space-between';
  div.style.alignItems = 'center';
  div.style.zIndex = '1000';
  div.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
  div.innerHTML = `
    <span id="consent-title" style="font-size:14px; flex:1; margin-right:16px">
      This page uses an embedded scheduling widget (Calendly) that may set cookies. 
      / Questa pagina usa un widget di prenotazione (Calendly) che potrebbe impostare cookie.
    </span>
    <div style="display:flex; gap:8px; flex-shrink:0">
      <button 
        id="consent-accept" 
        style="padding:8px 16px; border-radius:8px; background:#059669; color:white; border:none; cursor:pointer; font-weight:500"
        aria-label="Accept Calendly cookies"
      >
        OK
      </button>
      <button 
        id="consent-decline" 
        style="padding:8px 16px; border-radius:8px; border:1px solid #e5e7eb; background:white; cursor:pointer"
        aria-label="Decline Calendly cookies"
      >
        No
      </button>
    </div>
  `;
  document.body.appendChild(div);
  
  document.getElementById('consent-accept')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'granted');
    div.remove();
    document.dispatchEvent(new Event('calendly-consented'));
  });
  
  document.getElementById('consent-decline')?.addEventListener('click', () => {
    localStorage.setItem(KEY, 'denied');
    div.remove();
  });
}

function initCalendlyGate() {
  const status = localStorage.getItem(KEY);
  if (status === 'granted') {
    document.dispatchEvent(new Event('calendly-consented'));
    return;
  }
  if (status !== 'denied') {
    renderBanner();
  }
}

if (pageNeedsCalendly) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalendlyGate);
  } else {
    initCalendlyGate();
  }
}