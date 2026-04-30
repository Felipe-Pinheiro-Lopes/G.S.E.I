# Tutorial Simples: Converter dashboard-2.html para React com Tailwind

## O que Você Precisa Saber (Leitura Rápida)
- **React**: Biblioteca para criar páginas web. Usamos JSX (HTML dentro de JS). É como escrever HTML, mas com regras especiais.
- **Tailwind**: Estilos prontos. Em vez de escrever CSS, use classes como `className="bg-blue-500 text-white"` para fundo azul e texto branco.
- Diferenças principais: `class` vira `className`, `style="..."` vira `style={{ ... }}`.

## Passo 1: Crie o Arquivo Dashboard.tsx
// Esse é o arquivo do componente React. Pense nele como uma "peça" da página.
// Você vai colar o HTML convertido aqui.

Na pasta `front-end/components`, crie `Dashboard.tsx`:

```tsx
// Importa React para usar JSX
import React from 'react';

// Cria o componente Dashboard (uma função que retorna HTML)
const Dashboard: React.FC = () => {
  return (
    // Esse <div> é o container principal. Aqui você vai colar todo o JSX convertido do HTML
    <div>
      {/* Aqui você vai colar o JSX convertido do dashboard-2.html.
          Por exemplo, depois de converter, ficará algo como:
          <aside className="..."> ... </aside>
          <header className="..."> ... </header>
          etc.
      */}
    </div>
  );
};

// Exporta o componente para usar em outros arquivos
export default Dashboard;
```

// Explicação: O comentário dentro do código mostra onde colar o JSX. O JSX é o HTML convertido para React.

## Passo 2: Copie e Converta o HTML
// Abra o arquivo stitch-screens/dashboard-2.html no editor.
// Copie apenas o conteúdo do <body> (da linha 90 à 411, ignorando <head>).
// Agora, faça essas mudanças para transformar em JSX (React):

1. Troque `<body class="...">` por `<div className="...">`. // Porque React não usa <body> aqui.
2. Troque todos `class=` por `className=`. // Palavra reservada no JS.
3. Troque `style="font-variation-settings: 'FILL' 1;"` por `style={{ fontVariationSettings: "'FILL' 1" }}`. // Objeto JS.
4. Ignore `<script>` e `<link>` por enquanto. // Vamos adicionar estilos depois.

// Exemplo prático:
// Do HTML original:
```html
<body class="bg-surface text-on-surface">
  <div class="p-8">
    <h1 class="text-2xl">Título</h1>
  </div>
</body>
```

// Converte para JSX:
```tsx
<div className="bg-surface text-on-surface">
  <div className="p-8">
    <h1 className="text-2xl">Título</h1>
  </div>
</div>
```

// Agora, cole TODO esse JSX convertido dentro do <div> do Passo 1, substituindo o comentário.

## Passo 3: Adicione Estilos Customizados
// O HTML original tem estilos especiais para ícones e fontes. Adicione isso no topo do componente.

No arquivo `Dashboard.tsx`, logo após o `import`, adicione:

```tsx
// Estilos customizados para ícones Material Symbols e fontes
<style dangerouslySetInnerHTML={{
  __html: `
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      vertical-align: middle;
    }
    body { font-family: 'Inter', sans-serif; }
    h1, h2, h3, .brand-font { font-family: 'Manrope', sans-serif; }
  `
}} />

// Agora, o componente completo fica assim:
import React from 'react';

// Estilos aqui

const Dashboard: React.FC = () => {
  return (
    <div>
      {/* Cole o JSX convertido aqui */}
    </div>
  );
};

export default Dashboard;
```

## Passo 4: Use na Página
// Agora, conecte o componente à página principal do Next.js.

Edite `front-end/pages/index.tsx`:

```tsx
// Importa o componente Dashboard que você criou
import Dashboard from '../components/Dashboard';

// Função da página Home, que usa o Dashboard
export default function Home() {
  return (
    // Renderiza o Dashboard na página
    <Dashboard />
  );
}
```

// Isso faz com que o dashboard apareça quando você acessar a página.

## Passo 5: Teste
// Verifique se tudo funciona.

Execute `npm run dev` na pasta `front-end`. // Abre o servidor local.
// Visite http://localhost:3000 no navegador.
// Deve aparecer o dashboard convertido.

Se houver erros (ex: "className não reconhecido"), copie a mensagem de erro aqui para ajudar.

## Dicas Rápidas
- **Tailwind**: `bg-` = fundo, `text-` = texto, `p-` = padding (espaço interno), `flex` = layout em linha, `grid` = layout em grade.
- **Imagens**: Use `src="..."` direto (como no HTML).
- **Links**: Use `href="..."` ou importe `Link` do Next.js para navegação interna.
- **Se travar**: Faça um passo de cada vez. Primeiro crie o arquivo vazio, depois converta uma parte pequena do HTML.

## Passo 6: Use o Componente na Página

### Edite a página principal
- Vá para `front-end/pages/index.tsx` (ou `app/page.tsx` no App Router).
- Importe o Dashboard:

```tsx
import Dashboard from '../components/Dashboard';

export default function Home() {
  return <Dashboard />;
}
```

## Passo 8: Aprimore o Componente com Tailwind

### Adicione Responsividade e Interatividade
Para tornar o dashboard mais avançado, adicione responsividade completa e efeitos visuais com Tailwind.

#### Exemplo: Toggle para Dark Mode
Adicione um botão no header para alternar entre temas claro e escuro.

```tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
          }
          body { font-family: 'Inter', sans-serif; }
          h1, h2, h3, .brand-font { font-family: 'Manrope', sans-serif; }
        `
      }} />
      <div className={`bg-surface text-on-surface selection:bg-secondary-fixed ${isDark ? 'dark' : ''}`}>
        {/* Header com botão de tema */}
        <header className="sticky top-0 z-40 w-full ml-72 bg-[#f3faff]/80 dark:bg-slate-950/80 backdrop-blur-md flex justify-between items-center px-8 py-4 border-none bg-transparent max-w-[calc(100%-18rem)]">
          {/* ... resto do header ... */}
          <button onClick={toggleTheme} className="w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </header>
        {/* ... resto do componente ... */}
      </div>
    </>
  );
};
```

- Use `useState` para gerenciar o estado do tema.
- Adicione classes `dark:` do Tailwind para estilos alternativos.

#### Melhore Responsividade
- Adicione mais breakpoints: `sm:`, `lg:`, `xl:`.
- Exemplo: Para a sidebar, use `lg:w-72` para largura em telas grandes.

#### Adicione Animações com Tailwind
- Use classes como `transition-all`, `hover:scale-105`, `animate-pulse` para efeitos.

## Passo 9: Teste e Ajustes

### Execute o projeto
- No terminal, na pasta `front-end`: `npm run dev`.
- Visite `http://localhost:3000` e veja se o dashboard aparece.

### Problemas comuns
- **Classes não aplicadas**: Verifique se Tailwind está configurado.
- **Fontes não carregam**: Adicione os links de fonte no `_app.tsx` ou layout.
- **Imagens**: Use `next/image` para otimização.

### Próximos passos
- Adicione interatividade: Use `useState` para gerenciar estado.
- Quebre em sub-componentes: Crie `Sidebar.tsx`, `Header.tsx`, etc.
- Conecte a uma API: Busque dados reais em vez de estáticos.

Este guia cobre o básico. Pratique copiando seções pequenas primeiro!</content>
<parameter name="filePath">C:\Users\Aluno\Desktop\Projeto Lakrador\G.S.E.I\tutorial-transformacao-dashboard.md