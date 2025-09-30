require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkUser() {
    try {
        console.log('🔍 Verificando usuário admin no banco...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'hospedin_pms'
        });

        console.log('✅ Conectado ao banco de dados');

        // Verificar se existe o usuário admin
        const [users] = await connection.execute(
            'SELECT id, email, senha, nome, tipo FROM usuarios WHERE email = ?',
            ['admin@hospedar.com']
        );

        if (users.length === 0) {
            console.log('❌ Usuário admin não encontrado!');
            console.log('🔧 Criando usuário admin...');
            
            await connection.execute(
                'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
                ['Administrador', 'admin@hospedar.com', 'admin123', 'admin']
            );
            
            console.log('✅ Usuário admin criado com sucesso!');
        } else {
            console.log('✅ Usuário admin encontrado:');
            console.log('ID:', users[0].id);
            console.log('Nome:', users[0].nome);
            console.log('Email:', users[0].email);
            console.log('Senha:', users[0].senha);
            console.log('Tipo:', users[0].tipo);
        }

        // Listar todos os usuários
        const [allUsers] = await connection.execute('SELECT * FROM usuarios');
        console.log('\n📋 Todos os usuários no banco:');
        allUsers.forEach(user => {
            console.log(`- ID: ${user.id}, Nome: ${user.nome}, Email: ${user.email}, Tipo: ${user.tipo}`);
        });

        await connection.end();
        console.log('🔚 Verificação concluída');

    } catch (error) {
        console.error('❌ Erro ao verificar usuário:', error.message);
    }
}

checkUser();