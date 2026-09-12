import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import { formatearFechaActualLegible, formatearFechaLegible } from '../utils/fecha.js';
import { sanitizarNombreArchivoMascota } from '../utils/nombreArchivo.js';

const TIMEOUT_IMAGEN_MS = 8000;
const DIR_FUENTES = path.join(path.dirname(fileURLToPath(import.meta.url)), '../assets/fuentes');
const FUENTE_REGULAR = path.join(DIR_FUENTES, 'Roboto-Regular.ttf');
const FUENTE_NEGRITA = path.join(DIR_FUENTES, 'Roboto-Bold.ttf');
const AVISO_INFORMATIVO =
  'Esta ficha es informativa. No constituye una ficha clínica oficial ni está validada por un veterinario.';

function textoOVacio(valor, vacio) {
  if (valor === undefined || valor === null || valor === '') {
    return vacio;
  }

  return String(valor);
}

function textoSexo(sexo) {
  if (sexo === 'MACHO') {
    return 'Macho';
  }

  if (sexo === 'HEMBRA') {
    return 'Hembra';
  }

  return 'Sin especificar';
}

function urlImagenParaPdf(url) {
  try {
    const direccion = new URL(url);

    if (direccion.hostname !== 'res.cloudinary.com') {
      return url;
    }

    direccion.pathname = direccion.pathname.replace(
      '/image/upload/',
      '/image/upload/f_jpg,w_480/'
    );
    return direccion.toString();
  } catch {
    return url;
  }
}

async function descargarImagen(url) {
  try {
    const respuesta = await fetch(urlImagenParaPdf(url), {
      signal: AbortSignal.timeout(TIMEOUT_IMAGEN_MS),
    });

    if (!respuesta.ok) {
      return null;
    }

    const buffer = Buffer.from(await respuesta.arrayBuffer());

    if (buffer.length === 0 || buffer.length > 5 * 1024 * 1024) {
      return null;
    }

    return buffer;
  } catch {
    return null;
  }
}

function asegurarEspacio(doc, alto) {
  const limite = doc.page.height - doc.page.margins.bottom;

  if (doc.y + alto > limite) {
    doc.addPage();
  }
}

function escribirTituloSeccion(doc, titulo) {
  asegurarEspacio(doc, 36);
  doc.moveDown(0.6);
  doc.font('Ficha-Bold').fontSize(13).fillColor('#1f3d2f').text(titulo);
  doc.moveDown(0.25);
  doc.font('Ficha').fontSize(11).fillColor('#222222');
}

function escribirCampo(doc, etiqueta, valor) {
  asegurarEspacio(doc, 28);
  doc.font('Ficha-Bold').text(`${etiqueta}: `, { continued: true });
  doc.font('Ficha').text(valor);
}

function escribirParrafo(doc, texto) {
  asegurarEspacio(doc, 24);
  doc.font('Ficha').fontSize(11).fillColor('#222222').text(texto, { align: 'left' });
}

async function construirDocumento({ mascota, vacunas, enfermedades, alergias, secciones, imagen, errorFotografia }) {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    compress: false,
    info: { Title: 'Ficha informativa de mascota' },
  });
  doc.registerFont('Ficha', FUENTE_REGULAR);
  doc.registerFont('Ficha-Bold', FUENTE_NEGRITA);
  const fragmentos = [];

  doc.on('data', (parte) => fragmentos.push(parte));

  const terminado = new Promise((resolver, rechazar) => {
    doc.on('end', () => resolver(Buffer.concat(fragmentos)));
    doc.on('error', rechazar);
  });

  doc.font('Ficha-Bold').fontSize(18).fillColor('#1f3d2f').text('Ficha informativa de mascota');
  doc.moveDown(0.3);
  doc.font('Ficha').fontSize(10).fillColor('#444444').text(`Generada el ${formatearFechaActualLegible()}.`);
  doc.moveDown(0.45);
  doc.font('Ficha').fontSize(10).fillColor('#5c4a2a').text(AVISO_INFORMATIVO, { align: 'left' });
  doc.font('Ficha').fillColor('#222222');

  if (secciones.includes('datosBasicos')) {
    escribirTituloSeccion(doc, 'Datos básicos');
    escribirCampo(doc, 'Nombre', textoOVacio(mascota.nombre, 'No registrado'));
    escribirCampo(doc, 'Especie', textoOVacio(mascota.nombreEspecie, 'No registrada'));
    escribirCampo(doc, 'Raza', textoOVacio(mascota.raza, 'No registrada'));
    escribirCampo(doc, 'Sexo', textoSexo(mascota.sexo));
    escribirCampo(doc, 'Fecha de nacimiento', formatearFechaLegible(mascota.fechaNacimiento) || 'No registrada');
    escribirCampo(doc, 'Peso', mascota.peso ? `${mascota.peso} kg` : 'No registrado');
    escribirCampo(
      doc,
      'Microchip',
      mascota.poseeMicrochip
        ? textoOVacio(mascota.numeroMicrochip, 'No registrado')
        : 'No posee microchip'
    );
  }

  if (secciones.includes('fotografia')) {
    escribirTituloSeccion(doc, 'Fotografía');

    if (!mascota.fotografia) {
      escribirParrafo(doc, 'Sin fotografía registrada.');
    } else if (!imagen || errorFotografia) {
      escribirParrafo(doc, 'No fue posible incluir la fotografía.');
    } else {
      try {
        asegurarEspacio(doc, 160);
        doc.image(imagen, { fit: [180, 180] });
        doc.moveDown(0.5);
      } catch {
        escribirParrafo(doc, 'No fue posible incluir la fotografía.');
      }
    }
  }

  if (secciones.includes('vacunas')) {
    escribirTituloSeccion(doc, 'Vacunas');

    if (vacunas.length === 0) {
      escribirParrafo(doc, 'No hay vacunas registradas.');
    } else {
      vacunas.forEach((vacuna, indice) => {
        asegurarEspacio(doc, 62);
        doc.font('Ficha-Bold').text(vacuna.nombre || 'Vacuna');
        doc.font('Ficha').text(
          `Fecha de aplicación: ${formatearFechaLegible(vacuna.fechaAplicacion) || 'No registrada'}`
        );
        doc.text(`Próxima fecha: ${formatearFechaLegible(vacuna.proximaFecha) || 'No registrada'}`);
        if (vacuna.observacion) {
          doc.text(`Observación: ${vacuna.observacion}`);
        }
        if (vacuna.fotografiaComprobante) {
          doc.text('Comprobante adjunto');
        }
        if (indice < vacunas.length - 1) {
          doc.moveDown(0.35);
        }
      });
    }
  }

  if (secciones.includes('enfermedades')) {
    escribirTituloSeccion(doc, 'Enfermedades');

    if (enfermedades.length === 0) {
      escribirParrafo(doc, 'No hay enfermedades registradas.');
    } else {
      enfermedades.forEach((enfermedad, indice) => {
        asegurarEspacio(doc, 40);
        doc.font('Ficha-Bold').text(enfermedad.nombreDescripcion || 'Enfermedad');
        doc.font('Ficha').text(
          `Fecha de diagnóstico: ${formatearFechaLegible(enfermedad.fechaDiagnostico) || 'No registrada'}`
        );
        if (enfermedad.observacion) {
          doc.text(`Observación: ${enfermedad.observacion}`);
        }
        if (indice < enfermedades.length - 1) {
          doc.moveDown(0.35);
        }
      });
    }
  }

  if (secciones.includes('alergias')) {
    escribirTituloSeccion(doc, 'Alergias');

    if (alergias.length === 0) {
      escribirParrafo(doc, 'No hay alergias registradas.');
    } else {
      alergias.forEach((alergia, indice) => {
        asegurarEspacio(doc, 32);
        doc.font('Ficha-Bold').text(alergia.nombreDescripcion || 'Alergia');
        doc.font('Ficha');
        if (alergia.observacion) {
          doc.text(`Observación: ${alergia.observacion}`);
        }
        if (indice < alergias.length - 1) {
          doc.moveDown(0.35);
        }
      });
    }
  }

  if (secciones.includes('antecedentesRelevantes')) {
    escribirTituloSeccion(doc, 'Antecedentes relevantes');

    if (!mascota.antecedentesRelevantes) {
      escribirParrafo(doc, 'No hay antecedentes relevantes registrados.');
    } else {
      escribirParrafo(doc, mascota.antecedentesRelevantes);
    }
  }

  doc.end();
  return terminado;
}

export async function armarPdfMascota({ mascota, vacunas, enfermedades, alergias, secciones }) {
  let imagen = null;
  let errorFotografia = false;

  if (secciones.includes('fotografia') && mascota.fotografia) {
    imagen = await descargarImagen(mascota.fotografia);
    errorFotografia = !imagen;
  }

  const buffer = await construirDocumento({
    mascota,
    vacunas,
    enfermedades,
    alergias,
    secciones,
    imagen,
    errorFotografia,
  });

  return {
    buffer,
    nombreArchivo: sanitizarNombreArchivoMascota(mascota.nombre),
  };
}
