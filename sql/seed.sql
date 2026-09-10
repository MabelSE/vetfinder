-- Seed de prueba VetFinder
-- No modifica el esquema. Requiere las 19 tablas existentes.
-- Las PK de identidad se insertan con IDs explícitos mediante OVERRIDING SYSTEM VALUE.
-- Todas las cuentas de prueba usan el mismo hash bcrypt (no es texto plano).

BEGIN;

TRUNCATE TABLE
  reporte_valoracion,
  valoracion,
  visita,
  alergia,
  enfermedad,
  vacuna,
  mascota,
  veterinaria_servicio,
  veterinaria_especialidad,
  veterinaria_especie,
  servicio_personalizado,
  fotografia_veterinaria,
  horario,
  direccion,
  veterinaria,
  usuario,
  servicio,
  especialidad,
  especie
RESTART IDENTITY CASCADE;

-- Catálogo de especies definido en el alcance
INSERT INTO especie (id_especie, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Perro'),
  (2, 'Gato'),
  (3, 'Conejo'),
  (4, 'Roedor'),
  (5, 'Ave'),
  (6, 'Reptil'),
  (7, 'Tortuga'),
  (8, 'Pez'),
  (9, 'Serpiente'),
  (10, 'Arácnido'),
  (11, 'Equino'),
  (12, 'Bovino'),
  (13, 'Ovino'),
  (14, 'Caprino'),
  (15, 'Porcino'),
  (16, 'Otro');

-- Catálogo de servicios estándar (nombres de prueba para filtros; no hay listado oficial en el alcance)
INSERT INTO servicio (id_servicio, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Consulta general'),
  (2, 'Vacunación'),
  (3, 'Desparasitación'),
  (4, 'Cirugía'),
  (5, 'Hospitalización'),
  (6, 'Laboratorio'),
  (7, 'Imagenología'),
  (8, 'Peluquería');

INSERT INTO especialidad (id_especialidad, nombre) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Medicina interna'),
  (2, 'Cirugía'),
  (3, 'Dermatología'),
  (4, 'Cardiología'),
  (5, 'Odontología'),
  (6, 'Traumatología');

-- Hash bcrypt de la clave de prueba.
INSERT INTO usuario (
  id_usuario, nombre, apellido, correo, contrasena, telefono, rol, estado_cuenta, fecha_registro
) OVERRIDING SYSTEM VALUE VALUES
  (1, 'Camila', 'Soto', 'superadmin@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221000', 'SUPERADMIN', 'ACTIVA', '2026-01-10 09:00:00'),
  (2, 'Diego', 'Reyes', 'admin.huellas@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221101', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-02-01 10:00:00'),
  (3, 'Paula', 'Muñoz', 'admin.rahue@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221102', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-02-02 10:00:00'),
  (4, 'Jorge', 'Silva', 'admin.puestosur@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221103', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-03-01 10:00:00'),
  (5, 'Marta', 'Lagos', 'admin.francke@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221104', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-03-05 10:00:00'),
  (6, 'Ana', 'Pérez', 'ana.perez@correo.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '964111222', 'PROPIETARIO', 'ACTIVA', '2026-04-01 11:00:00'),
  (7, 'Luis', 'Contreras', 'luis.contreras@correo.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '964111333', 'PROPIETARIO', 'ACTIVA', '2026-04-02 11:00:00'),
  (8, 'Elena', 'Vargas', 'elena.vargas@correo.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   NULL, 'PROPIETARIO', 'INACTIVA', '2026-04-03 11:00:00'),
  (9, 'Nicolás', 'Fuentes', 'admin.rahuealto@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221106', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-04-10 10:00:00'),
  (10, 'Carla', 'Méndez', 'admin.plaza@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221107', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-04-11 10:00:00'),
  (11, 'Ignacio', 'Rojas', 'admin.exoticos@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221108', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-04-12 10:00:00'),
  (12, 'Fernanda', 'Díaz', 'admin.mayores@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221109', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-04-13 10:00:00'),
  (13, 'Tomás', 'Herrera', 'admin.lasquemas@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221110', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-04-14 10:00:00'),
  (14, 'Patricia', 'Núñez', 'admin.puertoviejo@vetfinder.cl',
   '$2b$10$izybFLdUom5daAG0krKwX.hvK9i1upYdDQK7NEnaBPW3uXre854m6',
   '642221111', 'ADMIN_VETERINARIA', 'ACTIVA', '2026-04-15 10:00:00');

-- Una sucursal = una cuenta administradora (id_usuario UNIQUE)
INSERT INTO veterinaria (
  id_veterinaria, id_usuario, nombre_comercial, descripcion, telefono, correo,
  sitio_web, instagram, facebook, atiende_urgencias, atencion_24_horas,
  disponibilidad, estado_registro, fecha_registro
) OVERRIDING SYSTEM VALUE VALUES
  (1, 2, 'Huellas de Osorno',
   'Clínica veterinaria con atención de urgencias las 24 horas.',
   '642234100', 'contacto@huellasosorno.cl',
   'https://huellasosorno.cl', 'https://instagram.com/huellasosorno', 'https://facebook.com/huellasosorno',
   TRUE, TRUE, 'DISPONIBLE', 'APROBADA', '2026-02-10 12:00:00'),
  (2, 3, 'Centro Veterinario Rahue',
   'Atención general y especialidades en el sector Rahue.',
   '642234200', 'contacto@vetrahue.cl',
   NULL, 'https://instagram.com/vetrahue', NULL,
   TRUE, FALSE, 'ALTA_DEMANDA', 'APROBADA', '2026-02-12 12:00:00'),
  (3, 4, 'Clínica Puesto Sur',
   'Atención general para perros, gatos y animales mayores en el sector Puesto Sur.',
   '642234300', 'contacto@puestosur.cl',
   NULL, NULL, NULL,
   FALSE, FALSE, 'DISPONIBLE', 'PENDIENTE', '2026-03-08 12:00:00'),
  (4, 5, 'Veterinaria Francke',
   'Consultas, vacunación y cirugías de baja complejidad en el barrio Francke.',
   '642234400', 'contacto@vetfrancke.cl',
   NULL, NULL, NULL,
   TRUE, FALSE, 'SIN_URGENCIAS', 'RECHAZADA', '2026-03-09 12:00:00'),
  (5, 9, 'Clínica Demo Rahue Alto',
   'Sucursal de demostración con jornada continua y atención general.',
   '642234500', 'contacto@demorahuealto.cl',
   NULL, NULL, NULL,
   FALSE, FALSE, 'DISPONIBLE', 'APROBADA', '2026-04-16 12:00:00'),
  (6, 10, 'Centro Veterinario Plaza',
   'Consultas y laboratorio en el sector céntrico de demostración. Sin fotografías cargadas.',
   '642234600', 'contacto@vetplaza.cl',
   NULL, NULL, NULL,
   TRUE, FALSE, 'SIN_URGENCIAS', 'APROBADA', '2026-04-17 12:00:00'),
  (7, 11, 'Consultorio Exóticos Osorno',
   'Atención de demostración para especies no tradicionales.',
   '642234700', 'contacto@exoticososorno.cl',
   NULL, 'https://instagram.com/exoticosdemo', NULL,
   FALSE, FALSE, 'DISPONIBLE', 'APROBADA', '2026-04-18 12:00:00'),
  (8, 12, 'Vet Mayores del Sur',
   'Atención de demostración para animales mayores, con demanda informada alta.',
   '642234800', 'contacto@vetmayores.cl',
   NULL, NULL, NULL,
   TRUE, FALSE, 'ALTA_DEMANDA', 'APROBADA', '2026-04-19 12:00:00'),
  (9, 13, 'Solicitud Clínica Las Quemas',
   'Solicitud pendiente de demostración, aún sin horarios registrados.',
   '642234900', 'contacto@lasquemas.cl',
   NULL, NULL, NULL,
   FALSE, FALSE, 'DISPONIBLE', 'PENDIENTE', '2026-04-20 12:00:00'),
  (10, 14, 'Veterinaria Puerto Viejo',
   'Solicitud rechazada de demostración.',
   '642235000', 'contacto@puertoviejo.cl',
   NULL, NULL, NULL,
   FALSE, FALSE, 'DISPONIBLE', 'RECHAZADA', '2026-04-21 12:00:00');

-- Dirección 1:1 con veterinaria. Coordenadas de referencia en Osorno.
INSERT INTO direccion (
  id_direccion, id_veterinaria, calle, numero, comuna, region, latitud, longitud
) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'Manuel Antonio Matta', '540', 'Osorno', 'Los Lagos', -40.573800, -73.135000),
  (2, 2, 'Los Carrera', '1250', 'Osorno', 'Los Lagos', -40.578500, -73.128000),
  (3, 3, 'República', '890', 'Osorno', 'Los Lagos', -40.569000, -73.140000),
  (4, 4, 'Francisco Bilbao', '320', 'Osorno', 'Los Lagos', -40.582000, -73.122000),
  (5, 5, 'Cochrane', '780', 'Osorno', 'Los Lagos', -40.571200, -73.129400),
  (6, 6, 'Mackenna', '410', 'Osorno', 'Los Lagos', -40.574900, -73.133200),
  (7, 7, 'Ramírez', '950', 'Osorno', 'Los Lagos', -40.568400, -73.126800),
  (8, 8, 'Errázuriz', '210', 'Osorno', 'Los Lagos', -40.580100, -73.141500),
  (9, 9, 'Las Quemas', '1600', 'Osorno', 'Los Lagos', -40.586400, -73.119800),
  (10, 10, 'Prat', '330', 'Osorno', 'Los Lagos', -40.567200, -73.137600);

-- Antes de aprobar debe existir al menos un horario.
-- Si cerrado = true, las horas van NULL. Si cerrado = false, cierre > apertura.
-- Huellas (1) es 24 horas: la apertura se deriva de atencion_24_horas, no de 00:00-23:59.
INSERT INTO horario (
  id_horario, id_veterinaria, dia_semana, hora_apertura, hora_cierre, cerrado
) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'LUNES', NULL, NULL, TRUE),
  (2, 1, 'MARTES', NULL, NULL, TRUE),
  (3, 1, 'MIERCOLES', NULL, NULL, TRUE),
  (4, 1, 'JUEVES', NULL, NULL, TRUE),
  (5, 1, 'VIERNES', NULL, NULL, TRUE),
  (6, 1, 'SABADO', NULL, NULL, TRUE),
  (7, 1, 'DOMINGO', NULL, NULL, TRUE),
  (8, 2, 'LUNES', '09:00:00', '13:00:00', FALSE),
  (9, 2, 'LUNES', '15:00:00', '19:00:00', FALSE),
  (10, 2, 'MARTES', '09:00:00', '13:00:00', FALSE),
  (11, 2, 'MARTES', '15:00:00', '19:00:00', FALSE),
  (12, 2, 'MIERCOLES', '09:00:00', '13:00:00', FALSE),
  (13, 2, 'MIERCOLES', '15:00:00', '19:00:00', FALSE),
  (14, 2, 'JUEVES', '09:00:00', '13:00:00', FALSE),
  (15, 2, 'JUEVES', '15:00:00', '19:00:00', FALSE),
  (16, 2, 'VIERNES', '09:00:00', '13:00:00', FALSE),
  (17, 2, 'VIERNES', '15:00:00', '19:00:00', FALSE),
  (18, 2, 'SABADO', '10:00:00', '14:00:00', FALSE),
  (19, 2, 'DOMINGO', NULL, NULL, TRUE),
  (20, 3, 'LUNES', '10:00:00', '22:00:00', FALSE),
  (21, 3, 'MARTES', '10:00:00', '22:00:00', FALSE),
  (22, 3, 'MIERCOLES', '10:00:00', '22:00:00', FALSE),
  (23, 3, 'JUEVES', '10:00:00', '22:00:00', FALSE),
  (24, 3, 'VIERNES', '10:00:00', '22:00:00', FALSE),
  (25, 3, 'SABADO', '10:00:00', '18:00:00', FALSE),
  (26, 3, 'DOMINGO', NULL, NULL, TRUE),
  (27, 4, 'LUNES', '09:00:00', '18:00:00', FALSE),
  (28, 4, 'MARTES', '09:00:00', '18:00:00', FALSE),
  (29, 4, 'MIERCOLES', '09:00:00', '18:00:00', FALSE),
  (30, 4, 'JUEVES', '09:00:00', '18:00:00', FALSE),
  (31, 4, 'VIERNES', '09:00:00', '18:00:00', FALSE),
  (32, 4, 'SABADO', '09:00:00', '13:00:00', FALSE),
  (33, 4, 'DOMINGO', NULL, NULL, TRUE),
  (34, 5, 'LUNES', '09:00:00', '18:00:00', FALSE),
  (35, 5, 'MARTES', '09:00:00', '18:00:00', FALSE),
  (36, 5, 'MIERCOLES', '09:00:00', '18:00:00', FALSE),
  (37, 5, 'JUEVES', '09:00:00', '18:00:00', FALSE),
  (38, 5, 'VIERNES', '09:00:00', '18:00:00', FALSE),
  (39, 5, 'SABADO', '09:00:00', '13:00:00', FALSE),
  (40, 5, 'DOMINGO', NULL, NULL, TRUE),
  (41, 6, 'LUNES', '08:00:00', '20:00:00', FALSE),
  (42, 6, 'MARTES', '08:00:00', '20:00:00', FALSE),
  (43, 6, 'MIERCOLES', '08:00:00', '20:00:00', FALSE),
  (44, 6, 'JUEVES', '08:00:00', '20:00:00', FALSE),
  (45, 6, 'VIERNES', '08:00:00', '20:00:00', FALSE),
  (46, 6, 'SABADO', NULL, NULL, TRUE),
  (47, 6, 'DOMINGO', NULL, NULL, TRUE),
  (48, 7, 'LUNES', '11:00:00', '19:00:00', FALSE),
  (49, 7, 'MARTES', '11:00:00', '19:00:00', FALSE),
  (50, 7, 'MIERCOLES', '11:00:00', '19:00:00', FALSE),
  (51, 7, 'JUEVES', '11:00:00', '19:00:00', FALSE),
  (52, 7, 'VIERNES', '11:00:00', '16:00:00', FALSE),
  (53, 7, 'SABADO', '10:00:00', '14:00:00', FALSE),
  (54, 7, 'DOMINGO', NULL, NULL, TRUE),
  (55, 8, 'LUNES', '08:30:00', '12:30:00', FALSE),
  (56, 8, 'LUNES', '14:30:00', '18:30:00', FALSE),
  (57, 8, 'MARTES', '08:30:00', '12:30:00', FALSE),
  (58, 8, 'MARTES', '14:30:00', '18:30:00', FALSE),
  (59, 8, 'MIERCOLES', '08:30:00', '16:00:00', FALSE),
  (60, 8, 'JUEVES', '08:30:00', '12:30:00', FALSE),
  (61, 8, 'JUEVES', '14:30:00', '18:30:00', FALSE),
  (62, 8, 'VIERNES', '08:30:00', '12:30:00', FALSE),
  (63, 8, 'SABADO', NULL, NULL, TRUE),
  (64, 8, 'DOMINGO', NULL, NULL, TRUE),
  (65, 10, 'LUNES', '09:00:00', '13:00:00', FALSE),
  (66, 10, 'MARTES', '09:00:00', '13:00:00', FALSE),
  (67, 10, 'MIERCOLES', '09:00:00', '13:00:00', FALSE),
  (68, 10, 'JUEVES', '09:00:00', '13:00:00', FALSE),
  (69, 10, 'VIERNES', '09:00:00', '13:00:00', FALSE),
  (70, 10, 'SABADO', NULL, NULL, TRUE),
  (71, 10, 'DOMINGO', NULL, NULL, TRUE);

INSERT INTO fotografia_veterinaria (
  id_fotografia_veterinaria, id_veterinaria, url_imagen, orden_visualizacion
) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'https://placehold.co/800x600?text=Huellas-1', 1),
  (2, 1, 'https://placehold.co/800x600?text=Huellas-2', 2),
  (3, 2, 'https://placehold.co/800x600?text=Rahue-1', 1),
  (4, 3, 'https://placehold.co/800x600?text=PuestoSur-1', 1),
  (5, 5, 'https://placehold.co/800x600?text=RahueAlto-1', 1),
  (6, 7, 'https://placehold.co/800x600?text=Exoticos-1', 1),
  (7, 8, 'https://placehold.co/800x600?text=Mayores-1', 1);

INSERT INTO servicio_personalizado (
  id_servicio_personalizado, id_veterinaria, nombre, descripcion
) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'Hospitalización nocturna', 'Cuidado continuo durante la noche, con monitoreo de pacientes internados.'),
  (2, 2, 'Etología básica', 'Evaluación inicial de conducta y recomendaciones para el hogar.'),
  (3, 7, 'Consulta de aves ornamentales', 'Revisión informativa para aves de compañía, según lo declarado por el establecimiento.');

INSERT INTO veterinaria_servicio (id_veterinaria, id_servicio) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
  (2, 1), (2, 2), (2, 3), (2, 8),
  (3, 1), (3, 2),
  (4, 1),
  (5, 1), (5, 2), (5, 3),
  (6, 1), (6, 6), (6, 7),
  (7, 1), (7, 2),
  (8, 1), (8, 4), (8, 5),
  (10, 1);

INSERT INTO veterinaria_especialidad (id_veterinaria, id_especialidad) VALUES
  (1, 1), (1, 2), (1, 4), (1, 6),
  (2, 1), (2, 3), (2, 5),
  (3, 1),
  (4, 2),
  (5, 3),
  (7, 1), (7, 5),
  (8, 2), (8, 6);

INSERT INTO veterinaria_especie (id_veterinaria, id_especie) VALUES
  (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
  (2, 1), (2, 2),
  (3, 1), (3, 2), (3, 11),
  (4, 1),
  (5, 1), (5, 2), (5, 3),
  (6, 1), (6, 2),
  (7, 3), (7, 5), (7, 6), (7, 7), (7, 8), (7, 9), (7, 10),
  (8, 11), (8, 12), (8, 13), (8, 14), (8, 15),
  (10, 1);

INSERT INTO mascota (
  id_mascota, id_usuario, id_especie, nombre, raza, sexo, fecha_nacimiento,
  peso, fotografia, posee_microchip, numero_microchip, antecedentes_relevantes
) OVERRIDING SYSTEM VALUE VALUES
  (1, 6, 1, 'Luna', 'Labrador', 'HEMBRA', '2021-05-12',
   24.50, 'https://placehold.co/400x400?text=Luna', TRUE, '900123456789012',
   'Nerviosa con ruidos fuertes. Antecedente informado por la propietaria, no es ficha clínica oficial.'),
  (2, 6, 2, 'Michi', 'Mestizo', 'MACHO', '2023-01-20',
   4.20, NULL, FALSE, NULL, NULL),
  (3, 7, 3, 'Coco', NULL, NULL, NULL,
   NULL, NULL, FALSE, NULL, NULL),
  (4, 7, 5, 'Kiwi', 'Perico', 'HEMBRA', '2024-08-01',
   0.08, NULL, FALSE, NULL, 'Alimentación casera supervisada.');

INSERT INTO vacuna (
  id_vacuna, id_mascota, nombre, fecha_aplicacion, proxima_fecha, fotografia_comprobante, observacion
) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'Antirrábica', '2025-06-10', '2026-06-10',
   'https://placehold.co/600x400?text=Comprobante-rabia', 'Aplicada en control anual.'),
  (2, 1, 'Óctuple', '2025-06-10', '2026-06-10', NULL, NULL),
  (3, 2, 'Triple felina', '2025-11-03', NULL, NULL, 'Sin fecha de refuerzo registrada.');

INSERT INTO enfermedad (
  id_enfermedad, id_mascota, nombre_descripcion, fecha_diagnostico, observacion
) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'Otitis ocasional', '2024-09-15', 'Informado por la propietaria.');

INSERT INTO alergia (
  id_alergia, id_mascota, nombre_descripcion, observacion
) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 'Pollo', 'Evitar alimentos con proteína de pollo.');

INSERT INTO visita (
  id_visita, id_mascota, id_veterinaria, fecha_visita, fecha_registro
) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 1, '2026-07-10', '2026-07-10 18:30:00'),
  (2, 2, 2, '2026-08-01', '2026-08-01 16:00:00'),
  (3, 3, 1, '2026-08-15', '2026-08-15 12:20:00'),
  (4, 1, 2, '2026-06-20', '2026-06-20 11:10:00'),
  (5, 2, 5, '2026-08-22', '2026-08-22 15:40:00'),
  (6, 1, 6, '2026-08-28', '2026-08-28 17:05:00');

-- Una valoración por visita. Puntuación 1 a 5 en pasos de 0.5.
INSERT INTO valoracion (
  id_valoracion, id_visita, puntuacion, comentario, fecha_publicacion
) OVERRIDING SYSTEM VALUE VALUES
  (1, 1, 4.5, 'Atención rápida y clara.', '2026-07-10 20:00:00'),
  (2, 2, 2.0, 'Esperé demasiado y la información fue confusa.', '2026-08-01 19:00:00'),
  (3, 4, 5.0, 'Muy buena experiencia con Luna.', '2026-06-20 19:30:00'),
  (4, 6, 3.5, 'Atención correcta, aunque con espera.', '2026-08-28 20:10:00');
-- Las visitas 3 y 5 quedan sin valoración a propósito.

-- Máximo un reporte PENDIENTE por valoración.
INSERT INTO reporte_valoracion (
  id_reporte, id_valoracion, id_usuario, motivo, fecha_reporte, estado, observacion_admin
) OVERRIDING SYSTEM VALUE VALUES
  (1, 2, 3, 'El comentario no coincide con la atención registrada.',
   '2026-08-02 09:00:00', 'PENDIENTE', NULL),
  (2, 3, 3, 'Posible valoración de prueba.',
   '2026-06-21 10:00:00', 'REVISADO', 'Revisado por SuperAdmin. Se mantiene la valoración.'),
  (3, 4, 10, 'El comentario no parece corresponder a una visita real.',
   '2026-08-29 09:15:00', 'DESESTIMADO', 'Desestimado. La valoración se mantiene.');

-- Alinea las secuencias de identidad con los IDs insertados. No modifica el esquema.
SELECT setval(pg_get_serial_sequence('especie', 'id_especie'), (SELECT MAX(id_especie) FROM especie));
SELECT setval(pg_get_serial_sequence('servicio', 'id_servicio'), (SELECT MAX(id_servicio) FROM servicio));
SELECT setval(pg_get_serial_sequence('especialidad', 'id_especialidad'), (SELECT MAX(id_especialidad) FROM especialidad));
SELECT setval(pg_get_serial_sequence('usuario', 'id_usuario'), (SELECT MAX(id_usuario) FROM usuario));
SELECT setval(pg_get_serial_sequence('veterinaria', 'id_veterinaria'), (SELECT MAX(id_veterinaria) FROM veterinaria));
SELECT setval(pg_get_serial_sequence('direccion', 'id_direccion'), (SELECT MAX(id_direccion) FROM direccion));
SELECT setval(pg_get_serial_sequence('horario', 'id_horario'), (SELECT MAX(id_horario) FROM horario));
SELECT setval(pg_get_serial_sequence('fotografia_veterinaria', 'id_fotografia_veterinaria'), (SELECT MAX(id_fotografia_veterinaria) FROM fotografia_veterinaria));
SELECT setval(pg_get_serial_sequence('servicio_personalizado', 'id_servicio_personalizado'), (SELECT MAX(id_servicio_personalizado) FROM servicio_personalizado));
SELECT setval(pg_get_serial_sequence('mascota', 'id_mascota'), (SELECT MAX(id_mascota) FROM mascota));
SELECT setval(pg_get_serial_sequence('vacuna', 'id_vacuna'), (SELECT MAX(id_vacuna) FROM vacuna));
SELECT setval(pg_get_serial_sequence('enfermedad', 'id_enfermedad'), (SELECT MAX(id_enfermedad) FROM enfermedad));
SELECT setval(pg_get_serial_sequence('alergia', 'id_alergia'), (SELECT MAX(id_alergia) FROM alergia));
SELECT setval(pg_get_serial_sequence('visita', 'id_visita'), (SELECT MAX(id_visita) FROM visita));
SELECT setval(pg_get_serial_sequence('valoracion', 'id_valoracion'), (SELECT MAX(id_valoracion) FROM valoracion));
SELECT setval(pg_get_serial_sequence('reporte_valoracion', 'id_reporte'), (SELECT MAX(id_reporte) FROM reporte_valoracion));

COMMIT;
