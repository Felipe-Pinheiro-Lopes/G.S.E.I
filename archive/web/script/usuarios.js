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

function openUserModal(mode) {
  const modal = document.getElementById('userModal');
  const title = modal.querySelector('h3');
  const btn = modal.querySelector('button:last-of-type');
  const senhaLabel = document.getElementById('senhaLabel');
  if (mode === 'edit') {
    title.textContent = 'Editar Usuário';
    title.nextElementSibling.textContent = 'Atualize os dados do usuário';
    btn.textContent = 'Salvar Alterações';
    if (senhaLabel) senhaLabel.textContent = 'NOVA SENHA (deixe em branco para manter)';
  } else {
    title.textContent = 'Novo Usuário';
    title.nextElementSibling.textContent = 'Preencha os dados para cadastrar';
    btn.textContent = 'Cadastrar Usuário';
    if (senhaLabel) senhaLabel.textContent = 'SENHA *';
  }
  modal.classList.remove('hidden');
}

function closeUserModal() {
  document.getElementById('userModal').classList.add('hidden');
}

function saveUser() {
  closeUserModal();
  alert('Usuário salvo com sucesso! (mock)');
}

function deleteUser(id) {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    alert('Usuário excluído! (mock)');
  }
}
