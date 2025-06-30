const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Configuración de rutas
const usersDbPath = path.resolve('C:/config-db', 'users.db');
const empresasDbPath = path.resolve('C:/config-db', 'empresas.db');
const fiscalDbPath = path.resolve('C:/config-db', 'fiscal.db');

// Conexión a la base de datos de usuarios
const usersDb = new sqlite3.Database(usersDbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos de usuarios:', err.message);
        throw err;
    }
    console.log('Conectado a la base de datos de usuarios.');
});

// Conexión a la base de datos de empresas
const empresasDb = new sqlite3.Database(empresasDbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos de empresas:', err.message);
        throw err;
    }
    console.log('Conectado a la base de datos de empresas.');
});

// Conexión a la base de datos fiscal
const fiscalDb = new sqlite3.Database(fiscalDbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos fiscal:', err.message);
        throw err;
    }
    console.log('Conectado a la base de datos fiscal.');
});

// Exportar ambas conexiones
module.exports = {
    usersDb,
    empresasDb,
    fiscalDb
};