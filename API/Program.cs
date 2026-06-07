using System.Text;
using System.Text.Json;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuração do Banco
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Configuração do JWT
var secretKey = builder.Configuration["Jwt:Key"] ?? "remember_remember_the_fifteenth_of_november";
var key = Encoding.ASCII.GetBytes(secretKey);
builder.Services.AddAuthentication(x => {
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x => {
    x.RequireHttpsMetadata = false; // Facilitar teste local
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});

// Registrar TokenService
builder.Services.AddScoped<API.Services.TokenService>();

// 3. Configuração do CORS (Ajustada para ser mais flexível no desenvolvimento)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs", policy => 
    {
        policy.WithOrigins("http://localhost:3000") // Certifique-se que o Next está nesta porta
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials(); // Permitir cookies/auth headers se necessário
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header usando o esquema Bearer. Exemplo: \"Bearer {token}\""
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new string[] {}
        }
    });
});

var app = builder.Build(); 

// Seed de dados de exemplo para desenvolvimento
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<API.Data.AppDbContext>();

    if (!db.Equipamentos.Any())
    {
        var utcDate = (DateTime date) => DateTime.SpecifyKind(date, DateTimeKind.Utc);

        db.Equipamentos.AddRange(
            new API.Models.Equipamento(1, "EQ-1001", "Notebook Dell G15", "Intel i5 10ª, 16GB RAM, 512GB SSD", "Lote-2025-03", "EmEstoque", utcDate(new DateTime(2025, 3, 10)), null, "Notebook"),
            new API.Models.Equipamento(2, "EQ-1002", "Monitor LG 24\"", "Full HD IPS, 75Hz", "Lote-2025-03", "EmTriagem", utcDate(new DateTime(2025, 3, 12)), null, "Monitor"),
            new API.Models.Equipamento(3, "EQ-1003", "Desktop HP ProDesk", "i7 9ª, 32GB RAM, 1TB SSD", "Lote-2025-02", "EmEstoque", utcDate(new DateTime(2025, 2, 20)), null, "Computador"),
            new API.Models.Equipamento(4, "EQ-1004", "Notebook Lenovo ThinkPad", "i5 11ª, 8GB RAM, 256GB SSD", "Lote-2025-03", "DoacaoAprovada", utcDate(new DateTime(2025, 3, 15)), null, "Notebook"),
            new API.Models.Equipamento(5, "EQ-1005", "Impressora Brother", "Laser Mono, Duplex", "Lote-2025-01", "EmTriagem", utcDate(new DateTime(2025, 1, 30)), null, "Periférico"),
            new API.Models.Equipamento(6, "EQ-1006", "Placa de Vídeo NVIDIA", "RTX 3060 12GB", "Lote-2025-04", "EmEstoque", utcDate(new DateTime(2025, 4, 5)), null, "Peças"),
            new API.Models.Equipamento(7, "EQ-1007", "Notebook Acer Aspire", "Ryzen 5, 16GB RAM, 512GB", "Lote-2025-03", "EmEstoque", utcDate(new DateTime(2025, 3, 22)), null, "Notebook"),
            new API.Models.Equipamento(8, "EQ-1008", "Monitor Samsung 27\"", "QHD, 144Hz", "Lote-2025-02", "Descartado", utcDate(new DateTime(2025, 2, 10)), null, "Monitor"),
            new API.Models.Equipamento(9, "EQ-1009", "Teclado Mecânico Logitech", "RGB, Switch Brown", "Lote-2025-04", "EmEstoque", utcDate(new DateTime(2025, 4, 8)), null, "Periférico"),
            new API.Models.Equipamento(10, "EQ-1010", "Desktop Dell OptiPlex", "i5 12ª, 16GB RAM, 512GB", "Lote-2025-03", "EmTriagem", utcDate(new DateTime(2025, 3, 28)), null, "Computador")
        );

        db.SaveChanges();
        Console.WriteLine(">>> 10 equipamentos de exemplo foram inseridos no banco de dados.");
    }

    // Seed para tela de Doações (instituições + solicitações com dados reais)
    if (!db.Instituicoes.Any())
    {
        var utcDate = (DateTime date) => DateTime.SpecifyKind(date, DateTimeKind.Utc);

        db.Instituicoes.AddRange(
            new API.Models.Instituicao(1, "Escola Municipal Nova Era", "12.345.678/0001-90", "Marta Silva", "(15) 3222-8899", "contato@novaera.edu.br", utcDate(new DateTime(2025, 1, 10))),
            new API.Models.Instituicao(2, "ONG Tech Future", "98.765.432/0001-10", "Carlos Mendes", "(11) 98765-4321", "contato@techfuture.org", utcDate(new DateTime(2025, 2, 5))),
            new API.Models.Instituicao(3, "Associação Esperança", "45.123.987/0001-55", "Ana Paula", "(21) 3344-5566", "contato@esperanca.org", utcDate(new DateTime(2025, 3, 12)))
        );
        db.SaveChanges();
        Console.WriteLine(">>> 3 instituições de exemplo foram inseridas.");

        // Solicitações (usam os Ids acima + Prioridade)
        db.Solicitacoes.AddRange(
            new API.Models.Solicitacao(1, 1, "Diretora Marta Silva", "(15) 3222-8899", "Montar laboratório de informática para 120 crianças", "Pendente", utcDate(new DateTime(2025, 5, 10)), "SOL-20250510-8892", "Alta"),
            new API.Models.Solicitacao(2, 2, "Carlos Mendes", "(11) 98765-4321", "Equipar sala de aula com desktops", "Aprovada", utcDate(new DateTime(2025, 5, 8)), "SOL-20250508-7741", "Média"),
            new API.Models.Solicitacao(3, 3, "Ana Paula", "(21) 3344-5566", "Notebooks para projeto social", "Em Análise", utcDate(new DateTime(2025, 5, 11)), "SOL-20250511-9910", "Baixa")
        );
        db.SaveChanges();
        Console.WriteLine(">>> 3 solicitações de doação de exemplo foram inseridas.");
    }

    // Seed para tela de Descarte (Triagens com Destino=Descarte + equipamentos já descartados)
    if (!db.Triagens.Any(t => t.Destino == "Descarte"))
    {
        var utcDate = (DateTime date) => DateTime.SpecifyKind(date, DateTimeKind.Utc);

        // Alguns equipamentos já marcados como Descartado no seed anterior
        // Cria triagens de descarte para eles
        db.Triagens.AddRange(
            new API.Models.Triagem(1, 8, "[]", "Equipamento obsoleto e danificado além do reparo", "Descarte", utcDate(new DateTime(2025, 4, 10)), "Técnico Carlos"),
            new API.Models.Triagem(2, 5, "[]", "Periférico com defeito irreparável", "Descarte", utcDate(new DateTime(2025, 3, 15)), "Técnico Ana")
        );
        db.SaveChanges();
        Console.WriteLine(">>> Registros de descarte (Triagem Destino=Descarte) adicionados.");
    }

    // Seed adicional de triagens com laudos variados para popular Pareto de Defeitos e histórico real no Dashboard
    if (db.Triagens.Count() < 6)
    {
    }

    if (!db.Users.Any())
    {
        var senhaHash = HashPassword("admin123");
        db.Users.AddRange(
            new API.Models.User
            {
                Nome = "Admin",
                Email = "admin@gsei.gov.br",
                SenhaHash = senhaHash,
                Role = "Internal"
            }
        );
        db.SaveChanges();
        Console.WriteLine(">>> Usuário admin seed criado (admin@gsei.gov.br / admin123).");
    }
}

static string HashPassword(string senha)
{
    return BCrypt.Net.BCrypt.HashPassword(senha);
}

// --- 4. ORDEM DOS MIDDLEWARES (CRUCIAL) ---

if (app.Environment.IsDevelopment()) {
    app.UseSwagger();
    app.UseSwaggerUI();
}

// O CORS deve vir ANTES de Authentication e Authorization
app.UseCors("AllowNextJs"); 

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();