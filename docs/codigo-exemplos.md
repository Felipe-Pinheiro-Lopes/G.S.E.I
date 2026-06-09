# Exemplos de Código Comentados - Lógica e Estrutura do G.S.E.I

Este documento atende aos critérios da disciplina de **Linguagem de Programação (Prof. Cainã)**, exemplificando de forma didática as estruturas fundamentais de desenvolvimento aplicadas no sistema **G.S.E.I**.

---

## 1. Estruturas Condicionais (Tomada de Decisão)

As estruturas condicionais são utilizadas para direcionar o fluxo de execução com base em diferentes entradas. No G.S.E.I, um exemplo claro é a definição do destino de um equipamento durante a triagem.

### Exemplo (C# Backend - `TriagemController.cs`)
```csharp
// O trecho abaixo utiliza a estrutura 'switch' para decidir qual será o próximo
// status do equipamento a partir do destino escolhido pelo técnico de triagem.
string novoStatus = dto.Destino switch
{
    "Reuso" => "EmEstoque",              // Caso seja aprovado para reuso imediato
    "Doacao" => "AguardandoDoacao",      // Caso seja destinado para doação
    "Descarte" => "AguardandoDescarte",  // Caso seja destinado para descarte ecológico
    _ => "EmTriagem"                     // Caso padrão/fallback de segurança
};
```

### Exemplo (TypeScript Frontend - `DescarteTable.tsx`)
```typescript
// Estrutura condicional 'if' simples para mapear a cor visual do status do equipamento
const getStatusClass = (status: string) => {
  if (status === 'Descartado') {
    return 'bg-green-100 text-green-700'; // Cor verde para sucesso
  }
  if (status === 'Aguardando') {
    return 'bg-orange-100 text-orange-700'; // Cor laranja para aviso/pendência
  }
  return 'bg-gray-100 text-gray-700'; // Fallback neutro
};
```

---

## 2. Estruturas de Repetição (Loops e Iterações)

Estruturas de repetição nos permitem processar coleções de dados de forma consecutiva e limpa. Elas são amplamente utilizadas para renderizar tabelas e processar lotes no banco de dados.

### Exemplo (C# Backend - `SolicitacoesController.cs`)
```csharp
// Iteração 'foreach' iterando sobre a lista de IDs de equipamentos vinculados
// à solicitação para inseri-los um a um na tabela associativa do banco de dados.
foreach (var eqId in dto.EquipamentoIds)
{
    db.ItensSolicitacao.Add(new ItemSolicitacao
    {
        SolicitacaoId = solicitacao.Id,
        EquipamentoId = eqId,
        QuantidadeSolicitada = 1
    });
}
```

### Exemplo (React / TypeScript Frontend - `DescarteTable.tsx`)
```tsx
// O método '.map' do JavaScript funciona como um loop para transformar a lista
// de itens do descarte em linhas HTML correspondentes de uma tabela.
{filtered.map((item, idx) => (
  <tr key={idx} className="hover:bg-blue-50/50 transition-colors group">
    <td className="px-6 py-4 font-bold text-gray-800">{item.descricao}</td>
    <td className="px-6 py-4 text-gray-500 font-medium">{item.codigo}</td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getStatusClass(item.status)}`}>
        {item.status}
      </span>
    </td>
  </tr>
))}
```

---

## 3. Modularização (Divisão de Responsabilidades)

A modularização consiste em quebrar o software em partes menores, reutilizáveis e com responsabilidade única. Isso facilita a manutenção e testes da aplicação.

### Exemplo de Serviço Isolado (C# Backend - `TokenService.cs`)
```csharp
// Classe especializada e isolada apenas para criar tokens JWT, 
// encapsulando os detalhes de criptografia e claims da aplicação.
public class TokenService(IConfiguration configuration)
{
    public string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var secretKey = configuration["Jwt:Key"];
        // ... Lógica de geração do token encapsulada
        return tokenHandler.WriteToken(token);
    }
}
```

### Exemplo de Componente Visual Reutilizável (React - `Button.tsx`)
```tsx
// Componente de botão modular que aceita diferentes variantes estéticas
// (primary, secondary, danger) e tamanhos, podendo ser importado e reusado
// em qualquer tela do sistema (Login, Triagem, Descarte, etc.).
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-bold rounded-xl transition-all';
  // ... lógica e estilos configurados internamente
  return (
    <button onClick={onClick} className={`${base} ...`}>
      {children}
    </button>
  );
}
```
