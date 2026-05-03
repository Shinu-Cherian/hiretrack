(function() {
  // Prevent double injection
  if (document.getElementById('hiretrack-extension-root')) return;

  const root = document.createElement('div');
  root.id = 'hiretrack-extension-root';
  document.body.appendChild(root);

  // FAB Button
  const fab = document.createElement('div');
  fab.id = 'hiretrack-fab';
  fab.innerHTML = 'HT';
  root.appendChild(fab);

  // Menu
  const menu = document.createElement('div');
  menu.id = 'hiretrack-menu';
  menu.innerHTML = `
    <div class="hiretrack-menu-item" data-type="job">Add Job</div>
    <div class="hiretrack-menu-item" data-type="referral">Add Referral</div>
  `;
  root.appendChild(menu);

  // Overlay Iframe
  const overlay = document.createElement('div');
  overlay.id = 'hiretrack-overlay';
  overlay.innerHTML = `
    <div id="hiretrack-overlay-content">
      <div id="hiretrack-overlay-close">×</div>
      <iframe id="hiretrack-iframe" src=""></iframe>
    </div>
  `;
  root.appendChild(overlay);

  const iframe = overlay.querySelector('#hiretrack-iframe');

  // Event Listeners
  fab.addEventListener('click', () => {
    menu.classList.toggle('active');
    fab.classList.toggle('active');
  });

  menu.querySelectorAll('.hiretrack-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const type = item.getAttribute('data-type');
      iframe.src = `http://localhost:5173/extension/${type}`;
      overlay.classList.add('active');
      menu.classList.remove('active');
      fab.classList.remove('active');
    });
  });

  overlay.querySelector('#hiretrack-overlay-close').addEventListener('click', () => {
    overlay.classList.remove('active');
    iframe.src = '';
  });

  // Listen for messages from iframe (e.g. to close on cancel)
  window.addEventListener('message', (event) => {
    if (event.data === 'close-hiretrack-overlay') {
      overlay.classList.remove('active');
      iframe.src = '';
    }
  });

})();
