const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseConnection() {
    console.log('🔄 Testando conexão com o banco de dados...');
    
    let connection;
    
    try {
        // Conectar ao banco de dados
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'hospedin_pms',
            port: process.env.DB_PORT || 3306
        });
        
        console.log('✅ Conectado ao banco de dados MySQL');
        
        // Testar algumas consultas básicas
        console.log('🔄 Verificando tabelas criadas...');
        
        const [tables] = await connection.execute('SHOW TABLES');
        console.log(`✅ Encontradas ${tables.length} tabelas:`);
        tables.forEach(table => {
            console.log(`   - ${Object.values(table)[0]}`);
        });
        
        // Testar inserção de um usuário admin padrão
        console.log('🔄 Criando usuário administrador padrão...');
        
        // Usar uma senha simples sem bcrypt para teste
        const simplePassword = 'admin123';
        
        try {
            await connection.execute(
                'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
                ['Administrador', 'admin@hospedar.com', simplePassword, 'admin']
            );
            console.log('✅ Usuário administrador criado com sucesso');
            console.log('📋 Credenciais: admin@hospedar.com / admin123');
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log('ℹ️  Usuário administrador já existe');
            } else {
                console.warn('⚠️  Erro ao criar usuário admin:', error.message);
            }
        }
        
        // Testar inserção de uma propriedade padrão
        console.log('🔄 Criando propriedade padrão...');
        
        try {
            await connection.execute(
                'INSERT INTO propriedades (nome, descricao, cidade, estado) VALUES (?, ?, ?, ?)',
                ['Hotel Exemplo', 'Hotel de demonstração do sistema', 'São Paulo', 'SP']
            );
            console.log('✅ Propriedade padrão criada com sucesso');
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log('ℹ️  Propriedade padrão já existe');
            } else {
                console.warn('⚠️  Erro ao criar propriedade:', error.message);
            }
        }
        
        console.log('🎉 Teste de conexão concluído com sucesso!');
        return true;
        
    } catch (error) {
        console.error('❌ Erro na conexão com o banco:', error.message);
        console.log('🔧 Verifique:');
        console.log('   - Se o MySQL está rodando');
        console.log('   - Se as credenciais no .env estão corretas');
        console.log('   - Se o banco de dados foi criado');
        return false;
        
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    testDatabaseConnection().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = testDatabaseConnection;