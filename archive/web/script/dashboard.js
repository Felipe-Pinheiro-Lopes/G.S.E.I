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

function openSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.remove('-translate-x-full', 'translate-x-full');
    sidebar.classList.add('translate-x-0');
    overlay.classList.remove('hidden');
  }
}

function logout() {
  if (confirm('Tem certeza que deseja sair do sistema?')) {
    window.location.href = 'login.html';
  }
}

function navigateTo(page) {
  window.location.href = page;
}

function openLogModal() {
  const modal = document.getElementById('logModal');
  if (modal) modal.classList.remove('hidden');
}

function closeLogModal() {
  const modal = document.getElementById('logModal');
  if (modal) modal.classList.add('hidden');
}
