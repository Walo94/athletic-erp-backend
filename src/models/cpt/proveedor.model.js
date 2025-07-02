import { connectCPT, connectUpCPT } from '../../config/db.js';
import sql from 'mssql';

const _getDbConfig = (empresa) => {
  if (empresa === 'athletic') {
    return { pool: connectCPT, db1: 'CPT', db2: 'RCPT' };
  } else if (empresa === 'uptown') {
    return { pool: connectUpCPT, db1: 'UptownCPT', db2: 'UptownRCPT' };
  }
  throw new Error('Empresa no válida. Debe ser "athletic" o "uptown".');
};

const _mapProveedorData = (dbRecord) => {
  if (!dbRecord) return null;
  // Asegura que el objeto devuelto tenga las claves en minúsculas
  // para consistencia, incluso si el input las tiene en mayúsculas.
  return {
    proveedor: dbRecord.proveedor || dbRecord.Proveedor,
    nombre: dbRecord.nombre || dbRecord.Nombre,
    rfc: dbRecord.rfc || dbRecord.RFC,
    direccion: dbRecord.direccion || dbRecord.Direccion,
    ciudad: dbRecord.ciudad || dbRecord.Ciudad,
    cp: dbRecord.cp || dbRecord.CP,
    telefonos: dbRecord.telefonos || dbRecord.Telefonos,
    fax: dbRecord.fax || dbRecord.Fax,
    correoE: dbRecord.correoE || dbRecord.CorreoE,
    contacto: dbRecord.contacto || dbRecord.Contacto,
    estatus: dbRecord.estatus || dbRecord.Estatus
  };
};

export const ProveedorModel = {
  /**
   * Crea un nuevo proveedor en ambas bases de datos.
   */
  create: async (data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();
    try {
      await transaction.begin();
      const request = transaction.request();
      request.input('proveedor', sql.SmallInt, data.proveedor);
      request.input('nombre', sql.VarChar(50), data.nombre);
      request.input('rfc', sql.VarChar(15), data.rfc);
      request.input('direccion', sql.VarChar(50), data.direccion);
      request.input('ciudad', sql.VarChar(50), data.ciudad);
      request.input('cp', sql.Char(5), data.cp);
      request.input('telefonos', sql.VarChar(40), data.telefonos);
      request.input('fax', sql.VarChar(15), data.fax);
      request.input('correoE', sql.VarChar(30), data.correoE);
      request.input('contacto', sql.VarChar(50), data.contacto);
      request.input('estatus', sql.Char(1), data.estatus);
      
      const queryTemplate = `
        INSERT INTO %db%.dbo.Proveedores 
        (Proveedor, Nombre, RFC, Direccion, Ciudad, CP, Telefonos, Fax, CorreoE, Contacto, Estatus) 
        VALUES (@proveedor, @nombre, @rfc, @direccion, @ciudad, @cp, @telefonos, @fax, @correoE, @contacto, @estatus)
      `;

      await request.query(queryTemplate.replace('%db%', db1));
      await request.query(queryTemplate.replace('%db%', db2));

      await transaction.commit();
      return _mapProveedorData(data);
    } catch (err) {
      console.error('Error en la transacción de CREAR Proveedor, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  /**
   * Obtiene todos los proveedores.
   */
  findAll: async (empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request().query(`SELECT * FROM ${db1}.dbo.Proveedores ORDER BY Proveedor`);
    return result.recordset.map(_mapProveedorData);
  },

  /**
   * Actualiza un proveedor existente en ambas bases de datos.
   */
  update: async (proveedorId, data, empresa) => {
    const { pool, db1, db2 } = _getDbConfig(empresa);
    const connection = await pool();
    const transaction = connection.transaction();
    try {
      await transaction.begin();
      const request = transaction.request();
      request.input('proveedorId', sql.SmallInt, proveedorId);
      request.input('nombre', sql.VarChar(50), data.nombre);
      request.input('rfc', sql.VarChar(15), data.rfc);
      request.input('direccion', sql.VarChar(50), data.direccion);
      request.input('ciudad', sql.VarChar(50), data.ciudad);
      request.input('cp', sql.Char(5), data.cp);
      request.input('telefonos', sql.VarChar(40), data.telefonos);
      request.input('fax', sql.VarChar(15), data.fax);
      request.input('correoE', sql.VarChar(30), data.correoE);
      request.input('contacto', sql.VarChar(50), data.contacto);

      const queryTemplate = `
        UPDATE %db%.dbo.Proveedores SET 
        Nombre = @nombre, RFC = @rfc, Direccion = @direccion, Ciudad = @ciudad, 
        CP = @cp, Telefonos = @telefonos, Fax = @fax, CorreoE = @correoE, 
        Contacto = @contacto
        WHERE Proveedor = @proveedorId
      `;

      await request.query(queryTemplate.replace('%db%', db1));
      await request.query(queryTemplate.replace('%db%', db2));
      
      await transaction.commit();
      return _mapProveedorData({ proveedor: proveedorId, ...data });
    } catch (err) {
      console.error('Error en la transacción de ACTUALIZAR Proveedor, haciendo rollback...', err);
      await transaction.rollback();
      throw err;
    }
  },

  /**
   * Busca un proveedor por su ID.
   */
  findByPk: async (proveedorId, empresa) => {
    const { pool, db1 } = _getDbConfig(empresa);
    const connection = await pool();
    const result = await connection.request()
      .input('proveedorId', sql.SmallInt, proveedorId)
      .query(`SELECT * FROM ${db1}.dbo.Proveedores WHERE Proveedor = @proveedorId`);
    
    return _mapProveedorData(result.recordset[0]);
  },
};