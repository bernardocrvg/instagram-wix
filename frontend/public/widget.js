(function() {
  function initInstaWix() {
    const container = document.getElementById('instawix-feed');
    if (!container) return;

    const config = {
      username: container.getAttribute('data-user'),
      hashtag: container.getAttribute('data-tag'),
      limit: parseInt(container.getAttribute('data-limit')) || 20,
      type: container.getAttribute('data-type') || 'fixed',
      perPage: parseInt(container.getAttribute('data-per-page')) || 12,
      gap: parseInt(container.getAttribute('data-gap')) || 10
    };

    const scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
    const baseUrl = scriptTag ? scriptTag.src.substring(0, scriptTag.src.lastIndexOf('/')) : '.';
    const jsonUrl = `${baseUrl}/posts.json?t=${new Date().getTime()}`;

    fetch(jsonUrl)
      .then(response => response.json())
      .then(posts => {
        renderFeed(container, posts, config);
      })
      .catch(err => {
        console.error('InstaWix: Erro ao carregar posts', err);
        container.innerHTML = '<p style="text-align:center; color:#666;">Não foi possível carregar o feed.</p>';
      });
  }

  function renderFeed(container, allPosts, config) {
    let posts = allPosts;
    if (config.hashtag) {
      const tag = config.hashtag.replace('#', '').toLowerCase();
      posts = allPosts.filter(p => p.caption && p.caption.toLowerCase().includes(tag));
    }

    let currentPage = 1;
    
    function renderPage(page) {
      container.innerHTML = ''; 
      
      let displayPosts = [];
      let totalPages = 1;

      if (config.type === 'fixed') {
        displayPosts = posts.slice(0, 5);
      } else if (config.type === 'custom') {
        displayPosts = posts.slice(0, config.limit);
      } else if (config.type === 'paginated') {
        const limit = config.perPage;
        totalPages = Math.ceil(posts.length / limit);
        const start = (page - 1) * limit;
        displayPosts = posts.slice(start, start + limit);
      }

      if (displayPosts.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">Nenhum post encontrado.</p>';
        return;
      }

      displayPosts.forEach(post => {
        const link = document.createElement('a');
        link.href = post.permalink;
        link.target = '_blank';
        link.className = 'instawix-post';
        link.rel = 'noopener noreferrer';
        
        const img = document.createElement('img');
        img.src = post.media_url;
        img.alt = post.caption || 'Instagram Post';
        img.loading = 'lazy';
        
        link.appendChild(img);

        // Adiciona a Legenda (Overlay)
        if (post.caption) {
            const overlay = document.createElement('div');
            overlay.className = 'instawix-overlay';
            
            const caption = document.createElement('p');
            caption.className = 'instawix-caption';
            caption.innerText = post.caption;
            
            overlay.appendChild(caption);
            link.appendChild(overlay);
        }

        container.appendChild(link);
      });

      if (config.type === 'paginated' && totalPages > 1) {
        const nav = document.createElement('div');
        nav.className = 'instawix-nav';
        nav.style.cssText = 'display:flex; justify-content:center; gap:10px; margin-top:20px; width:100%; grid-column: 1 / -1;';
        
        const prevBtn = createBtn('< Anterior', page > 1, () => renderPage(page - 1));
        const nextBtn = createBtn('Próximo >', page < totalPages, () => renderPage(page + 1));
        
        const info = document.createElement('span');
        info.innerText = `Página ${page} de ${totalPages}`;
        info.style.cssText = 'font-family:sans-serif; font-size:14px; color:#666; align-self:center;';

        nav.appendChild(prevBtn);
        nav.appendChild(info);
        nav.appendChild(nextBtn);
        container.appendChild(nav);
      }
    }

    function createBtn(text, enabled, onClick) {
      const btn = document.createElement('button');
      btn.innerText = text;
      btn.disabled = !enabled;
      btn.onclick = onClick;
      btn.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #ddd;
        background: ${enabled ? '#fff' : '#f5f5f5'};
        color: ${enabled ? '#333' : '#aaa'};
        cursor: ${enabled ? 'pointer' : 'default'};
        border-radius: 4px;
        font-family: sans-serif;
        font-size: 14px;
      `;
      return btn;
    }

    renderPage(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initInstaWix);
  } else {
    initInstaWix();
  }
})();
