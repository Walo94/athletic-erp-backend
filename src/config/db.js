import sql from 'mssql';

const databaseConfig = {
    user: 'sa',
    password: 'Prok2001',
    server: '192.168.95.1\\DATOS65'
}

const configRCPT = {
    user: databaseConfig.user,
    password: databaseConfig.password,
    server: databaseConfig.server,
    database: 'RCPT',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const configCPT = {
    user: databaseConfig.user,
    password: databaseConfig.password,
    server: databaseConfig.server,
    database: 'CPT',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const configUpCPT = {
    user: databaseConfig.user,
    password: databaseConfig.password,
    server: databaseConfig.server,
    database: 'UptownCPT',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const configUpRCPT = {
    user: databaseConfig.user,
    password: databaseConfig.password,
    server: databaseConfig.server,
    database: 'UptownRCPT',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
}

const configCMP = {
    user: databaseConfig.user,
    password: databaseConfig.password,
    server: databaseConfig.server,
    database: 'CMP',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const configATHLETICB= {
    user: databaseConfig.user,
    password: databaseConfig.password,
    server: databaseConfig.server,
    database: 'ATHLETICB',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const configAvances= {
    user: databaseConfig.user,
    password: databaseConfig.password,
    server: databaseConfig.server,
    database: 'Avances',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolRCPT = new sql.ConnectionPool(configRCPT);
const poolCPT = new sql.ConnectionPool(configCPT);
const poolCMP = new sql.ConnectionPool(configCMP);
const poolATHLETICB = new sql.ConnectionPool(configATHLETICB);
const poolAvances = new sql.ConnectionPool(configAvances);
const poolUpCPT = new sql.ConnectionPool(configUpCPT);
const poolUpRCPT = new sql.ConnectionPool(configUpRCPT);

const connectRCPT = async () => {
    try {
        if (!poolRCPT.connected) {
            await poolRCPT.connect();
        }
        return poolRCPT;
    } catch (err) {
        console.error('Error al conectar a RCPT:', err);
        throw err;
    }
};

const connectCPT = async () => {
    try {
        if (!poolCPT.connected) {
            await poolCPT.connect();
        }
        return poolCPT;
    } catch (err) {
        console.error('Error al conectar a CPT:', err);
        throw err;
    }
};

const connectCMP = async () => {
    try {
        if (!poolCMP.connected) {
            await poolCMP.connect();
        }
        return poolCMP;
    } catch (err) {
        console.error('Error al conectar a CMP:', err);
        throw err;
    }
};

const connectATHLETICB = async () => {
    try {
        if (!poolATHLETICB.connected) {
            await poolATHLETICB.connect();
        }
        return poolATHLETICB;
    }catch (err) {
        console.error('Error al conectar a ATHLETICB:', err);
        throw err;
    }
}

const connectAvances = async () => {
    try {
        if (!poolAvances.connected) {
            await poolAvances.connect();
        }
        return poolAvances;
    }catch (err) {
        console.error('Error al conectar a ATHLETICB:', err);
        throw err;
    }
}

const connectUpCPT = async () => {
    try {
        if (!poolUpCPT.connected) {
            await poolUpCPT.connect();
        }
        return poolUpCPT;
    }catch (err) {
        console.error('Error al conectar a UPTOWN CPT:', err);
        throw err;
    }
}

const connectUpRCPT = async () => {
    try {
        if (!poolUpRCPT.connected) {
            await poolUpRCPT.connect();
        }
        return poolUpRCPT;
    } catch (err) {
        console.error('Error al conectar a UPTOWN RCPT:', err);
        throw err;
    }
}


export {
    connectRCPT,
    connectCPT,
    connectCMP,
    connectATHLETICB,
    connectAvances,
    connectUpCPT,
    connectUpRCPT
};