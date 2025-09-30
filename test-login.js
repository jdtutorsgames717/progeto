require('dotenv').config();

async function testLogin() {
    try {
        console.log('🧪 Testando rota de login...');
        
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@hospedar.com',
                senha: 'admin123'
            })
        });
        
        console.log('📊 Status da resposta:', response.status);
        console.log('📊 Status text:', response.statusText);
        
        const data = await response.json();
        console.log('📋 Resposta do servidor:', JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log('✅ Login funcionando corretamente!');
            console.log('🔑 Token gerado:', data.token ? 'SIM' : 'NÃO');
            console.log('👤 Dados do usuário:', data.user);
        } else {
            console.log('❌ Falha no login:', data.message);
        }
        
    } catch (error) {
        console.error('❌ Erro ao testar login:', error.message);
    }
}

testLogin();