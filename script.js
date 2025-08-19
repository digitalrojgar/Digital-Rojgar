
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const openBtn = document.getElementById('openSearch');
  const modal = document.getElementById('searchModal');
  const closeBtn = document.getElementById('closeSearch');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const count = document.getElementById('searchCount');

  function openModal(){
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
    input.value = '';
    results.innerHTML = '';
    count.textContent = '';
    setTimeout(()=>input.focus(),50);
  }
  function closeModal(){
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden','true');
  }
  if(openBtn) openBtn.addEventListener('click', openModal);
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  let globalIndex = [];
  fetch('search-index.json').then(r => r.json()).then(data => { globalIndex = data; }).catch(()=>{});

  function highlight(text, query){
    const re = new RegExp('('+query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+')','ig');
    return text.replace(re,'<mark>$1</mark>');
  }

  function doSearch(q){
    const term = q.trim();
    if(!term){ results.innerHTML=''; count.textContent=''; return; }
    const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    const hits = globalIndex.filter(item => re.test(item.text) || re.test(item.title));
    count.textContent = hits.length + ' results';
    results.innerHTML = hits.slice(0,200).map(h => {
      const snippet = h.text.length>140 ? h.text.slice(0,140)+'…' : h.text;
      return `<li><a href="${h.url}" onclick="document.getElementById('searchModal').classList.remove('active');">${highlight(h.title + ' — ' + snippet, term)}</a></li>`;
    }).join('');
  }

  if(input){
    input.addEventListener('input', (e)=> doSearch(e.target.value));
    const urlQ = new URLSearchParams(location.search).get('q');
    if(urlQ){ openModal(); input.value=urlQ; doSearch(urlQ); }
  }
})();
<script>
function toggleMenu() {
  document.getElementById("nav-links").classList.toggle("active");
}
</script>
