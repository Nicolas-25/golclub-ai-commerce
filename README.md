# GolClub AI Commerce 🏆⚽

Plataforma de e-commerce conversacional para camisas de futebol, com IA integrada.

## 🚀 Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq (Llama 3.3 70B)
- **Animations**: Framer Motion

## 📦 Features

- ✅ Chat com IA vendedora
- ✅ Captura automática de leads
- ✅ Catálogo de produtos
- ✅ Admin Dashboard
- ✅ CRUD de produtos
- ✅ CRM de leads com WhatsApp

## 🛠️ Instalação Local

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/golclub-ai-commerce.git
cd golclub-ai-commerce

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Rode o projeto
npm run dev
```

Acesse: http://localhost:3000

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
GROQ_API_KEY=sua_groq_api_key
```

## 🌐 Deploy na Vercel

1. Fork/Push este repositório para o GitHub
2. Acesse [vercel.com](https://vercel.com) e importe o projeto
3. Configure as variáveis de ambiente no painel da Vercel
4. Deploy automático!

## 📁 Estrutura

```
src/
├── app/
│   ├── page.tsx          # Chat principal
│   ├── admin/            # Dashboard admin
│   └── api/              # API routes
├── components/
│   ├── chat/             # Componentes de chat
│   ├── admin/            # Componentes admin
│   └── ui/               # UI components
├── lib/
│   └── supabase/         # Cliente Supabase
└── types/
    └── database.ts       # Tipos TypeScript
```

## 📝 Licença

Projeto privado - GolClub © 2024
