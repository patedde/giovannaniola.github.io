# BUILD_GUIDE.md

This document instructs the AI (Claude Code) to create, configure, and deploy a bilingual therapist website for Giovanna Niola, Psicoterapeuta cognitivo-comportamentale on GitHub Pages using Astro + Tailwind.
All content is bilingual (Italian default, English optional via language switch). Use placeholders for copy and photos.

## 0) Project facts & decisions

**Owner:** Giovanna Niola  
**Titolo:** Psicoterapeuta cognitivo-comportamentale  
**Iscrizione:** 1/SPS - Albo degli Psicologi Sardegna  
**Email contatti:** giovannaniola@gmail.com

**Languages:** Default Italian, switch to English.

**Hosting:** GitHub Pages (static).

**Stack:** Astro (content-first) + Tailwind CSS.

**Forms:** Formspree (no backend, free tier = 50 submissions/month).

**Calendar:** Calendly (or TidyCal) embedded (syncs with Google Calendar).

**Design:** Sleek/modern but warm, calm and welcoming. Responsive. One image per page (placeholder).

**Legal:** Minimal GDPR compliance only.
- Consent checkbox on contact form.
- Cookie/consent gate for Calendly embed (only load after consent).
- Minimal Privacy Policy page (IT/EN).

**No:** schema.org, extra accessibility/perf checklists, localized SEO/hreflang, analytics, blog/resources.

## 1) Prerequisites

- Node.js LTS (≥ 18).
- GitHub repo ready (you'll add a custom domain later).
- Formspree account (free), to obtain a form endpoint URL.
- Calendly (or TidyCal) scheduling link (placeholder used until provided).
- (Optional) Astro VS Code extension for better DX.

## 2) Create project

```bash
# Create Astro project
npm create astro@latest therapist-site -- --template basics
cd therapist-site

# Add Tailwind
npx astro add tailwind

# Install dependencies
npm install
```

**Design tokens** (use warm, calm palette & accessible fonts):

- **Colors:** warm sand + slate
  - sand-50/100/200, slate-700/900, emerald-600 (accents)
- **Fonts:** Inter (UI) + Lora (headings / pull quotes)
  - Add Google Fonts in `src/layouts/BaseLayout.astro` `<head>` later.

## 3) File structure

```
/
├── public/
│   ├── images/
│   │   ├── placeholder-hero.jpg
│   │   ├── placeholder-about.jpg
│   │   ├── placeholder-cbt.jpg
│   │   ├── placeholder-calendar.jpg
│   │   └── placeholder-faq.jpg
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── LanguageSwitch.astro
│   │   ├── ContactForm.astro
│   │   ├── ConsentBanner.ts
│   │   └── CalendlyEmbed.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro          # Root redirect
│   │   ├── 404.astro            # Error page
│   │   ├── it/
│   │   │   ├── index.astro      # Home
│   │   │   ├── about.astro
│   │   │   ├── cbt.astro
│   │   │   ├── calendar.astro
│   │   │   ├── faq.astro
│   │   │   └── privacy.astro
│   │   └── en/
│   │       ├── index.astro
│   │       ├── about.astro
│   │       ├── cbt.astro
│   │       ├── calendar.astro
│   │       ├── faq.astro
│   │       └── privacy.astro
│   └── styles/
│       └── globals.css
├── astro.config.mjs
├── tailwind.config.cjs
├── package.json
└── .github/workflows/deploy.yml    # GitHub Pages deploy
```

## 4) Tailwind & global styles

**tailwind.config.cjs** (extend colors subtly—keep Tailwind defaults; no heavy theming):

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'ui-serif', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
```

**src/styles/globals.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

html { 
  scroll-behavior: smooth; 
}

.prose p { 
  @apply leading-relaxed; 
}

/* Focus states for accessibility */
*:focus-visible {
  @apply outline-2 outline-offset-2 outline-emerald-600;
}
```

## 5) Base layout & shared components

### src/layouts/BaseLayout.astro

```astro
---
const { 
  lang = 'it', 
  title = 'Giovanna Niola - Psicoterapeuta', 
  description = 'Sedute di psicoterapia cognitivo-comportamentale', 
  image = '/images/placeholder-hero.jpg' 
} = Astro.props;
---

<!DOCTYPE html>
<html lang={lang} class="bg-white text-slate-900">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <link rel="icon" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:wght@500;600&display=swap" rel="stylesheet">
  </head>
  <body class="min-h-screen flex flex-col font-sans">
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-emerald-600 text-white px-4 py-2 rounded">
      {lang === 'it' ? 'Vai al contenuto' : 'Skip to content'}
    </a>

    <header class="border-b">
      <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href={lang === 'it' ? '/it/' : '/en/'} class="font-serif text-xl hover:text-emerald-600 transition-colors">
          Giovanna Niola
        </a>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-6">
          <a class="hover:underline hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/about' : '/en/about'}>
            {lang === 'it' ? 'Chi sono' : 'About'}
          </a>
          <a class="hover:underline hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/cbt' : '/en/cbt'}>
            {lang === 'it' ? "Cos'è la CBT" : "What's CBT"}
          </a>
          <a class="hover:underline hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/calendar' : '/en/calendar'}>
            {lang === 'it' ? 'Calendario' : 'Calendar'}
          </a>
          <a class="hover:underline hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/faq' : '/en/faq'}>
            FAQ
          </a>
          <a class="hover:underline hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/privacy' : '/en/privacy'}>
            {lang === 'it' ? 'Privacy' : 'Privacy'}
          </a>
          <slot name="langswitch" />
        </nav>

        <!-- Mobile Menu Button -->
        <button 
          id="mobile-menu-button" 
          class="md:hidden p-2 hover:bg-slate-100 rounded"
          aria-label={lang === 'it' ? 'Menu' : 'Menu'}
          aria-expanded="false"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <nav id="mobile-menu" class="hidden md:hidden border-t">
        <div class="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4">
          <a class="hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/about' : '/en/about'}>
            {lang === 'it' ? 'Chi sono' : 'About'}
          </a>
          <a class="hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/cbt' : '/en/cbt'}>
            {lang === 'it' ? "Cos'è la CBT" : "What's CBT"}
          </a>
          <a class="hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/calendar' : '/en/calendar'}>
            {lang === 'it' ? 'Calendario' : 'Calendar'}
          </a>
          <a class="hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/faq' : '/en/faq'}>
            FAQ
          </a>
          <a class="hover:text-emerald-600 transition-colors" href={lang === 'it' ? '/it/privacy' : '/en/privacy'}>
            {lang === 'it' ? 'Privacy' : 'Privacy'}
          </a>
          <slot name="langswitch-mobile" />
        </div>
      </nav>
    </header>

    <main id="main-content" class="flex-1">
      <slot />
    </main>

    <footer class="border-t bg-slate-50">
      <div class="max-w-5xl mx-auto px-4 py-8 text-sm">
        <p><strong>Giovanna Niola</strong> - Psicoterapeuta cognitivo-comportamentale • Iscrizione: 1/SPS, Albo degli Psicologi Sardegna</p>
        <p class="mt-1">Email: <a href="mailto:giovannaniola@gmail.com" class="underline hover:text-emerald-600">giovannaniola@gmail.com</a></p>
        <p class="mt-2 text-slate-600">© {new Date().getFullYear()} Giovanna Niola</p>
      </div>
    </footer>

    <script is:inline>
      // Mobile menu toggle
      const menuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
          const isHidden = mobileMenu.classList.contains('hidden');
          mobileMenu.classList.toggle('hidden');
          menuButton.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        });
      }
    </script>

    <script type="module" src="/src/components/ConsentBanner.ts"></script>
  </body>
</html>
```

### src/components/LanguageSwitch.astro

```astro
---
const { lang = 'it' } = Astro.props;
const target = lang === 'it' ? 'en' : 'it';
const path = Astro.url.pathname.replace(/^\/(it|en)/, '');
const href = `/${target}${path === '' ? '/' : path}`;
const label = lang === 'it' ? 'English' : 'Italiano';
---

<a 
  href={href} 
  class="px-3 py-1 border rounded text-sm hover:bg-slate-100 transition-colors"
  hreflang={target}
  aria-label={`Switch to ${label}`}
>
  {label}
</a>
```

### src/components/ContactForm.astro

```astro
---
/* 
 * IMPORTANT: Replace with your actual Formspree endpoint
 * Get one at https://formspree.io after creating your form
 */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID_HERE';
const { lang = 'it' } = Astro.props;

// Validation: warn if endpoint not updated
if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID_HERE')) {
  console.warn('⚠️  ContactForm: Update FORMSPREE_ENDPOINT with your actual form ID');
}
---

<form action={FORMSPREE_ENDPOINT} method="POST" class="space-y-4 max-w-xl">
  <input type="hidden" name="_subject" value="Nuovo messaggio dal sito (Giovanna Niola)" />
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />
  
  <div>
    <label for="name" class="block text-sm font-medium mb-1">
      {lang === 'it' ? 'Nome' : 'Name'} <span class="text-red-600">*</span>
    </label>
    <input 
      required 
      type="text" 
      id="name"
      name="name" 
      class="w-full border border-slate-300 rounded px-3 py-2 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" 
    />
  </div>
  
  <div>
    <label for="email" class="block text-sm font-medium mb-1">
      Email <span class="text-red-600">*</span>
    </label>
    <input 
      required 
      type="email" 
      id="email"
      name="email" 
      class="w-full border border-slate-300 rounded px-3 py-2 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600" 
    />
  </div>
  
  <div>
    <label for="message" class="block text-sm font-medium mb-1">
      {lang === 'it' ? 'Messaggio' : 'Message'} <span class="text-red-600">*</span>
    </label>
    <textarea 
      required 
      id="message"
      name="message" 
      rows="5" 
      class="w-full border border-slate-300 rounded px-3 py-2 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
    ></textarea>
  </div>
  
  <!-- Minimal GDPR consent -->
  <div class="flex items-start gap-2">
    <input 
      required 
      id="consent" 
      type="checkbox" 
      name="consent" 
      class="mt-1 w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-600" 
    />
    <label for="consent" class="text-sm">
      {lang === 'it'
        ? 'Acconsento al trattamento dei dati personali per essere ricontattato/a. Ho letto la '
        : 'I consent to the processing of my personal data to be contacted back. I have read the '}
      <a class="underline hover:text-emerald-600" href={lang === 'it' ? '/it/privacy' : '/en/privacy'}>
        {lang === 'it' ? 'Informativa Privacy' : 'Privacy Policy'}
      </a>.
    </label>
  </div>
  
  <button 
    type="submit" 
    class="px-6 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
  >
    {lang === 'it' ? 'Invia' : 'Send'}
  </button>
</form>
```

### Calendly consent gate (cookie/consent minimal)

Shows a small banner only on the calendar page (via a data-attribute) and defers loading of Calendly iframe until consent.

**src/components/ConsentBanner.ts**

```typescript
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
```

### src/components/CalendlyEmbed.astro

```astro
---
const { 
  lang = 'it', 
  url = 'https://calendly.com/YOUR_USERNAME/50min' 
} = Astro.props;

// Validation: warn if URL not updated
if (url.includes('YOUR_USERNAME')) {
  console.warn('⚠️  CalendlyEmbed: Update url prop with your actual Calendly link');
}
---

<div data-requires-calendly-consent class="max-w-3xl mx-auto px-4">
  <div id="calendly-container" class="min-h-[700px] border rounded bg-slate-50 flex items-center justify-center">
    <p class="text-slate-600 text-center px-4">
      {lang === 'it' 
        ? 'Accetta i cookie per caricare il calendario di prenotazione.' 
        : 'Accept cookies to load the booking calendar.'}
    </p>
  </div>
  <noscript>
    {lang === 'it'
      ? <p class="mt-4 text-center">Per prenotare senza JavaScript, apri <a class="underline text-emerald-600" href={url} target="_blank" rel="noopener noreferrer">Calendly</a>.</p>
      : <p class="mt-4 text-center">To book without JavaScript, open <a class="underline text-emerald-600" href={url} target="_blank" rel="noopener noreferrer">Calendly</a>.</p>}
  </noscript>
</div>

<script is:inline define:vars={{ url }}>
  function loadCalendly() {
    if (document.getElementById('calendly-script')) return;
    
    const container = document.getElementById('calendly-container');
    if (container) {
      container.innerHTML = ''; // Clear placeholder message
    }
    
    const s = document.createElement('script');
    s.id = 'calendly-script';
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.onload = () => {
      if (window.Calendly && container) {
        window.Calendly.initInlineWidget({
          url: url,
          parentElement: container,
          prefill: {},
          utm: {}
        });
      }
    };
    s.onerror = () => {
      if (container) {
        container.innerHTML = '<p class="text-red-600 text-center">Failed to load calendar. Please try again later.</p>';
      }
    };
    document.body.appendChild(s);
  }
  
  document.addEventListener('calendly-consented', loadCalendly);
  
  // Auto-load if user has already consented in a previous visit
  if (localStorage.getItem('calendly-consent') === 'granted') {
    loadCalendly();
  }
</script>

<link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css">
```

## 6) Pages (IT default, EN mirror)

Each page includes: a warm hero section with a placeholder image, concise text, and per-page picture.

**Placeholders:** keep copy short and light; Giovanna will edit later.

### 6.1 Root redirect - src/pages/index.astro

```astro
---
// Redirect root to /it/
---
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=/it/">
  <link rel="canonical" href="/it/">
  <title>Redirecting...</title>
</head>
<body>
  <script>window.location.href = '/it/';</script>
  <noscript>
    <p>Redirecting to <a href="/it/">Italian homepage</a>...</p>
  </noscript>
</body>
</html>
```

### 6.2 404 Error Page - src/pages/404.astro

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import LanguageSwitch from '../components/LanguageSwitch.astro';

// Detect language from path
const lang = Astro.url.pathname.startsWith('/en') ? 'en' : 'it';
---

<BaseLayout lang={lang} title={lang === 'it' ? 'Pagina non trovata' : 'Page not found'}>
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  
  <section class="max-w-5xl mx-auto px-4 py-24 text-center">
    <h1 class="font-serif text-4xl mb-4">
      {lang === 'it' ? 'Pagina non trovata' : 'Page not found'}
    </h1>
    <p class="text-slate-700 mb-8">
      {lang === 'it' 
        ? 'La pagina che stai cercando non esiste.' 
        : 'The page you are looking for does not exist.'}
    </p>
    <a 
      href={lang === 'it' ? '/it/' : '/en/'} 
      class="inline-block px-6 py-3 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
    >
      {lang === 'it' ? 'Torna alla home' : 'Back to home'}
    </a>
  </section>
</BaseLayout>
```

### 6.3 Home - src/pages/it/index.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
import ContactForm from '../../components/ContactForm.astro';
const lang = 'it';
---

<BaseLayout 
  lang={lang} 
  title="Giovanna Niola - Psicoterapeuta CBT" 
  description="Psicoterapia cognitivo-comportamentale a distanza o in presenza."
>
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <section class="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
    <img 
      src="/images/placeholder-hero.jpg" 
      alt="Studio di psicoterapia" 
      class="rounded-2xl object-cover w-full h-72 md:h-96" 
      loading="eager"
      width="600"
      height="400"
    />
    <div>
      <h1 class="font-serif text-3xl md:text-4xl mb-4">Benvenuto/a</h1>
      <p class="text-lg text-slate-700 leading-relaxed">
        Sono <strong>Giovanna Niola</strong>, psicoterapeuta cognitivo-comportamentale. 
        Lavoro con adulti e giovani adulti per difficoltà emotive, ansia, umore e stress. 
        Offro sedute online o in presenza, della durata di 50 minuti.
      </p>
      <p class="text-lg text-slate-700 leading-relaxed mt-4">
        [Testo breve placeholder da personalizzare - aggiungi qui la tua presentazione personale]
      </p>
    </div>
  </section>

  <section class="max-w-5xl mx-auto px-4 py-12 border-t">
    <h2 class="font-serif text-2xl md:text-3xl mb-8 text-center">Contattami</h2>
    <div class="flex justify-center">
      <ContactForm lang={lang} />
    </div>
  </section>
</BaseLayout>
```

### 6.4 Home (EN) - src/pages/en/index.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
import ContactForm from '../../components/ContactForm.astro';
const lang = 'en';
---

<BaseLayout 
  lang={lang} 
  title="Giovanna Niola - CBT Therapist" 
  description="Cognitive-behavioural psychotherapy online or in person."
>
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <section class="max-w-5xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
    <img 
      src="/images/placeholder-hero.jpg" 
      alt="Therapy practice" 
      class="rounded-2xl object-cover w-full h-72 md:h-96" 
      loading="eager"
      width="600"
      height="400"
    />
    <div>
      <h1 class="font-serif text-3xl md:text-4xl mb-4">Welcome</h1>
      <p class="text-lg text-slate-700 leading-relaxed">
        I'm <strong>Giovanna Niola</strong>, a cognitive-behavioural therapist. 
        I work with adults and young adults on anxiety, mood and stress. 
        Sessions are 50 minutes, online or in person.
      </p>
      <p class="text-lg text-slate-700 leading-relaxed mt-4">
        [Brief placeholder text to personalize - add your personal introduction here]
      </p>
    </div>
  </section>

  <section class="max-w-5xl mx-auto px-4 py-12 border-t">
    <h2 class="font-serif text-2xl md:text-3xl mb-8 text-center">Contact Me</h2>
    <div class="flex justify-center">
      <ContactForm lang={lang} />
    </div>
  </section>
</BaseLayout>
```

### 6.5 About - src/pages/it/about.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
const lang = 'it';
---

<BaseLayout lang={lang} title="Chi sono - Giovanna Niola" description="Informazioni sul mio percorso e approccio terapeutico">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <article class="max-w-4xl mx-auto px-4 py-12">
    <img 
      src="/images/placeholder-about.jpg" 
      alt="Giovanna Niola" 
      class="rounded-2xl w-full h-64 object-cover mb-12" 
      loading="lazy"
      width="800"
      height="400"
    />
    
    <section class="mb-12">
      <h1 class="font-serif text-3xl md:text-4xl mb-6">Chi sono</h1>
      <div class="prose prose-lg max-w-none">
        <p class="text-slate-700 leading-relaxed">
          Mi chiamo Giovanna Niola e sono una psicoterapeuta cognitivo-comportamentale iscritta all'Albo degli Psicologi della Sardegna (1/SPS).
        </p>
        <p class="text-slate-700 leading-relaxed mt-4">
          [Placeholder: Inserisci qui la tua biografia professionale, il percorso che ti ha portato a diventare psicoterapeuta, 
          le tue motivazioni e la tua filosofia di lavoro.]
        </p>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="font-serif text-2xl md:text-3xl mb-6">Il mio approccio</h2>
      <div class="prose prose-lg max-w-none">
        <p class="text-slate-700 leading-relaxed">
          Integro strumenti della CBT per obiettivi chiari e misurabili. Il percorso è collaborativo e pratico, 
          con esercizi tra una seduta e l'altra.
        </p>
        <p class="text-slate-700 leading-relaxed mt-4">
          [Placeholder: Descrivi il tuo metodo di lavoro, come strutturi le sedute, quali tecniche utilizzi maggiormente, 
          e come aiuti i tuoi pazienti a raggiungere i loro obiettivi.]
        </p>
      </div>
    </section>

    <section>
      <h2 class="font-serif text-2xl md:text-3xl mb-6">La mia formazione</h2>
      <div class="prose prose-lg max-w-none">
        <p class="text-slate-700 leading-relaxed">
          [Placeholder: Elenca la tua formazione accademica, specializzazioni, corsi di aggiornamento rilevanti, 
          supervisioni e qualsiasi altra credenziale professionale che ritieni importante condividere.]
        </p>
      </div>
    </section>
  </article>
</BaseLayout>
```

### 6.6 About (EN) - src/pages/en/about.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
const lang = 'en';
---

<BaseLayout lang={lang} title="About - Giovanna Niola" description="Information about my background and therapeutic approach">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <article class="max-w-4xl mx-auto px-4 py-12">
    <img 
      src="/images/placeholder-about.jpg" 
      alt="Giovanna Niola" 
      class="rounded-2xl w-full h-64 object-cover mb-12" 
      loading="lazy"
      width="800"
      height="400"
    />
    
    <section class="mb-12">
      <h1 class="font-serif text-3xl md:text-4xl mb-6">About me</h1>
      <div class="prose prose-lg max-w-none">
        <p class="text-slate-700 leading-relaxed">
          My name is Giovanna Niola and I'm a cognitive-behavioural therapist registered with the Sardinia Psychologists' Board (1/SPS).
        </p>
        <p class="text-slate-700 leading-relaxed mt-4">
          [Placeholder: Insert here your professional biography, the path that led you to become a psychotherapist, 
          your motivations and your work philosophy.]
        </p>
      </div>
    </section>

    <section class="mb-12">
      <h2 class="font-serif text-2xl md:text-3xl mb-6">My approach</h2>
      <div class="prose prose-lg max-w-none">
        <p class="text-slate-700 leading-relaxed">
          I use CBT methods to set clear, measurable goals. The work is collaborative and practical, 
          with exercises between sessions.
        </p>
        <p class="text-slate-700 leading-relaxed mt-4">
          [Placeholder: Describe your working method, how you structure sessions, which techniques you use most, 
          and how you help your patients achieve their goals.]
        </p>
      </div>
    </section>

    <section>
      <h2 class="font-serif text-2xl md:text-3xl mb-6">My training</h2>
      <div class="prose prose-lg max-w-none">
        <p class="text-slate-700 leading-relaxed">
          [Placeholder: List your academic training, specializations, relevant continuing education courses, 
          supervisions, and any other professional credentials you consider important to share.]
        </p>
      </div>
    </section>
  </article>
</BaseLayout>
```

### 6.7 What's CBT - src/pages/it/cbt.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
const lang = 'it';
---

<BaseLayout lang={lang} title="Cos'è la CBT - Giovanna Niola" description="Introduzione alla terapia cognitivo-comportamentale">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <article class="max-w-4xl mx-auto px-4 py-12">
    <img 
      src="/images/placeholder-cbt.jpg" 
      alt="Terapia cognitivo-comportamentale" 
      class="rounded-2xl w-full h-64 object-cover mb-12" 
      loading="lazy"
      width="800"
      height="400"
    />
    
    <h1 class="font-serif text-3xl md:text-4xl mb-8">Cos'è la terapia cognitivo-comportamentale</h1>
    
    <div class="prose prose-lg max-w-none space-y-6">
      <p class="text-slate-700 leading-relaxed">
        La CBT (Cognitive-Behavioural Therapy) aiuta a riconoscere e modificare pensieri e comportamenti 
        che mantengono il disagio. È un approccio strutturato, di solito a breve-medio termine.
      </p>
      
      <p class="text-slate-700 leading-relaxed">
        [Placeholder: Espandi questa sezione spiegando come funziona la CBT, quali problematiche affronta 
        (ansia, depressione, disturbi ossessivi, ecc.), i principi fondamentali dell'approccio, 
        e perché può essere efficace.]
      </p>

      <h2 class="font-serif text-2xl mt-12 mb-4">Come funziona una seduta</h2>
      <p class="text-slate-700 leading-relaxed">
        [Placeholder: Descrivi cosa aspettarsi da una seduta tipica: durata, struttura, 
        il ruolo attivo del paziente, i compiti a casa, e il processo di valutazione e monitoraggio.]
      </p>

      <h2 class="font-serif text-2xl mt-12 mb-4">Per chi è indicata</h2>
      <p class="text-slate-700 leading-relaxed">
        [Placeholder: Spiega per quali tipi di persone e problematiche è particolarmente adatta la CBT, 
        e se ci sono situazioni in cui potresti suggerire altri approcci o integrazioni.]
      </p>
    </div>
  </article>
</BaseLayout>
```

### 6.8 What's CBT (EN) - src/pages/en/cbt.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
const lang = 'en';
---

<BaseLayout lang={lang} title="What's CBT - Giovanna Niola" description="Introduction to cognitive-behavioural therapy">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <article class="max-w-4xl mx-auto px-4 py-12">
    <img 
      src="/images/placeholder-cbt.jpg" 
      alt="Cognitive-behavioural therapy" 
      class="rounded-2xl w-full h-64 object-cover mb-12" 
      loading="lazy"
      width="800"
      height="400"
    />
    
    <h1 class="font-serif text-3xl md:text-4xl mb-8">What is cognitive-behavioural therapy</h1>
    
    <div class="prose prose-lg max-w-none space-y-6">
      <p class="text-slate-700 leading-relaxed">
        CBT (Cognitive-Behavioural Therapy) helps identify and change patterns of thoughts and behaviours 
        that maintain distress. It's structured and often time-limited.
      </p>
      
      <p class="text-slate-700 leading-relaxed">
        [Placeholder: Expand this section explaining how CBT works, which issues it addresses 
        (anxiety, depression, OCD, etc.), the fundamental principles of the approach, 
        and why it can be effective.]
      </p>

      <h2 class="font-serif text-2xl mt-12 mb-4">How a session works</h2>
      <p class="text-slate-700 leading-relaxed">
        [Placeholder: Describe what to expect from a typical session: duration, structure, 
        the active role of the patient, homework assignments, and the assessment and monitoring process.]
      </p>

      <h2 class="font-serif text-2xl mt-12 mb-4">Who is it for</h2>
      <p class="text-slate-700 leading-relaxed">
        [Placeholder: Explain for which types of people and issues CBT is particularly suitable, 
        and if there are situations where you might suggest other approaches or integrations.]
      </p>
    </div>
  </article>
</BaseLayout>
```

### 6.9 Calendar - src/pages/it/calendar.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
import CalendlyEmbed from '../../components/CalendlyEmbed.astro';
const lang = 'it';

// IMPORTANT: Replace with your actual Calendly URL
const calendlyUrl = 'https://calendly.com/YOUR_USERNAME/50min';
---

<BaseLayout lang={lang} title="Calendario - Prenota una seduta" description="Prenota un appuntamento per una seduta di psicoterapia">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <section class="max-w-5xl mx-auto px-4 py-12">
    <img 
      src="/images/placeholder-calendar.jpg" 
      alt="Calendario appuntamenti" 
      class="rounded-2xl w-full h-56 object-cover mb-8" 
      loading="lazy"
      width="1000"
      height="300"
    />
    
    <div class="mb-8 space-y-4">
      <h1 class="font-serif text-3xl md:text-4xl">Prenota una seduta</h1>
      <p class="text-lg text-slate-700 leading-relaxed">
        Prenota un appuntamento (50 minuti). Le disponibilità si sincronizzano automaticamente con il mio calendario Google.
      </p>
      <p class="text-slate-700 leading-relaxed">
        Offro sedute sia <strong>online</strong> (via videochiamata) che <strong>in presenza</strong> nel mio studio. 
        Seleziona l'opzione che preferisci durante la prenotazione.
      </p>
      <p class="text-sm text-slate-600">
        Se hai bisogno di modificare o cancellare un appuntamento, puoi farlo direttamente dal link di conferma 
        che riceverai via email, oppure contattami a <a href="mailto:giovannaniola@gmail.com" class="underline">giovannaniola@gmail.com</a>.
      </p>
    </div>

    <CalendlyEmbed lang={lang} url={calendlyUrl} />
  </section>
</BaseLayout>
```

### 6.10 Calendar (EN) - src/pages/en/calendar.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
import CalendlyEmbed from '../../components/CalendlyEmbed.astro';
const lang = 'en';

// IMPORTANT: Replace with your actual Calendly URL
const calendlyUrl = 'https://calendly.com/YOUR_USERNAME/50min';
---

<BaseLayout lang={lang} title="Calendar - Book a session" description="Book an appointment for a psychotherapy session">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <section class="max-w-5xl mx-auto px-4 py-12">
    <img 
      src="/images/placeholder-calendar.jpg" 
      alt="Appointment calendar" 
      class="rounded-2xl w-full h-56 object-cover mb-8" 
      loading="lazy"
      width="1000"
      height="300"
    />
    
    <div class="mb-8 space-y-4">
      <h1 class="font-serif text-3xl md:text-4xl">Book a session</h1>
      <p class="text-lg text-slate-700 leading-relaxed">
        Book an appointment (50 minutes). Availability syncs automatically with my Google Calendar.
      </p>
      <p class="text-slate-700 leading-relaxed">
        I offer both <strong>online</strong> sessions (via video call) and <strong>in-person</strong> sessions at my practice. 
        Select your preferred option during booking.
      </p>
      <p class="text-sm text-slate-600">
        If you need to modify or cancel an appointment, you can do so directly from the confirmation link 
        you'll receive via email, or contact me at <a href="mailto:giovannaniola@gmail.com" class="underline">giovannaniola@gmail.com</a>.
      </p>
    </div>

    <CalendlyEmbed lang={lang} url={calendlyUrl} />
  </section>
</BaseLayout>
```

### 6.11 FAQ - src/pages/it/faq.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
const lang = 'it';

const faqs = [
  {
    question: "Quanto dura una seduta?",
    answer: "Ogni seduta dura 50 minuti. Questo tempo permette di lavorare in modo approfondito mantenendo la concentrazione."
  },
  {
    question: "Offri sedute online o solo in presenza?",
    answer: "Offro entrambe le modalità. Le sedute online si svolgono tramite videochiamata sicura, mentre quelle in presenza si tengono nel mio studio."
  },
  {
    question: "Serve l'impegnativa del medico?",
    answer: "No, non è necessaria un'impegnativa per prenotare una seduta privata di psicoterapia."
  },
  {
    question: "Come posso cancellare o spostare un appuntamento?",
    answer: "Puoi modificare o cancellare l'appuntamento direttamente dal link di conferma che ricevi via email, oppure contattandomi all'indirizzo giovannaniola@gmail.com. Ti chiedo di avvisare con almeno 24 ore di anticipo quando possibile."
  },
  {
    question: "Quanto tempo ci vuole per ricevere una risposta?",
    answer: "Di norma rispondo entro 48 ore lavorative. Se hai bisogno urgente di assistenza, ti consiglio di contattare i servizi di emergenza appropriati."
  },
  {
    question: "Quanto dura un percorso di terapia?",
    answer: "La durata varia a seconda degli obiettivi individuali. La CBT è generalmente un approccio a breve-medio termine, ma ogni percorso è personalizzato sulle esigenze specifiche."
  },
  {
    question: "Lavori con adolescenti?",
    answer: "[Placeholder: Specifica la tua fascia d'età target e se lavori con minori, in tal caso se richiedi la presenza dei genitori]"
  }
];
---

<BaseLayout lang={lang} title="FAQ - Domande frequenti" description="Risposte alle domande più comuni sulla psicoterapia">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <article class="max-w-4xl mx-auto px-4 py-12">
    <img 
      src="/images/placeholder-faq.jpg" 
      alt="Domande frequenti" 
      class="rounded-2xl w-full h-64 object-cover mb-12" 
      loading="lazy"
      width="800"
      height="400"
    />
    
    <h1 class="font-serif text-3xl md:text-4xl mb-8">Domande frequenti</h1>
    
    <div class="space-y-8">
      {faqs.map((faq) => (
        <div class="border-b pb-6">
          <h2 class="font-serif text-xl md:text-2xl mb-3 text-slate-900">{faq.question}</h2>
          <p class="text-slate-700 leading-relaxed">{faq.answer}</p>
        </div>
      ))}
    </div>

    <div class="mt-12 p-6 bg-sand-50 rounded-xl border">
      <p class="text-slate-700">
        <strong>Non trovi la risposta che cerchi?</strong> Contattami pure via email a{' '}
        <a href="mailto:giovannaniola@gmail.com" class="underline text-emerald-600">giovannaniola@gmail.com</a>.
      </p>
    </div>
  </article>
</BaseLayout>
```

### 6.12 FAQ (EN) - src/pages/en/faq.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
const lang = 'en';

const faqs = [
  {
    question: "How long is a session?",
    answer: "Each session lasts 50 minutes. This duration allows for in-depth work while maintaining focus."
  },
  {
    question: "Do you offer online sessions or only in-person?",
    answer: "I offer both modalities. Online sessions are conducted via secure video call, while in-person sessions take place at my practice."
  },
  {
    question: "Do I need a referral?",
    answer: "No, you don't need a referral to book a private psychotherapy session."
  },
  {
    question: "How can I cancel or reschedule an appointment?",
    answer: "You can modify or cancel your appointment directly from the confirmation link you receive via email, or by contacting me at giovannaniola@gmail.com. I ask that you give at least 24 hours' notice when possible."
  },
  {
    question: "How long does it take to receive a response?",
    answer: "I typically respond within 48 business hours. If you need urgent assistance, I recommend contacting appropriate emergency services."
  },
  {
    question: "How long does a therapy course last?",
    answer: "Duration varies depending on individual goals. CBT is generally a short-to-medium term approach, but each course is tailored to specific needs."
  },
  {
    question: "Do you work with adolescents?",
    answer: "[Placeholder: Specify your target age range and whether you work with minors, and if so, whether parental presence is required]"
  }
];
---

<BaseLayout lang={lang} title="FAQ - Frequently asked questions" description="Answers to the most common questions about psychotherapy">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <article class="max-w-4xl mx-auto px-4 py-12">
    <img 
      src="/images/placeholder-faq.jpg" 
      alt="Frequently asked questions" 
      class="rounded-2xl w-full h-64 object-cover mb-12" 
      loading="lazy"
      width="800"
      height="400"
    />
    
    <h1 class="font-serif text-3xl md:text-4xl mb-8">Frequently asked questions</h1>
    
    <div class="space-y-8">
      {faqs.map((faq) => (
        <div class="border-b pb-6">
          <h2 class="font-serif text-xl md:text-2xl mb-3 text-slate-900">{faq.question}</h2>
          <p class="text-slate-700 leading-relaxed">{faq.answer}</p>
        </div>
      ))}
    </div>

    <div class="mt-12 p-6 bg-sand-50 rounded-xl border">
      <p class="text-slate-700">
        <strong>Can't find the answer you're looking for?</strong> Feel free to contact me via email at{' '}
        <a href="mailto:giovannaniola@gmail.com" class="underline text-emerald-600">giovannaniola@gmail.com</a>.
      </p>
    </div>
  </article>
</BaseLayout>
```

### 6.13 Privacy - src/pages/it/privacy.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
const lang = 'it';
---

<BaseLayout lang={lang} title="Privacy Policy - Informativa Privacy" description="Informativa sul trattamento dei dati personali">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <article class="max-w-4xl mx-auto px-4 py-12 prose prose-lg">
    <h1 class="font-serif text-3xl md:text-4xl mb-8">Informativa Privacy</h1>
    
    <p class="text-sm text-slate-600">Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}</p>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">1. Titolare del trattamento</h2>
      <p>
        Il titolare del trattamento dei dati personali è <strong>Giovanna Niola</strong>, 
        Psicoterapeuta cognitivo-comportamentale, iscritta all'Albo degli Psicologi della Sardegna (1/SPS).
      </p>
      <p>
        Email: <a href="mailto:giovannaniola@gmail.com" class="underline">giovannaniola@gmail.com</a>
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">2. Dati raccolti</h2>
      <p>Attraverso questo sito web raccogliamo:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Dati forniti volontariamente:</strong> nome, email e messaggio tramite il modulo di contatto</li>
        <li><strong>Dati di prenotazione:</strong> informazioni fornite attraverso il calendario Calendly (nome, email, data/ora dell'appuntamento)</li>
        <li><strong>Cookie tecnici:</strong> consenso all'uso di Calendly (widget di prenotazione che può impostare cookie)</li>
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">3. Finalità del trattamento</h2>
      <p>I dati vengono trattati per:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Rispondere alle richieste di contatto</li>
        <li>Gestire le prenotazioni degli appuntamenti</li>
        <li>Fornire servizi di psicoterapia</li>
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">4. Base giuridica</h2>
      <p>
        Il trattamento si basa sul <strong>consenso esplicito</strong> dell'interessato (art. 6, comma 1, lett. a GDPR) 
        e sull'<strong>esecuzione di misure precontrattuali</strong> adottate su richiesta dell'interessato (art. 6, comma 1, lett. b GDPR).
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">5. Conservazione dei dati</h2>
      <p>
        I dati saranno conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti 
        e comunque nel rispetto degli obblighi di legge (per i dati clinici: 10 anni dalla conclusione del trattamento, 
        come previsto dal Codice Deontologico degli Psicologi).
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">6. Comunicazione e diffusione</h2>
      <p>
        I dati personali non saranno comunicati a terzi né diffusi, salvo:
      </p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Obblighi di legge</li>
        <li>Servizi tecnici necessari (Formspree per email, Calendly per prenotazioni)</li>
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">7. Diritti dell'interessato</h2>
      <p>Ai sensi degli artt. 15-22 del GDPR, l'interessato ha diritto di:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Accedere ai propri dati personali</li>
        <li>Ottenere la rettifica o la cancellazione degli stessi</li>
        <li>Ottenere la limitazione del trattamento</li>
        <li>Opporsi al trattamento</li>
        <li>Richiedere la portabilità dei dati</li>
        <li>Revocare il consenso in qualsiasi momento</li>
        <li>Proporre reclamo all'Autorità Garante per la Protezione dei Dati Personali</li>
      </ul>
      <p class="mt-4">
        Per esercitare i propri diritti, contattare: <a href="mailto:giovannaniola@gmail.com" class="underline">giovannaniola@gmail.com</a>
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">8. Cookie e servizi terzi</h2>
      <p>
        Questo sito non utilizza cookie analitici o di profilazione. Viene utilizzato:
      </p>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Calendly:</strong> widget di prenotazione che può impostare cookie tecnici. 
        Il widget viene caricato solo dopo il consenso esplicito dell'utente.</li>
      </ul>
      <p class="mt-4">
        È possibile gestire le preferenze sui cookie attraverso il banner di consenso visualizzato nella pagina calendario.
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">9. Modifiche alla presente informativa</h2>
      <p>
        Questa informativa può essere aggiornata periodicamente. La data dell'ultimo aggiornamento è indicata in alto.
      </p>
    </section>

    <div class="mt-12 p-6 bg-slate-50 rounded-xl border">
      <p class="text-sm">
        <strong>Domande o dubbi?</strong> Per qualsiasi chiarimento sulla privacy e sul trattamento dei dati, 
        non esitare a contattarmi a <a href="mailto:giovannaniola@gmail.com" class="underline">giovannaniola@gmail.com</a>
      </p>
    </div>
  </article>
</BaseLayout>
```

### 6.14 Privacy (EN) - src/pages/en/privacy.astro

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import LanguageSwitch from '../../components/LanguageSwitch.astro';
const lang = 'en';
---

<BaseLayout lang={lang} title="Privacy Policy" description="Information on personal data processing">
  <Fragment slot="langswitch"><LanguageSwitch lang={lang} /></Fragment>
  <Fragment slot="langswitch-mobile"><LanguageSwitch lang={lang} /></Fragment>
  
  <article class="max-w-4xl mx-auto px-4 py-12 prose prose-lg">
    <h1 class="font-serif text-3xl md:text-4xl mb-8">Privacy Policy</h1>
    
    <p class="text-sm text-slate-600">Last updated: {new Date().toLocaleDateString('en-US')}</p>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">1. Data Controller</h2>
      <p>
        The data controller is <strong>Giovanna Niola</strong>, 
        Cognitive-behavioural therapist, registered with the Sardinia Psychologists' Board (1/SPS).
      </p>
      <p>
        Email: <a href="mailto:giovannaniola@gmail.com" class="underline">giovannaniola@gmail.com</a>
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">2. Data Collected</h2>
      <p>Through this website we collect:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Voluntarily provided data:</strong> name, email, and message via the contact form</li>
        <li><strong>Booking data:</strong> information provided through the Calendly calendar (name, email, appointment date/time)</li>
        <li><strong>Technical cookies:</strong> consent to use Calendly (booking widget that may set cookies)</li>
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">3. Processing Purposes</h2>
      <p>Data is processed to:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Respond to contact requests</li>
        <li>Manage appointment bookings</li>
        <li>Provide psychotherapy services</li>
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">4. Legal Basis</h2>
      <p>
        Processing is based on the <strong>explicit consent</strong> of the data subject (Art. 6(1)(a) GDPR) 
        and on the <strong>performance of pre-contractual measures</strong> taken at the request of the data subject (Art. 6(1)(b) GDPR).
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">5. Data Retention</h2>
      <p>
        Data will be retained for the time strictly necessary for the purposes for which it was collected 
        and in any case in compliance with legal obligations (for clinical data: 10 years from the end of treatment, 
        as required by the Psychologists' Code of Ethics).
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">6. Communication and Disclosure</h2>
      <p>
        Personal data will not be communicated to third parties or disclosed, except for:
      </p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Legal obligations</li>
        <li>Necessary technical services (Formspree for email, Calendly for bookings)</li>
      </ul>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">7. Data Subject Rights</h2>
      <p>Pursuant to Arts. 15-22 of the GDPR, the data subject has the right to:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Access their personal data</li>
        <li>Obtain rectification or erasure of data</li>
        <li>Obtain restriction of processing</li>
        <li>Object to processing</li>
        <li>Request data portability</li>
        <li>Withdraw consent at any time</li>
        <li>Lodge a complaint with the Data Protection Authority</li>
      </ul>
      <p class="mt-4">
        To exercise your rights, contact: <a href="mailto:giovannaniola@gmail.com" class="underline">giovannaniola@gmail.com</a>
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">8. Cookies and Third-Party Services</h2>
      <p>
        This site does not use analytics or profiling cookies. The following is used:
      </p>
      <ul class="list-disc pl-6 space-y-2">
        <li><strong>Calendly:</strong> booking widget that may set technical cookies. 
        The widget is loaded only after explicit user consent.</li>
      </ul>
      <p class="mt-4">
        Cookie preferences can be managed through the consent banner displayed on the calendar page.
      </p>
    </section>

    <section class="mt-8">
      <h2 class="font-serif text-2xl mb-4">9. Changes to this Policy</h2>
      <p>
        This policy may be updated periodically. The date of the last update is indicated at the top.
      </p>
    </section>

    <div class="mt-12 p-6 bg-slate-50 rounded-xl border">
      <p class="text-sm">
        <strong>Questions or concerns?</strong> For any clarification about privacy and data processing, 
        feel free to contact me at <a href="mailto:giovannaniola@gmail.com" class="underline">giovannaniola@gmail.com</a>
      </p>
    </div>
  </article>
</BaseLayout>
```

## 7) Images

Place tasteful placeholders under `public/images/`. Suggested dimensions:
- `placeholder-hero.jpg`: 1200x800px (landscape)
- `placeholder-about.jpg`: 1200x800px (landscape)
- `placeholder-cbt.jpg`: 1200x600px (landscape)
- `placeholder-calendar.jpg`: 1400x600px (wide banner)
- `placeholder-faq.jpg`: 1200x800px (landscape)

Use descriptive alt text. Consider using free stock photos from:
- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- Search terms: "therapy office", "calm workspace", "counseling", "mental health"

**Favicon:** Create a simple `favicon.svg` with initials "GN" or a therapy-related icon.

## 8) Formspree setup

1. Go to [Formspree.io](https://formspree.io) and create a free account
2. Create a new form
3. Set email delivery to: `giovannaniola@gmail.com`
4. Copy your endpoint URL (looks like `https://formspree.io/f/xxxxxx`)
5. Replace `YOUR_FORM_ID_HERE` in `src/components/ContactForm.astro` with your actual form ID
6. (Optional) Configure a success redirect URL in Formspree settings

**Note:** Free tier includes 50 submissions/month. The honeypot field (`_gotcha`) helps prevent spam.

## 9) Calendly (or TidyCal)

1. Set up your Calendly account and create an event type (50-minute session)
2. Copy your scheduling link (e.g., `https://calendly.com/giovannaniola/50min`)
3. Replace `YOUR_USERNAME/50min` in both calendar pages (`it/calendar.astro` and `en/calendar.astro`)
4. Configure your availability and sync with Google Calendar in Calendly settings
5. Consider adding:
   - Custom questions (e.g., "Online or in-person?")
   - Timezone detection
   - Email notifications

The consent gate will defer widget loading until accepted (minimal cookie compliance).

## 10) Routing & language default

Italian is default: link your repo homepage to `/it/`.

English pages live under `/en/`.

The language switch computes the mirrored path automatically.

Root `/` redirects to `/it/` via meta refresh and JavaScript.

## 11) GitHub Pages deployment

### Install adapter & configure

```bash
npm install -D @astrojs/adapter-static
```

**astro.config.mjs:**

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import staticAdapter from '@astrojs/adapter-static';

export default defineConfig({
  site: 'https://<your-gh-username>.github.io',
  base: '/<repo-name>',  // Remove this line if using custom domain or root deployment
  output: 'static',
  adapter: staticAdapter(),
  integrations: [tailwind()],
});
```

**Important:** 
- If deploying to `username.github.io/<repo-name>`, keep the `base` setting
- If deploying to a custom domain or `username.github.io` (root), remove the `base` line

### GitHub Actions - .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build site
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### package.json scripts

```json
{
  "name": "therapist-site",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/tailwind": "^6.0.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@astrojs/adapter-static": "^3.0.0"
  }
}
```

### Enable GitHub Pages

1. Push your code to GitHub
2. Go to repository **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. The workflow will run automatically on push to `main`

### Custom domain (later)

When ready to use a custom domain (e.g., `giovannaniola.it`):

1. Add a `public/CNAME` file with your domain:
   ```
   giovannaniola.it
   ```

2. Update `astro.config.mjs`:
   ```javascript
   site: 'https://giovannaniola.it',
   // Remove the 'base' line
   ```

3. Configure DNS with your domain provider:
   - Add A records pointing to GitHub Pages IPs
   - Or CNAME record pointing to `<username>.github.io`

4. In GitHub repo settings, add custom domain and enable HTTPS

## 12) Content placeholders (quick starters)

Use these as short seeds (edit later).

### IT snippets

**Home / Chi sono:**
```
Sono Giovanna Niola, psicoterapeuta cognitivo-comportamentale. Lavoro con adulti e giovani adulti per difficoltà emotive, ansia, umore e stress. Offro sedute online o in presenza, della durata di 50 minuti.
```

**About / Il mio approccio:**
```
Integro strumenti della CBT per obiettivi chiari e misurabili. Il percorso è collaborativo e pratico, con esercizi tra una seduta e l'altra.
```

**CBT:**
```
La CBT aiuta a riconoscere e modificare pensieri e comportamenti che mantengono il disagio. È un approccio strutturato, di solito a breve-medio termine.
```

**FAQ (esempi):**
- Quanto dura una seduta? — 50 minuti.
- Online o in studio? — Entrambi.
- Serve l'impegnativa? — No.
- Come cancello un appuntamento? — Contattami via email o dal calendario.
- Tempi di risposta? — Di norma entro 48 ore lavorative.

### EN snippets

**Home / Who I am:**
```
I'm Giovanna Niola, a cognitive-behavioural therapist. I work with adults and young adults on anxiety, mood and stress. Sessions are 50 minutes, online or in person.
```

**About / My approach:**
```
I use CBT methods to set clear, measurable goals. The work is collaborative and practical, with exercises between sessions.
```

**What's CBT:**
```
CBT helps identify and change patterns of thoughts and behaviours that maintain distress. It's structured and often time-limited.
```

**FAQ (examples):**
- How long is a session? — 50 minutes.
- Online or in-person? — Both.
- Referral needed? — No.
- How to cancel? — Email me or use the calendar.
- Response time? — Usually within 48 business hours.

## 13) Commands to run

```bash
# 1) Create project & add Tailwind
npm create astro@latest therapist-site -- --template basics
cd therapist-site
npx astro add tailwind
npm install

# 2) Install static adapter
npm install -D @astrojs/adapter-static

# 3) Create folders
mkdir -p public/images src/components src/layouts src/pages/it src/pages/en src/styles .github/workflows

# 4) Add all files from this guide
# (Create each file with the content provided above)

# 5) Replace placeholders:
#    - FORMSPREE endpoint in ContactForm.astro
#    - calendlyUrl in calendar pages (it/calendar.astro and en/calendar.astro)
#    - site and base in astro.config.mjs
#    - Add placeholder images to public/images/

# 6) Run & preview locally
npm run dev
# Visit http://localhost:4321

# 7) Build for production
npm run build
npm run preview

# 8) Commit & push
git init
git add .
git commit -m "Initial Astro + Tailwind bilingual therapist site"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main

# 9) Enable GitHub Pages in repo settings (Source: GitHub Actions)
```

## 14) QA checklist (minimal)

- [ ] Italian pages reachable under `/it`, English under `/en`
- [ ] Language switch works between mirrored pages
- [ ] One image per page renders (lazy loads except hero)
- [ ] Contact form submits to Formspree and sends to `giovannaniola@gmail.com`
- [ ] Consent checkbox required on contact form
- [ ] Calendar page shows consent banner; Calendly loads on acceptance
- [ ] Privacy page present (IT/EN), linked in header & form checkbox
- [ ] Mobile menu works (hamburger button toggles navigation)
- [ ] All links work (no 404s except intentional test)
- [ ] GitHub Pages build & deploy succeed; site loads over HTTPS
- [ ] 404 page shows correctly for invalid URLs
- [ ] Root `/` redirects to `/it/`
- [ ] Forms validate required fields
- [ ] Focus states visible for keyboard navigation
- [ ] Custom domain (later): CNAME added and verified

## 15) Common issues & troubleshooting

### Images don't load
- Check that images exist in `public/images/`
- Verify `base` path in `astro.config.mjs` matches deployment
- For GitHub Pages subdirectory: use `base: '/repo-name'`
- For custom domain or root: remove `base` entirely

### Forms don't submit
- Verify Formspree endpoint is correct and active
- Check browser console for errors
- Ensure Formspree form is not in test mode

### Calendly doesn't load
- Check browser console for CSP (Content Security Policy) errors
- Verify consent was accepted (check localStorage)
- Confirm Calendly URL is correct
- Test the Calendly link directly in a new tab

### Build fails
- Clear `node_modules` and `package-lock.json`, run `npm install` again
- Check for syntax errors in `.astro` files
- Verify all imports are correct
- Check GitHub Actions logs for specific error messages

### Styles not applying
- Ensure `tailwind.config.cjs` content paths include all file types
- Check that `globals.css` is imported (it's in BaseLayout)
- Clear browser cache or try incognito mode

### Mobile menu not working
- Check browser console for JavaScript errors
- Verify button IDs match in BaseLayout.astro
- Ensure script is not being blocked

## 16) Notes to the AI

### Design principles
- Keep the UI calm and airy: generous white space, rounded cards, soft borders, large line-height
- Prefer `max-w-5xl` or `max-w-4xl` wrappers and `px-4` padding
- Use Inter for UI text, Lora for headings and pull quotes
- Color palette: warm sand backgrounds, slate text, emerald accent for CTAs
- All interactive elements should have hover states and focus styles

### What NOT to add
- Do not add analytics, schema.org, hreflang, or extra accessibility widgets beyond basics
- No blog, resources section, or complex content management
- No backend, database, or user authentication
- No heavy JavaScript frameworks or unnecessary dependencies

### Content approach
- All text and images are placeholders; keep copy concise and light
- Mark obvious placeholders with `[Placeholder: ...]` so they're easy to find and replace
- Prioritize clarity and simplicity over comprehensiveness
- Maintain a warm, professional, welcoming tone

### Code quality
- Prefer semantic HTML (`<article>`, `<section>`, `<nav>`)
- Keep components small and focused
- Use TypeScript where beneficial but don't over-engineer
- Comment any non-obvious code or workarounds
- Validate all props with TypeScript or JSDoc where appropriate

### Accessibility basics (minimal but important)
- Skip-to-content link for keyboard users
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text for all images
- Form labels associated with inputs
- ARIA labels where appropriate (mobile menu button, language switch)
- Focus states visible and styled

## 17) Future enhancements (optional, not in scope)

If the site grows in the future, consider:
- **Testimonials section** with patient reviews (anonymized)
- **Blog/articles** about CBT, mental health, self-care
- **Insurance information page** if accepting insurance
- **Multiple therapist profiles** if expanding to a group practice
- **Newsletter signup** for updates and mental health tips
- **Resource library** with worksheets, exercises, reading recommendations
- **Online payment integration** for session fees
- **Multi-language support** beyond IT/EN (e.g., French, Spanish)

---

## End of BUILD_GUIDE.md (Corrected Version)

This guide provides a complete, production-ready blueprint for building a professional therapist website. All encoding issues have been fixed, technical details clarified, and best practices incorporated.