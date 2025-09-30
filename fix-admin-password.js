require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixAdminPassword() {
    try {
        console.log('🔧 Corrigindo senha do usuário admin...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'hospedin_pms'
        });

        console.log('✅ Conectado ao banco de dados');

        // Gerar hash da senha
        const senhaPlana = 'admin123';
        const saltRounds = 10;
        const senhaHash = await bcrypt.hash(senhaPlana, saltRounds);
        
        console.log('🔐 Hash da senha gerado:', senhaHash);

        // Atualizar senha do usuário admin
        const [result] = await connection.execute(
            'UPDATE usuarios SET senha = ? WHERE email = ?',
            [senhaHash, 'admin@hospedar.com']
        );

        if (result.affectedRows > 0) {
            console.log('✅ Senha do admin atualizada com sucesso!');
        } else {
            console.log('❌ Nenhum usuário foi atualizado');
        }

        // Verificar se a senha foi atualizada
        const [users] = await connection.execute(
            'SELECT email, senha FROM usuarios WHERE email = ?',
            ['admin@hospedar.com']
        );

        if (users.length > 0) {
            console.log('📋 Usuário atualizado:');
            console.log('Email:', users[0].email);
            console.log('Senha hash:', users[0].senha.substring(0, 20) + '...');
            
            // Testar se a senha funciona
            const senhaCorreta = await bcrypt.compare('admin123', users[0].senha);
            console.log('🧪 Teste de validação da senha:', senhaCorreta ? '✅ PASSOU' : '❌ FALHOU');
        }

        await connection.end();
        console.log('🔚 Correção concluída');

    } catch (error) {
        console.error('❌ Erro ao corrigir senha:', error.message);
    }
}

fixAdminPassword();