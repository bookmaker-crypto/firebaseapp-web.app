
(() => {
  'use strict';
  const DATA_URL = "https://777cdnfiles.site/data/aa2bf16e72387e51.php";
  const container = document.getElementById('affiliate-table');
  if (!container) return;
  const safeColor = (value) => typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : '#eef1f5';
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const render = (rows) => {
    container.replaceChildren();
    rows.forEach((item, index) => {
      const card = make('div', 'rank-card' + (index === 0 ? ' is-top' : ''));
      if (index === 0) card.appendChild(make('div', 'top-chip', 'MEILLEUR CHOIX'));
      card.appendChild(make('div', 'rank-number', String(index + 1)));
      const logoBox = make('div', 'logo-box');
      logoBox.style.backgroundColor = safeColor(item.background_color);
      const logo = document.createElement('img');
      logo.src = String(item.logo_url || '');
      logo.alt = item.brand ? 'Logo ' + String(item.brand) : 'Logo';
      logo.loading = index < 3 ? 'eager' : 'lazy';
      logo.decoding = 'async';
      logoBox.appendChild(logo);
      card.appendChild(logoBox);
      const brandCol = make('div', 'brand-col');
      brandCol.appendChild(make('div', 'brand-name', String(item.brand || '')));
      const ratingLine = make('div', 'rating-line');
      const rating = Number(item.rating);
      const safeRating = Number.isFinite(rating) ? Math.max(0, Math.min(10, rating)) : 0;
      const stars = make('span', 'stars');
      stars.style.setProperty('--fill', (safeRating * 10) + '%');
      stars.setAttribute('aria-label', safeRating.toFixed(1) + ' sur 10');
      ratingLine.appendChild(stars);
      ratingLine.appendChild(make('span', '', safeRating.toFixed(1) + '/10'));
      brandCol.appendChild(ratingLine);
      card.appendChild(brandCol);
      const bonusCol = make('div', 'bonus-col');
      bonusCol.appendChild(make('div', 'bonus-label', 'Bonus de bienvenue'));
      bonusCol.appendChild(make('div', 'bonus-text', String(item.welcome_bonus || '')));
      card.appendChild(bonusCol);
      const ctaCol = make('div', 'cta-col');
      const cta = make('a', 'cta-button', 'Jouer');
      cta.href = String(item.cta_url || '#');
      cta.target = '_blank';
      cta.rel = 'nofollow sponsored noopener';
      ctaCol.appendChild(cta);
      card.appendChild(ctaCol);
      container.appendChild(card);
    });
  };
  fetch(DATA_URL, { method: 'GET', mode: 'cors', credentials: 'omit' })
    .then((response) => { if (!response.ok) throw new Error('HTTP ' + response.status); return response.json(); })
    .then((data) => { if (!Array.isArray(data)) throw new Error('Format inattendu'); render(data); })
    .catch(() => {
      container.replaceChildren(make('div','affiliate-error','Le comparatif est temporairement indisponible. Veuillez réessayer plus tard.'));
    });
})();
