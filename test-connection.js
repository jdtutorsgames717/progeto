const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    console.log('🔄 Testando conexão com o banco de dados...');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Database: ${process.env.DB_NAME}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'hospedin_pms',
            port: process.env.DB_PORT || 3306
        });
        
        console.log('✅ Conexão estabelecida com sucesso!');
        
        // Testar uma query simples
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Query de teste executada:', rows);
        
        // Verificar se as tabelas existem
        const [tables] = await connection.execute('SHOW TABLES');
        console.log('📋 Tabelas no banco:', tables.length > 0 ? tables : 'Nenhuma tabela encontrada');
        
        await connection.end();
        return true;
        
    } catch (error) {
        console.error('❌ Erro na conexão:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('📋 Problema de autenticação. Verifique:');
            console.log('   - Usuário e senha estão corretos');
            console.log('   - Usuário tem permissões no banco');
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.log('📋 Banco de dados não existe. Será necessário criá-lo.');
        } else if (error.code === 'ECONNREFUSED') {
            console.log('📋 MySQL não está rodando ou não está acessível.');
        }
        
        return false;
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    testConnection().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = testConnection;