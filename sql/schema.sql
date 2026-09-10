-- Esquema de dominio VetFinder.
-- Extraído del PostgreSQL actual. No rediseña el modelo.
-- 19 tablas. Las PK de entidad usan GENERATED ALWAYS AS IDENTITY.
-- Ejecutar sobre una base vacía antes de sql/seed.sql.

BEGIN;

CREATE TABLE usuario (
  id_usuario integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying(100) NOT NULL,
  apellido character varying(100) NOT NULL,
  correo character varying(150) NOT NULL,
  contrasena character varying(255) NOT NULL,
  telefono character varying(20),
  rol character varying(30) NOT NULL,
  estado_cuenta character varying(20) NOT NULL DEFAULT 'ACTIVA'::character varying,
  fecha_registro timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario),
  CONSTRAINT usuario_correo_key UNIQUE (correo),
  CONSTRAINT usuario_estado_cuenta_check CHECK (estado_cuenta::text = ANY (ARRAY['ACTIVA'::character varying, 'INACTIVA'::character varying]::text[])),
  CONSTRAINT usuario_rol_check CHECK (rol::text = ANY (ARRAY['PROPIETARIO'::character varying, 'ADMIN_VETERINARIA'::character varying, 'SUPERADMIN'::character varying]::text[]))
);

CREATE TABLE especie (
  id_especie integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying(50) NOT NULL,
  CONSTRAINT especie_pkey PRIMARY KEY (id_especie),
  CONSTRAINT especie_nombre_key UNIQUE (nombre)
);

CREATE TABLE servicio (
  id_servicio integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying(100) NOT NULL,
  CONSTRAINT servicio_pkey PRIMARY KEY (id_servicio),
  CONSTRAINT servicio_nombre_key UNIQUE (nombre)
);

CREATE TABLE especialidad (
  id_especialidad integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre character varying(100) NOT NULL,
  CONSTRAINT especialidad_pkey PRIMARY KEY (id_especialidad),
  CONSTRAINT especialidad_nombre_key UNIQUE (nombre)
);

CREATE TABLE veterinaria (
  id_veterinaria integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_usuario integer NOT NULL,
  nombre_comercial character varying(150) NOT NULL,
  descripcion text,
  telefono character varying(20) NOT NULL,
  correo character varying(150) NOT NULL,
  sitio_web character varying(255),
  instagram character varying(255),
  facebook character varying(255),
  atiende_urgencias boolean NOT NULL DEFAULT false,
  atencion_24_horas boolean NOT NULL DEFAULT false,
  disponibilidad character varying(20) NOT NULL DEFAULT 'DISPONIBLE'::character varying,
  estado_registro character varying(20) NOT NULL DEFAULT 'PENDIENTE'::character varying,
  fecha_registro timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT veterinaria_pkey PRIMARY KEY (id_veterinaria),
  CONSTRAINT veterinaria_id_usuario_key UNIQUE (id_usuario),
  CONSTRAINT chk_veterinaria_disponibilidad CHECK (disponibilidad::text = ANY (ARRAY['DISPONIBLE'::character varying, 'ALTA_DEMANDA'::character varying, 'SIN_URGENCIAS'::character varying]::text[])),
  CONSTRAINT chk_veterinaria_estado_registro CHECK (estado_registro::text = ANY (ARRAY['PENDIENTE'::character varying, 'APROBADA'::character varying, 'RECHAZADA'::character varying]::text[]))
);

CREATE TABLE direccion (
  id_direccion integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_veterinaria integer NOT NULL,
  calle character varying(150) NOT NULL,
  numero character varying(20) NOT NULL,
  comuna character varying(100) NOT NULL,
  region character varying(100) NOT NULL,
  latitud numeric(9,6),
  longitud numeric(9,6),
  CONSTRAINT direccion_pkey PRIMARY KEY (id_direccion),
  CONSTRAINT direccion_id_veterinaria_key UNIQUE (id_veterinaria)
);

CREATE TABLE horario (
  id_horario integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_veterinaria integer NOT NULL,
  dia_semana character varying(10) NOT NULL,
  hora_apertura time without time zone,
  hora_cierre time without time zone,
  cerrado boolean NOT NULL DEFAULT false,
  CONSTRAINT horario_pkey PRIMARY KEY (id_horario),
  CONSTRAINT chk_horario_dia CHECK (dia_semana::text = ANY (ARRAY['LUNES'::character varying, 'MARTES'::character varying, 'MIERCOLES'::character varying, 'JUEVES'::character varying, 'VIERNES'::character varying, 'SABADO'::character varying, 'DOMINGO'::character varying]::text[])),
  CONSTRAINT chk_horario_estado CHECK (cerrado = true AND hora_apertura IS NULL AND hora_cierre IS NULL OR cerrado = false AND hora_apertura IS NOT NULL AND hora_cierre IS NOT NULL),
  CONSTRAINT chk_horario_horas CHECK (cerrado = true OR hora_cierre > hora_apertura)
);

CREATE TABLE fotografia_veterinaria (
  id_fotografia_veterinaria integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_veterinaria integer NOT NULL,
  url_imagen character varying(500) NOT NULL,
  orden_visualizacion integer NOT NULL,
  CONSTRAINT fotografia_veterinaria_pkey PRIMARY KEY (id_fotografia_veterinaria),
  CONSTRAINT uq_fotografia_orden UNIQUE (id_veterinaria, orden_visualizacion),
  CONSTRAINT chk_fotografia_orden CHECK (orden_visualizacion >= 1)
);

CREATE TABLE servicio_personalizado (
  id_servicio_personalizado integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_veterinaria integer NOT NULL,
  nombre character varying(150) NOT NULL,
  descripcion text,
  CONSTRAINT servicio_personalizado_pkey PRIMARY KEY (id_servicio_personalizado),
  CONSTRAINT uq_servicio_personalizado UNIQUE (id_veterinaria, nombre)
);

CREATE TABLE veterinaria_servicio (
  id_veterinaria integer NOT NULL,
  id_servicio integer NOT NULL,
  CONSTRAINT pk_veterinaria_servicio PRIMARY KEY (id_veterinaria, id_servicio)
);

CREATE TABLE veterinaria_especialidad (
  id_veterinaria integer NOT NULL,
  id_especialidad integer NOT NULL,
  CONSTRAINT pk_veterinaria_especialidad PRIMARY KEY (id_veterinaria, id_especialidad)
);

CREATE TABLE veterinaria_especie (
  id_veterinaria integer NOT NULL,
  id_especie integer NOT NULL,
  CONSTRAINT pk_veterinaria_especie PRIMARY KEY (id_veterinaria, id_especie)
);

CREATE TABLE mascota (
  id_mascota integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_usuario integer NOT NULL,
  id_especie integer NOT NULL,
  nombre character varying(100) NOT NULL,
  raza character varying(100),
  sexo character varying(10),
  fecha_nacimiento date,
  peso numeric(6,2),
  fotografia character varying(500),
  posee_microchip boolean NOT NULL DEFAULT false,
  numero_microchip character varying(50),
  antecedentes_relevantes text,
  CONSTRAINT mascota_pkey PRIMARY KEY (id_mascota),
  CONSTRAINT chk_mascota_microchip CHECK (posee_microchip = true AND numero_microchip IS NOT NULL OR posee_microchip = false AND numero_microchip IS NULL),
  CONSTRAINT chk_mascota_peso CHECK (peso IS NULL OR peso > 0::numeric),
  CONSTRAINT chk_mascota_sexo CHECK ((sexo::text = ANY (ARRAY['MACHO'::character varying, 'HEMBRA'::character varying]::text[])) OR sexo IS NULL)
);

CREATE TABLE vacuna (
  id_vacuna integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_mascota integer NOT NULL,
  nombre character varying(150) NOT NULL,
  fecha_aplicacion date NOT NULL,
  proxima_fecha date,
  fotografia_comprobante character varying(500),
  observacion text,
  CONSTRAINT vacuna_pkey PRIMARY KEY (id_vacuna),
  CONSTRAINT chk_vacuna_proxima_fecha CHECK (proxima_fecha IS NULL OR proxima_fecha >= fecha_aplicacion)
);

CREATE TABLE enfermedad (
  id_enfermedad integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_mascota integer NOT NULL,
  nombre_descripcion character varying(200) NOT NULL,
  fecha_diagnostico date,
  observacion text,
  CONSTRAINT enfermedad_pkey PRIMARY KEY (id_enfermedad)
);

CREATE TABLE alergia (
  id_alergia integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_mascota integer NOT NULL,
  nombre_descripcion character varying(200) NOT NULL,
  observacion text,
  CONSTRAINT alergia_pkey PRIMARY KEY (id_alergia)
);

CREATE TABLE visita (
  id_visita integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_mascota integer NOT NULL,
  id_veterinaria integer NOT NULL,
  fecha_visita date NOT NULL,
  fecha_registro timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT visita_pkey PRIMARY KEY (id_visita)
);

CREATE TABLE valoracion (
  id_valoracion integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_visita integer NOT NULL,
  puntuacion numeric(2,1) NOT NULL,
  comentario text,
  fecha_publicacion timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valoracion_pkey PRIMARY KEY (id_valoracion),
  CONSTRAINT valoracion_id_visita_key UNIQUE (id_visita),
  CONSTRAINT chk_valoracion_puntuacion CHECK (puntuacion >= 1.0 AND puntuacion <= 5.0 AND (puntuacion * 2::numeric) = floor(puntuacion * 2::numeric))
);

CREATE TABLE reporte_valoracion (
  id_reporte integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_valoracion integer NOT NULL,
  id_usuario integer NOT NULL,
  motivo text NOT NULL,
  fecha_reporte timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado character varying(20) NOT NULL DEFAULT 'PENDIENTE'::character varying,
  observacion_admin text,
  CONSTRAINT reporte_valoracion_pkey PRIMARY KEY (id_reporte),
  CONSTRAINT chk_reporte_estado CHECK (estado::text = ANY (ARRAY['PENDIENTE'::character varying, 'REVISADO'::character varying, 'DESESTIMADO'::character varying]::text[]))
);

ALTER TABLE veterinaria
  ADD CONSTRAINT fk_veterinaria_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);

ALTER TABLE direccion
  ADD CONSTRAINT fk_direccion_veterinaria FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria);

ALTER TABLE horario
  ADD CONSTRAINT fk_horario_veterinaria FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria);

ALTER TABLE fotografia_veterinaria
  ADD CONSTRAINT fk_fotografia_veterinaria FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria);

ALTER TABLE servicio_personalizado
  ADD CONSTRAINT fk_servicio_personalizado_veterinaria FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria);

ALTER TABLE veterinaria_servicio
  ADD CONSTRAINT fk_veterinaria_servicio_veterinaria FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria);

ALTER TABLE veterinaria_servicio
  ADD CONSTRAINT fk_veterinaria_servicio_servicio FOREIGN KEY (id_servicio) REFERENCES servicio(id_servicio);

ALTER TABLE veterinaria_especialidad
  ADD CONSTRAINT fk_veterinaria_especialidad_veterinaria FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria);

ALTER TABLE veterinaria_especialidad
  ADD CONSTRAINT fk_veterinaria_especialidad_especialidad FOREIGN KEY (id_especialidad) REFERENCES especialidad(id_especialidad);

ALTER TABLE veterinaria_especie
  ADD CONSTRAINT fk_veterinaria_especie_veterinaria FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria);

ALTER TABLE veterinaria_especie
  ADD CONSTRAINT fk_veterinaria_especie_especie FOREIGN KEY (id_especie) REFERENCES especie(id_especie);

ALTER TABLE mascota
  ADD CONSTRAINT fk_mascota_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);

ALTER TABLE mascota
  ADD CONSTRAINT fk_mascota_especie FOREIGN KEY (id_especie) REFERENCES especie(id_especie);

ALTER TABLE vacuna
  ADD CONSTRAINT fk_vacuna_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota);

ALTER TABLE enfermedad
  ADD CONSTRAINT fk_enfermedad_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota);

ALTER TABLE alergia
  ADD CONSTRAINT fk_alergia_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota);

ALTER TABLE visita
  ADD CONSTRAINT fk_visita_mascota FOREIGN KEY (id_mascota) REFERENCES mascota(id_mascota);

ALTER TABLE visita
  ADD CONSTRAINT fk_visita_veterinaria FOREIGN KEY (id_veterinaria) REFERENCES veterinaria(id_veterinaria);

ALTER TABLE valoracion
  ADD CONSTRAINT fk_valoracion_visita FOREIGN KEY (id_visita) REFERENCES visita(id_visita);

ALTER TABLE reporte_valoracion
  ADD CONSTRAINT fk_reporte_valoracion FOREIGN KEY (id_valoracion) REFERENCES valoracion(id_valoracion);

ALTER TABLE reporte_valoracion
  ADD CONSTRAINT fk_reporte_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario);

-- Máximo un reporte PENDIENTE por valoración.
CREATE UNIQUE INDEX uq_reporte_activo_valoracion ON reporte_valoracion USING btree (id_valoracion) WHERE ((estado)::text = 'PENDIENTE'::text);

COMMIT;
