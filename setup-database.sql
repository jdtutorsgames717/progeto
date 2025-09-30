
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
