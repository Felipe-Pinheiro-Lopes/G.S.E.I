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

function toggleEditMode(editing) {
  const viewNome = document.getElementById('viewNome');
  const btnEditar = document.getElementById('btnEditar');
  const editActions = document.getElementById('editActions');
  const fields = ['fieldNome', 'fieldCnpj', 'fieldResp', 'fieldTel', 'fieldEmail'];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (editing) {
      el.disabled = false;
      el.classList.remove('border-transparent', 'bg-gray-50', 'cursor-default');
      el.classList.add('border-gray-300', 'bg-white', 'text-[#0a0a0a]', 'focus:ring-2', 'focus:ring-[#0d631b]', 'focus:outline-none');
    } else {
      el.disabled = true;
      el.classList.add('border-transparent', 'bg-gray-50', 'cursor-default');
      el.classList.remove('border-gray-300', 'bg-white', 'text-[#0a0a0a]', 'focus:ring-2', 'focus:ring-[#0d631b]', 'focus:outline-none');
    }
  });

  if (editActions) editActions.classList.toggle('hidden', !editing);
  if (btnEditar) btnEditar.classList.toggle('hidden', editing);
  if (editing) {
    const nomeField = document.getElementById('fieldNome');
    if (nomeField && viewNome) viewNome.textContent = nomeField.value;
  }
}

function saveInstituicao() {
  const nomeField = document.getElementById('fieldNome');
  const viewNome = document.getElementById('viewNome');
  if (nomeField && viewNome) {
    viewNome.textContent = nomeField.value;
  }
  toggleEditMode(false);
  alert('Dados atualizados com sucesso!');
}
