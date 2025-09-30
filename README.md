# Sistema de Gestão para Pousadas e Hotéis - Hospedin PMS

Sistema completo de gestão hoteleira inspirado no Hospedin, desenvolvido com Node.js, Express e MySQL.

## 🚀 Funcionalidades

- **Dashboard Completo**: Visão geral com estatísticas, gráficos e métricas importantes
- **Gestão de Reservas**: Criação, edição, cancelamento e controle de reservas
- **Channel Manager**: Integração com canais de distribuição (Booking.com, Airbnb, etc.)
- **PMS (Property Management System)**: Gestão de propriedades, quartos e hóspedes
- **Sistema de Autenticação**: Login seguro com JWT
- **Relatórios**: Ocupação, receita e performance
- **Interface Responsiva**: Design moderno e adaptável

## 📋 Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **MySQL** (versão 8.0 ou superior)
- **npm** ou **yarn**

### Instalação do Node.js no Windows

1. Acesse [nodejs.org](https://nodejs.org/)
2. Baixe a versão LTS mais recente
3. Execute o instalador e siga as instruções
4. Reinicie o terminal/PowerShell após a instalação

## 🛠️ Instalação e Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados

1. **Criar o banco de dados MySQL:**
```sql
CREATE DATABASE hospedin_pms;
```

2. **Executar o script de criação das tabelas:**
```bash
mysql -u seu_usuario -p hospedin_pms < database/schema.sql
```

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Banco de Dados
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=hospedin_pms
DB_PORT=3306

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRES_IN=24h

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app

# Aplicação
APP_NAME=Hospedin PMS
APP_URL=http://localhost:3000

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Sessão
SESSION_SECRET=sua_chave_de_sessao_secreta
```

### 4. Executar o Sistema

**Modo de desenvolvimento:**
```bash
npm run dev
```

**Modo de produção:**
```bash
npm start
```

O sistema estará disponível em: `http://localhost:3000`

## 👤 Acesso Inicial

**Usuário Administrador Padrão:**
- **Email:** admin@hospedin.com
- **Senha:** admin123

⚠️ **Importante:** Altere a senha padrão após o primeiro login!

## 📁 Estrutura do Projeto

```
├── config/
│   └── database.js          # Configuração do banco de dados
├── database/
│   └── schema.sql           # Script de criação das tabelas
├── public/
│   ├── login.html           # Página de login
│   ├── dashboard.html       # Dashboard principal
│   └── reservas.html        # Gestão de reservas
├── routes/
│   ├── auth.js              # Rotas de autenticação
│   ├── dashboard.js         # Rotas do dashboard
│   ├── reservas.js          # Rotas de reservas
│   ├── channel.js           # Rotas do channel manager
│   └── pms.js               # Rotas do PMS
├── .env                     # Variáveis de ambiente
├── package.json             # Dependências do projeto
├── server.js                # Servidor principal
└── README.md                # Este arquivo
```

## 🔧 Principais Rotas da API

### Autenticação
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/logout` - Logout do usuário
- `GET /api/auth/verify` - Verificar token

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas gerais
- `GET /api/dashboard/ocupacao` - Dados de ocupação
- `GET /api/dashboard/receita` - Dados de receita

### Reservas
- `GET /api/reservas` - Listar reservas
- `POST /api/reservas` - Criar nova reserva
- `GET /api/reservas/:id` - Obter reserva específica
- `PUT /api/reservas/:id` - Atualizar reserva
- `DELETE /api/reservas/:id` - Cancelar reserva

### Channel Manager
- `GET /api/channel/canais` - Listar canais
- `GET /api/channel/inventario` - Obter inventário
- `PUT /api/channel/inventario` - Atualizar inventário

### PMS
- `GET /api/pms/propriedades` - Listar propriedades
- `GET /api/pms/tipos-quarto` - Listar tipos de quarto
- `GET /api/pms/quartos` - Listar quartos
- `GET /api/pms/hospedes` - Listar hóspedes

## 🎨 Tecnologias Utilizadas

- **Backend:** Node.js, Express.js
- **Banco de Dados:** MySQL
- **Autenticação:** JWT (JSON Web Tokens)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Gráficos:** Chart.js
- **Ícones:** Font Awesome
- **Criptografia:** bcryptjs

## 🔒 Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Validação de dados de entrada
- Proteção contra SQL Injection
- CORS configurado
- Sessões seguras

## 📊 Funcionalidades Detalhadas

### Dashboard
- Estatísticas em tempo real
- Gráficos de ocupação
- Próximas chegadas e saídas
- Métricas de receita
- Taxa de ocupação

### Gestão de Reservas
- Criação de reservas com validação
- Edição de reservas existentes
- Cancelamento de reservas
- Filtros avançados
- Paginação
- Status de reservas (Pendente, Confirmada, Check-in, Check-out)

### Channel Manager
- Gestão de canais de distribuição
- Sincronização de inventário
- Relatórios de performance por canal
- Atualização em lote

### PMS
- Gestão de propriedades
- Tipos de quarto e tarifas
- Controle de quartos
- Histórico de hóspedes
- Relatórios operacionais

## 🚀 Deploy em Produção

### Configurações Recomendadas

1. **Usar HTTPS**
2. **Configurar proxy reverso (Nginx)**
3. **Usar PM2 para gerenciamento de processos**
4. **Configurar backup automático do banco**
5. **Monitoramento de logs**

### Exemplo com PM2

```bash
npm install -g pm2
pm2 start server.js --name "hospedin-pms"
pm2 startup
pm2 save
```

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:

- Abra uma issue no GitHub
- Entre em contato através do email: suporte@hospedin.com

## 🔄 Atualizações

### Versão 1.0.0
- Sistema básico de gestão hoteleira
- Dashboard com estatísticas
- Gestão completa de reservas
- Channel Manager básico
- Sistema PMS
- Autenticação segura

---

**Desenvolvido com ❤️ para a indústria hoteleira**