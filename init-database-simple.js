const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

async function initializeDatabaseSimple() {
    console.log('🔄 Inicializando banco de dados usando MySQL CLI...');
    
    const mysqlPath = '"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe"';
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'hospedin_pms';
    const schemaFile = path.join(__dirname, 'database', 'schema.sql');
    
    // Comando para executar o script SQL
    const command = `${mysqlPath} -h ${host} -u ${user} -p${password} ${database} < "${schemaFile}"`;
    
    return new Promise((resolve, reject) => {
        console.log('🔄 Executando script SQL...');
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Erro ao executar script SQL:', error.message);
                if (stderr) {
                    console.error('Stderr:', stderr);
                }
                reject(error);
                return;
            }
            
            if (stderr && !stderr.includes('Warning')) {
                console.warn('⚠️  Avisos:', stderr);
            }
            
            if (stdout) {
                console.log('📋 Saída:', stdout);
            }
            
            console.log('✅ Banco de dados inicializado com sucesso!');
            resolve();
        });
    });
}

// Executar se chamado diretamente
if (require.main === module) {
    initializeDatabaseSimple()
        .then(() => {
            console.log('🎉 Configuração do banco concluída!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Falha na configuração:', error.message);
            process.exit(1);
        });
}

module.exports = initializeDatabaseSimple;