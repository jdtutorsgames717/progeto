const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupMySQL() {
    console.log('🔄 Configurando MySQL...');
    
    // Tentar diferentes combinações de credenciais
    const credentials = [
        { user: 'root', password: '' },
        { user: 'root', password: 'root' },
        { user: 'root', password: 'password' },
        { user: 'root', password: '123456' },
        { user: 'root', password: 'admin' }
    ];
    
    let connection = null;
    let workingCredentials = null;
    
    for (const cred of credentials) {
        try {
            console.log(`🔄 Tentando conectar com usuário: ${cred.user}, senha: ${cred.password ? '***' : '(vazia)'}`);
            
            connection = await mysql.createConnection({
                host: process.env.DB_HOST || 'localhost',
                user: cred.user,
                password: cred.password,
                port: process.env.DB_PORT || 3306
            });
            
            // Testar a conexão
            await connection.execute('SELECT 1');
            workingCredentials = cred;
            console.log('✅ Conexão bem-sucedida!');
            break;
            
        } catch (error) {
            console.log(`❌ Falha na conexão: ${error.message}`);
            if (connection) {
                await connection.end();
                connection = null;
            }
        }
    }
    
    if (!connection) {
        console.log('❌ Não foi possível conectar ao MySQL com nenhuma das credenciais testadas.');
        console.log('📋 Verifique se:');
        console.log('   1. O MySQL está rodando (serviço MySQL80 está ativo)');
        console.log('   2. As credenciais estão corretas');
        console.log('   3. O usuário root tem permissões adequadas');
        return false;
    }
    
    try {
        // Criar o banco de dados
        const dbName = process.env.DB_NAME || 'hospedin_pms';
        await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        console.log(`✅ Banco de dados '${dbName}' criado/verificado`);
        
        // Atualizar o arquivo .env com as credenciais que funcionaram
        const fs = require('fs');
        const envPath = '.env';
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Atualizar a senha no .env
        envContent = envContent.replace(/DB_PASSWORD=.*/, `DB_PASSWORD=${workingCredentials.password}`);
        fs.writeFileSync(envPath, envContent);
        
        console.log('✅ Arquivo .env atualizado com as credenciais corretas');
        console.log(`📋 Credenciais funcionais: usuário=${workingCredentials.user}, senha=${workingCredentials.password || '(vazia)'}`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao configurar o banco:', error.message);
        return false;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    setupMySQL().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = setupMySQL;