import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  esUrlDeNuestroCloudinary,
  extraerPublicIdCloudinary,
  obtenerPublicIdComprobanteVacuna,
  obtenerPublicIdMascota,
} from './fotografia.js';

test('obtenerPublicIdComprobanteVacuna usa la ruta de vacunas', () => {
  assert.equal(
    obtenerPublicIdComprobanteVacuna(12, 34),
    'vetfinder/mascotas/12/vacunas/34'
  );
});

test('el public_id del comprobante no coincide con el de la fotografía de mascota', () => {
  const idMascota = 12;
  const fotoMascota = obtenerPublicIdMascota('vetfinder/mascotas', idMascota);
  const comprobante = obtenerPublicIdComprobanteVacuna(idMascota, 34);

  assert.equal(fotoMascota, 'vetfinder/mascotas/12');
  assert.notEqual(comprobante, fotoMascota);
  assert.ok(comprobante.startsWith(`${fotoMascota}/vacunas/`));
});

test('extraerPublicIdCloudinary funciona con una URL válida de comprobante', () => {
  const url = 'https://res.cloudinary.com/demo/image/upload/v1699999999/vetfinder/mascotas/12/vacunas/34.jpg';
  assert.equal(extraerPublicIdCloudinary(url), 'vetfinder/mascotas/12/vacunas/34');
});

test('las URLs externas no se consideran de nuestro Cloudinary', () => {
  assert.equal(
    esUrlDeNuestroCloudinary('https://placehold.co/600x400?text=Comprobante-rabia', 'demo'),
    false
  );
  assert.equal(
    esUrlDeNuestroCloudinary(
      'https://res.cloudinary.com/otro-cloud/image/upload/v1/vetfinder/mascotas/12/vacunas/34.jpg',
      'demo'
    ),
    false
  );
  assert.equal(
    esUrlDeNuestroCloudinary(
      'https://res.cloudinary.com/demo/image/upload/v1/vetfinder/mascotas/12/vacunas/34.jpg',
      'demo'
    ),
    true
  );
});
