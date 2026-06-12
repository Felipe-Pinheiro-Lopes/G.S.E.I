document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginBtn = document.getElementById('loginBtn');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const erroBox = document.getElementById('erroBox');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginBtn.disabled = true;
      loginBtn.textContent = 'PROCESSANDO...';

      setTimeout(() => {
        if (emailInput.value && senhaInput.value) {
          window.location.href = 'dashboard.html';
        } else {
          erroBox.textContent = 'Credenciais inválidas. Verifique e tente novamente.';
          erroBox.classList.remove('hidden');
          loginBtn.disabled = false;
          loginBtn.textContent = 'ENTRAR NO SISTEMA';
        }
      }, 1200);
    });
  }
});
