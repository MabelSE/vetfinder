import pg from 'pg';

const { Pool } = pg;

function crearConfiguracion() {
  const urlBaseDatos = process.env.DATABASE_URL?.trim();

  if (urlBaseDatos) {
    return {
      connectionString: urlBaseDatos,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  return {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ?? '',
  };
}

export const pool = new Pool(crearConfiguracion());
