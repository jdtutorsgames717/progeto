const mysql = require('mysql2/promise');
require('dotenv').config();

async function createMySQLUser() {
    console.log('🔄 Tentando criar um novo usuário MySQL...');
    
    // Vamos tentar usar o MySQL Workbench ou outro cliente para criar um usuário
    // Por enquanto, vamos criar um script SQL que pode ser executado manualmente
    
    const sqlScript = `
-- Script para criar usuário e banco de dados
-- Execute este script no MySQL Workbench ou outro cliente MySQL

-- Criar usuário (se não existir)
CREATE USER IF NOT EXISTS 'hospedin_user'@'localhost' IDENTIFIED BY 'hospedin123';

-- Criar banco de dados (se não existir)
CREATE DATABASE IF NOT EXISTS hospedin_pms;

-- Conceder todas as permissões ao usuário no banco
GRANT ALL PRIVILEGES ON hospedin_pms.* TO 'hospedin_user'@'localhost';

-- Aplicar as mudanças
FLUSH PRIVILEGES;

-- Verificar se o usuário foi criado
SELECT User, Host FROM mysql.user WHERE User = 'hospedin_user';

-- Verificar se o banco foi criado
SHOW DATABASES LIKE 'hospedin_pms';
`;

    // Salvar o script em um arquivo
    const fs = require('fs');
    const path = require('path');
    
    const scriptPath = path.join(__dirname, 'setup-database.sql');
    fs.writeFileSync(scriptPath, sqlScript);
    
    console.log('✅ Script SQL criado em: setup-database.sql');
    console.log('');
    console.log('📋 Para configurar o MySQL manualmente:');
    console.log('   1. Abra o MySQL Workbench ou outro cliente MySQL');
    console.log('   2. Conecte como administrador (usuário com privilégios)');
    console.log('   3. Execute o arquivo setup-database.sql');
    console.log('   4. Ou execute os comandos SQL diretamente:');
    console.log('');
    console.log(sqlScript);
    console.log('');
    console.log('📋 Após executar o script, atualize o arquivo .env com:');
    console.log('   DB_USER=hospedin_user');
    console.log('   DB_PASSWORD=hospedin123');
    console.log('   DB_NAME=hospedin_pms');
    
    // Tentar atualizar o .env automaticamente
    try {
        const envPath = '.env';
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Atualizar as credenciais no .env
        envContent = envContent.replace(/DB_USER=.*/, 'DB_USER=hospedin_user');
        envContent = envContent.replace(/DB_PASSWORD=.*/, 'DB_PASSWORD=hospedin123');
        envContent = envContent.replace(/DB_NAME=.*/, 'DB_NAME=hospedin_pms');
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Arquivo .env atualizado com as novas credenciais');
        
    } catch (error) {
        console.log('⚠️  Não foi possível atualizar o .env automaticamente:', error.message);
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    createMySQLUser();
}

module.exports = createMySQLUser;