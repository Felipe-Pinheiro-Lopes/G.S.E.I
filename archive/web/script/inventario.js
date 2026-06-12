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

function openNovoModal() {
  document.getElementById('novoModal').classList.remove('hidden');
}

function closeNovoModal() {
  document.getElementById('novoModal').classList.add('hidden');
}

function salvarNovoEquipamento() {
  const modelo = document.getElementById('novoModelo').value;
  if (!modelo.trim()) {
    alert('Modelo é obrigatório.');
    return;
  }
  alert('Equipamento cadastrado com sucesso!');
  closeNovoModal();
}
