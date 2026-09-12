# VetFinder

Plataforma web para consultar y mantener información de establecimientos veterinarios.

## Descripción

La información sobre veterinarias suele estar dispersa, incompleta o desactualizada, y rara vez incluye criterios específicos de atención veterinaria. Eso dificulta encontrar a tiempo un establecimiento adecuado, sobre todo cuando se necesita atención urgente.

VetFinder centraliza esa información y permite que cada sucursal actualice su ficha pública: horarios, servicios, especialidades, especies atendidas y disponibilidad informada por el propio establecimiento.

La versión actual es un proyecto académico delimitado a **Osorno, Región de Los Lagos, Chile**.

Perfiles:

- **PROPIETARIO**: busca veterinarias, gestiona mascotas, registra visitas y valoraciones.
- **ADMIN_VETERINARIA**: administra la ficha pública de su sucursal.
- **SUPERADMIN**: aprueba solicitudes, gestiona usuarios y veterinarias, y resuelve reportes.

La disponibilidad y los datos de ficha son información actualizada por la propia veterinaria. Esta versión no implementa información en tiempo real.

## Funcionalidades principales

### PROPIETARIO

- registro e inicio de sesión;
- búsqueda por nombre comercial y filtros (abiertas ahora, 24 horas, urgencias, especialidad, especie, servicio);
- modo de urgencia;
- geolocalización y distancia cuando el navegador lo permite;
- ficha pública, mapa, enlace a Google Maps y llamada `tel:`;
- gestión de mascotas;
- vacunas, enfermedades y alergias;
- exportación de ficha informativa en PDF;
- registro de visitas y valoraciones asociadas a esas visitas.

### ADMIN_VETERINARIA

- administración de su sucursal;
- datos generales, dirección y fotografías;
- horarios, atención de urgencias y 24 horas;
- disponibilidad (`DISPONIBLE`, `ALTA_DEMANDA`, `SIN_URGENCIAS`);
- servicios estándar y servicios personalizados;
- especialidades y especies atendidas;
- consulta y reporte de valoraciones.

### SUPERADMIN

- resumen de la plataforma;
- solicitudes de registro;
- aprobación y rechazo (toda veterinaria aprobada debe tener al menos un horario);
- administración de veterinarias;
- estado de cuentas de usuarios;
- revisión de reportes de valoraciones.

## Tecnologías

**Frontend**

- React
- Vite
- React Router
- CSS

**Backend**

- Node.js
- Express
- pg
- bcrypt
- express-session
- session-file-store
- multer
- PDFKit
- Cloudinary

**Base de datos**

- PostgreSQL

**Mapas**

- Leaflet y OpenStreetMap dentro de VetFinder
- Google Maps solo como navegación externa

## Arquitectura

VetFinder usa arquitectura cliente-servidor por capas. El frontend no se conecta a PostgreSQL.

```text
Frontend React
  → API REST (Express)
    → Routes
      → Middleware (sesión, roles, errores)
        → Controller
          → Service
            → Repository
              → PostgreSQL
```

Servicios externos: geolocalización del navegador, Google Maps y Cloudinary para fotografías.

## Requisitos previos

- Node.js (el frontend usa Vite 8; se recomienda Node.js 20.19 o superior)
- npm
- PostgreSQL

El proyecto no declara un `engines` propio en `package.json`.

## Instalación

1. Clonar el repositorio.

```bash
git clone https://github.com/MabelSE/vetfinder
cd VetFinder
```

2. Crear una base de datos PostgreSQL vacía, por ejemplo `vetfinder`.
3. Copiar y completar las variables de entorno del backend:

```bash
cp backend/.env.example backend/.env
```

4. Ejecutar el esquema y los datos de demostración:

```bash
psql -U postgres -d vetfinder -f sql/schema.sql
psql -U postgres -d vetfinder -f sql/seed.sql
```

5. Instalar e iniciar el backend:

```bash
cd backend
npm install
npm run dev
```

El backend queda en `http://localhost:3001` (`npm start` también usa `src/app.js` con `--env-file=.env`).

6. Instalar e iniciar el frontend, en otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend de desarrollo queda en `http://localhost:5173` y usa el proxy de Vite hacia `/api`.

## Variables de entorno

Definidas en `backend/.env.example`. No commitear valores reales.

| Variable | Uso |
|---|---|
| `PORT` | Puerto de la API (por defecto 3001) |
| `NODE_ENV` | `development` o `production` |
| `SESSION_SECRET` | Secreto de la cookie de sesión |
| `DB_HOST` | Host de PostgreSQL |
| `DB_PORT` | Puerto de PostgreSQL |
| `DB_NAME` | Nombre de la base |
| `DB_USER` | Usuario de la base |
| `DB_PASSWORD` | Contraseña de la base |
| `CLOUDINARY_CLOUD_NAME` | Nombre de la nube Cloudinary |
| `CLOUDINARY_API_KEY` | Clave de Cloudinary |
| `CLOUDINARY_API_SECRET` | Secreto de Cloudinary |
| `CLOUDINARY_CARPETA` | Carpeta de fotografías (por defecto `vetfinder/mascotas`) |

## Base de datos

PostgreSQL, con **19 tablas de dominio**:

`usuario`, `especie`, `mascota`, `vacuna`, `enfermedad`, `alergia`, `veterinaria`, `direccion`, `horario`, `fotografia_veterinaria`, `servicio`, `servicio_personalizado`, `especialidad`, `veterinaria_servicio`, `veterinaria_especialidad`, `veterinaria_especie`, `visita`, `valoracion`, `reporte_valoracion`.

- `sql/schema.sql` crea la estructura (PK, FK, UNIQUE, CHECK, índices e identidad).
- `sql/seed.sql` carga catálogos y datos de demostración.

Las claves primarias de entidad usan `GENERATED ALWAYS AS IDENTITY`. El seed inserta IDs fijos con `OVERRIDING SYSTEM VALUE` y luego alinea las secuencias.

## Datos de demostración

`sql/seed.sql` contiene usuarios, sucursales, mascotas, visitas y valoraciones **ficticios**, solo para desarrollo y evaluación académica.

No son veterinarias reales. No uses estas cuentas como credenciales de una instancia pública desplegada.

## Testing

El backend incluye **pruebas unitarias** con el runner nativo `node:test`.

```bash
cd backend
npm test
```

Archivos:

- `src/utils/prioridadUrgencia.test.js`
- `src/utils/nombrePublico.test.js`
- `src/validators/valoracionValidator.test.js`
- `src/validators/veterinariaAdminValidator.test.js`
- `src/validators/superadminValidator.test.js`

Última ejecución documentada en esta preparación: **27 aprobadas / 0 fallidas**.

No hay pruebas automatizadas de integración. La validación final del producto también incluyó pruebas manuales funcionales.

## Build

```bash
cd frontend
npm run build
```

Genera `frontend/dist/`. Esa carpeta no se versiona.

## Estructura del proyecto

```text
VetFinder/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
├── sql/
│   ├── schema.sql
│   └── seed.sql
├── docs/
└── README.md
```

## Seguridad

- contraseñas con hash bcrypt (nunca en texto plano);
- sesiones administradas por el servidor (`express-session` + `session-file-store`);
- cookie `vetfinder.sid` con `HttpOnly` y `SameSite=Lax`;
- `Secure` solo en producción / HTTPS;
- autorización por rol en el backend;
- verificación de propiedad de recursos (mascotas, sucursal del administrador, etc.);
- consultas parametrizadas.

No utiliza JWT. Las sesiones se guardan en `backend/sesiones/`, fuera del código fuente.

## Alcance

Versión académica limitada a Osorno, Región de Los Lagos, Chile. El modelo de ubicación no está rígidamente atado a valores fijos de Osorno, pero esta versión no contempla expansión geográfica.

## Funcionalidades fuera de alcance

No forman parte de esta versión:

- reservas ni agenda de horas;
- pagos;
- chat o mensajería;
- telemedicina o videollamadas;
- inteligencia artificial;
- notificaciones;
- venta de productos o tienda;
- ficha clínica oficial, diagnóstico o prescripciones.

## Autoría

VetFinder es un proyecto académico desarrollado por Mabel Soto Elgueta.
