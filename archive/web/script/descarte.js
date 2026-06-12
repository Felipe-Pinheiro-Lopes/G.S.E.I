function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.add('translate-x-full');
    sidebar.classList.remove('translate-x-0');
    overlay.classList.add('hidden');
  }
}

function logout() {
  if (confirm('Tem certeza que deseja sair do sistema?')) {
    window.location.href = 'login.html';
  }
}

function openDrawer() {
  const drawer = document.getElementById('descarteDrawer');
  if (drawer) drawer.classList.remove('translate-x-full');
}

function closeDrawer() {
  const drawer = document.getElementById('descarteDrawer');
  if (drawer) drawer.classList.add('translate-x-full');
}

function finalizarDescarte() {
  alert('Descarte finalizado com sucesso!');
  closeDrawer();
}
