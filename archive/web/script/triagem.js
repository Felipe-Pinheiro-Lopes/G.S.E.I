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

function switchTab(tab) {
  ['fila', 'andamento', 'finalizados'].forEach(t => {
    const btn = document.getElementById('tab-' + t);
    const form = document.getElementById('form' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) {
      if (t === tab) {
        btn.classList.add('bg-white', 'text-primary', 'shadow-sm');
        btn.classList.remove('text-gray-500');
      } else {
        btn.classList.remove('bg-white', 'text-primary', 'shadow-sm');
        btn.classList.add('text-gray-500');
      }
    }
    if (form) form.classList.add('hidden');
  });

  const activeForm = document.getElementById('form' + tab.charAt(0).toUpperCase() + tab.slice(1));
  if (activeForm) activeForm.classList.remove('hidden');

  const titles = { fila: 'Equipamentos na Fila', andamento: 'Triagens em Andamento', finalizados: 'Triagens Finalizadas' };
  const listTitle = document.getElementById('listTitle');
  if (listTitle) listTitle.textContent = titles[tab] || 'Equipamentos';
}

function closeFormTriagem() {
  const forms = document.querySelectorAll('[id^="form"]');
  forms.forEach(f => f.classList.add('hidden'));
}

function toggleCheck(label) {
  const cb = label.querySelector('input[type="checkbox"]');
  if (cb) cb.checked = !cb.checked;
}

function selectDestino(value, el) {
  document.querySelectorAll('[name="destino"]').forEach(r => r.checked = false);
  const radio = el.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
}

function voltarParaFila() {
  closeFormTriagem();
  switchTab('fila');
}

function enviarParaAndamento() {
  alert('Equipamento enviado para Em Andamento!');
  closeFormTriagem();
  switchTab('andamento');
}

function finalizarTriagem() {
  alert('Triagem finalizada com sucesso! Histórico registrado.');
  closeFormTriagem();
  switchTab('finalizados');
}

function selecionarEquip(el) {
  document.querySelectorAll('#equipList > div').forEach((d, idx) => {
    d.classList.remove('border-primary', 'bg-primary/5', 'shadow-md');
    d.classList.add('border-gray-100');
    const existing = d.querySelector('.selecionado-badge');
    if (existing) existing.remove();
  });

  el.classList.add('border-primary', 'bg-primary/5', 'shadow-md');
  el.classList.remove('border-gray-100');

  const title = document.createElement('span');
  title.className = 'selecionado-badge px-3 py-1 text-xs font-bold bg-primary text-white rounded-full';
  title.textContent = 'Selecionado';

  const flexContainer = el.querySelector('.flex.justify-between');
  if (flexContainer) {
    flexContainer.appendChild(title);
  }
}

function toggleCheck(label) {
  const cb = label.querySelector('input[type="checkbox"]');
  if (cb) cb.checked = !cb.checked;
}

function selectDestino(value, el) {
  const radios = el.closest('.grid').querySelectorAll('input[type="radio"]');
  radios.forEach(r => r.checked = false);
  const radio = el.querySelector('input[type="radio"]');
  if (radio) radio.checked = true;
}

