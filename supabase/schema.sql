-- =============================================
-- Schema Supabase - Consórcios Contemplados
-- Execute no SQL Editor do painel Supabase
-- =============================================

-- Extensões necessárias
create extension if not exists "uuid-ossp";

-- =============================================
-- TABELA: profiles (estende auth.users)
-- =============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null,
  email text not null,
  role text not null default 'cliente' check (role in ('admin', 'vendedor', 'financeiro', 'cliente')),
  phone text,
  cpf text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger para criar profile automaticamente ao criar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'cliente')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- TABELA: fornecedores
-- =============================================
create table public.fornecedores (
  id uuid default uuid_generate_v4() primary key,
  nome text not null,
  cnpj text,
  contato text,
  email text,
  telefone text,
  administradora text,
  ativo boolean default true,
  created_at timestamptz default now()
);

-- =============================================
-- TABELA: cartas
-- =============================================
create table public.cartas (
  id uuid default uuid_generate_v4() primary key,
  credito numeric not null,
  entrada numeric not null,
  parcela numeric not null,
  prazo integer not null,
  administradora text not null,
  taxa_transferencia numeric default 0,
  segmento text not null check (segmento in ('imoveis', 'veiculos', 'servicos', 'pesados')),
  status text not null default 'disponivel' check (status in ('disponivel', 'reservada', 'vendida')),
  economia numeric,
  descricao text,
  fornecedor_id uuid references public.fornecedores(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- TABELA: clientes
-- =============================================
create table public.clientes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  nome text not null,
  email text not null,
  telefone text,
  cpf text,
  carta_id uuid references public.cartas(id) on delete set null,
  interesse text,
  status text not null default 'pendente_doc' check (status in ('pendente_doc', 'analise', 'aprovado', 'concluido')),
  observacoes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- TABELA: documentos
-- =============================================
create table public.documentos (
  id uuid default uuid_generate_v4() primary key,
  cliente_id uuid references public.clientes(id) on delete cascade not null,
  tipo text not null check (tipo in ('ficha_transferencia', 'doc_pessoal', 'comprovante_renda', 'comprovante_residencia', 'outro')),
  arquivo_url text not null,
  nome_arquivo text not null,
  tamanho integer,
  status text default 'pendente' check (status in ('pendente', 'aprovado', 'rejeitado')),
  created_at timestamptz default now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

alter table public.profiles enable row level security;
alter table public.cartas enable row level security;
alter table public.clientes enable row level security;
alter table public.documentos enable row level security;
alter table public.fornecedores enable row level security;

-- Helper: verifica role do usuário logado
create or replace function public.get_user_role()
returns text language sql security definer as $$
  select role from public.profiles where id = auth.uid();
$$;

-- PROFILES: usuário vê só o próprio perfil; admins veem todos
create policy "profiles: leitura própria" on public.profiles
  for select using (id = auth.uid());

create policy "profiles: admin vê todos" on public.profiles
  for select using (get_user_role() in ('admin', 'financeiro', 'vendedor'));

create policy "profiles: atualização própria" on public.profiles
  for update using (id = auth.uid());

create policy "profiles: admin gerencia" on public.profiles
  for all using (get_user_role() = 'admin');

-- CARTAS: público pode ler cartas disponíveis; staff gerencia
create policy "cartas: leitura pública" on public.cartas
  for select using (status = 'disponivel' or get_user_role() in ('admin', 'vendedor', 'financeiro'));

create policy "cartas: staff gerencia" on public.cartas
  for all using (get_user_role() in ('admin', 'vendedor', 'financeiro'));

-- FORNECEDORES: só staff
create policy "fornecedores: staff" on public.fornecedores
  for all using (get_user_role() in ('admin', 'vendedor', 'financeiro'));

-- CLIENTES: cliente vê só o próprio; staff vê todos
create policy "clientes: leitura própria" on public.clientes
  for select using (user_id = auth.uid());

create policy "clientes: atualização própria" on public.clientes
  for update using (user_id = auth.uid());

create policy "clientes: inserção própria" on public.clientes
  for insert with check (user_id = auth.uid());

create policy "clientes: staff" on public.clientes
  for all using (get_user_role() in ('admin', 'vendedor', 'financeiro'));

-- DOCUMENTOS: cliente vê só os próprios; staff vê todos
create policy "documentos: leitura própria" on public.documentos
  for select using (
    cliente_id in (select id from public.clientes where user_id = auth.uid())
  );

create policy "documentos: inserção própria" on public.documentos
  for insert with check (
    cliente_id in (select id from public.clientes where user_id = auth.uid())
  );

create policy "documentos: staff" on public.documentos
  for all using (get_user_role() in ('admin', 'vendedor', 'financeiro'));

-- =============================================
-- STORAGE: bucket para documentos
-- Execute no painel Storage > New Bucket
-- Nome: "documentos", Private: true
-- =============================================

-- Políticas de storage (execute após criar o bucket)
insert into storage.buckets (id, name, public) values ('documentos', 'documentos', false);

create policy "storage: cliente faz upload" on storage.objects
  for insert with check (
    bucket_id = 'documentos' and auth.uid() is not null
  );

create policy "storage: leitura própria" on storage.objects
  for select using (
    bucket_id = 'documentos' and (
      auth.uid()::text = (storage.foldername(name))[1]
      or get_user_role() in ('admin', 'vendedor', 'financeiro')
    )
  );

create policy "storage: staff gerencia" on storage.objects
  for all using (
    bucket_id = 'documentos' and get_user_role() in ('admin', 'financeiro')
  );

-- =============================================
-- DADOS INICIAIS: admin padrão
-- Crie o usuário pelo painel Auth > Add User
-- depois execute para definir como admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@seudominio.com';
-- =============================================
