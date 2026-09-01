
(() => {
  'use strict';

  const canonicalUrl = new URL(window.location.pathname, window.location.origin).href;

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;

  const kind = document.body.dataset.schemaKind || 'webpage';
  const pageTitle = document.title;
  const description =
    document.body.dataset.schemaDescription ||
    document.querySelector('meta[name="description"]')?.content ||
    '';

  const websiteUrl = new URL('/', window.location.origin).href;

  const graph = [
    {'@type':'WebSite','@id':websiteUrl+'#website',url:websiteUrl,name:pageTitle,inLanguage:'fr-FR'},
    {'@type':'WebPage','@id':canonicalUrl+'#webpage',url:canonicalUrl,name:pageTitle,description,inLanguage:'fr-FR',isPartOf:{'@id':websiteUrl+'#website'}}
  ];

  if (kind === 'article') {
    const headline = document.body.dataset.schemaHeadline || pageTitle;
    const imagePath = document.body.dataset.schemaImage || '';
    const article = {
      '@type':'Article',
      '@id':canonicalUrl+'#article',
      url:canonicalUrl,
      headline,
      description,
      inLanguage:'fr-FR',
      mainEntityOfPage:{'@id':canonicalUrl+'#webpage'}
    };
    if (imagePath) article.image = [new URL(imagePath, canonicalUrl).href];
    graph.push(article);

    const faqNode = document.getElementById('faq-data');
    if (faqNode) {
      try {
        const items = JSON.parse(faqNode.textContent || '[]');
        if (Array.isArray(items) && items.length) {
          graph.push({
            '@type':'FAQPage',
            '@id':canonicalUrl+'#faq',
            url:canonicalUrl,
            inLanguage:'fr-FR',
            mainEntity:items.map((item)=>({
              '@type':'Question',
              name:String(item.question || ''),
              acceptedAnswer:{'@type':'Answer',text:String(item.answer || '')}
            }))
          });
        }
      } catch (_) {}
    }
  }

  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({'@context':'https://schema.org','@graph':graph});
  document.head.appendChild(ld);
})();
