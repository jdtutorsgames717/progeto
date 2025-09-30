const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
    let connection;
    
    try {
        console.log('🔄 Iniciando configuração do banco de dados...');
        
        // Conectar ao MySQL sem especificar o banco
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306
        });
        
        console.log('✅ Conectado ao MySQL');
        
        // Criar o banco de dados se não existir
        const dbName = process.env.DB_NAME || 'hospedin_pms';
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Banco de dados '${dbName}' criado/verificado`);
        
        // Usar o banco de dados
        await connection.execute(`USE \`${dbName}\``);
        
        // Ler e executar o script SQL
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        // Dividir o SQL em comandos individuais
        const commands = schemaSql
            .split(';')
            .map(cmd => cmd.trim())
            .filter(cmd => cmd.length > 0 && !cmd.startsWith('USE') && !cmd.startsWith('CREATE DATABASE')); // Filtrar comandos USE e CREATE DATABASE
        
        console.log(`🔄 Executando ${commands.length} comandos SQL...`);
        
        for (const command of commands) {
            if (command.trim()) {
                try {
                    // Usar query() ao invés de execute() para evitar problemas com prepared statements
                    await connection.query(command);
                } catch (error) {
                    // Ignorar erros de tabelas que já existem
                    if (!error.message.includes('already exists')) {
                        console.warn(`⚠️  Aviso ao executar comando: ${error.message}`);
                    }
                }
            }
        }
        
        console.log('✅ Schema do banco de dados criado com sucesso!');
        
        // Verificar se o usuário admin já existe
        const [adminUsers] = await connection.execute(
            'SELECT id FROM usuarios WHERE email = ?',
            ['admin@hospedin.com']
        );
        
        if (adminUsers.length === 0) {
            console.log('🔄 Criando usuário administrador padrão...');
            
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await connection.execute(
                `INSERT INTO usuarios (nome, email, senha, tipo, ativo, created_at) 
                 VALUES (?, ?, ?, ?, ?, NOW())`,
                ['Administrador', 'admin@hospedin.com', hashedPassword, 'admin', 1]
            );
            
            console.log('✅ Usuário administrador criado:');
            console.log('   📧 Email: admin@hospedin.com');
            console.log('   🔑 Senha: admin123');
            console.log('   ⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
        } else {
            console.log('ℹ️  Usuário administrador já existe');
        }
        
        // Verificar se existe uma propriedade padrão
        const [properties] = await connection.execute('SELECT id FROM propriedades LIMIT 1');
        
        if (properties.length === 0) {
            console.log('🔄 Criando propriedade de exemplo...');
            
            await connection.execute(
                `INSERT INTO propriedades (nome, endereco, cidade, estado, cep, telefone, email, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
                [
                    'Hotel Exemplo',
                    'Rua das Flores, 123',
                    'São Paulo',
                    'SP',
                    '01234-567',
                    '(11) 1234-5678',
                    'contato@hotelexemplo.com'
                ]
            );
            
            console.log('✅ Propriedade de exemplo criada');
        }
        
        // Verificar canais de distribuição
        const [channels] = await connection.execute('SELECT id FROM canais_distribuicao LIMIT 1');
        
        if (channels.length === 0) {
            console.log('🔄 Criando canais de distribuição padrão...');
            
            const defaultChannels = [
                ['Direto', 'direto', 1, 0.00],
                ['Booking.com', 'booking', 1, 15.00],
                ['Airbnb', 'airbnb', 1, 12.00],
                ['Expedia', 'expedia', 1, 18.00]
            ];
            
            for (const [nome, codigo, ativo, comissao] of defaultChannels) {
                await connection.execute(
                    `INSERT INTO canais_distribuicao (nome, codigo, ativo, comissao_percentual, created_at) 
                     VALUES (?, ?, ?, ?, NOW())`,
                    [nome, codigo, ativo, comissao]
                );
            }
            
            console.log('✅ Canais de distribuição criados');
        }
        
        console.log('\n🎉 Banco de dados inicializado com sucesso!');
        console.log('\n📋 Próximos passos:');
        console.log('   1. Execute: npm start');
        console.log('   2. Acesse: http://localhost:3000');
        console.log('   3. Faça login com admin@hospedin.com / admin123');
        console.log('   4. Altere a senha padrão nas configurações');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar banco de dados:', error.message);
        console.error('\n🔧 Verifique:');
        console.error('   - Se o MySQL está rodando');
        console.error('   - Se as credenciais no .env estão corretas');
        console.error('   - Se o usuário tem permissões para criar bancos');
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    initializeDatabase();
}

module.exports = initializeDatabase;