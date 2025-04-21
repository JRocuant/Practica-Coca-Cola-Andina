const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
 
const transportes = {};  // Objeto para almacenar los códigos de transporte y sus pallets
const palletMaximo = {}; // Objeto para almacenar el código de transporte y el pallet máximo
let headers = [];
 
const readStream = fs.createReadStream(path.resolve(__dirname, '..', 'datos', 'RP2.csv')).pipe(csv({ separator: ',' }));
 
readStream
  .on('headers', (headerRow) => {
    headers = headerRow;
  })
  .on('data', (data) => {
    const transporte = data[headers[0]]; // Asegúrate de que el nombre sea correcto
    const pallet = parseInt(data[headers[1]], 10); // Convertir a número
 
    if (isNaN(pallet)) {
      console.warn(`Valor de pallet no válido: ${data[headers[1]]}`);
      return;
    }
 
    // Si el código de transporte aún no está en el objeto, creamos un Set para él
    if (!transportes[transporte]) {
      transportes[transporte] = new Set();
    }
 
    // Agregar el nº de pallet al Set correspondiente
    transportes[transporte].add(pallet);
  })
  .on('end', () => {
    // Convertir los Sets de cada transporte a un Array
    for (const transporte in transportes) {
      transportes[transporte] = Array.from(transportes[transporte]);
 
      // Asociar el código de transporte con el pallet máximo
      palletMaximo[transporte] = Math.max(...transportes[transporte]);
    }
 
    console.log('Archivo CSV procesado correctamente');
    console.log('Transportes:', transportes);  // Imprime todos los códigos de transporte y sus pallets sin repeticiones
    console.log('PalletMaximo:', palletMaximo);  // Imprime el objeto con el pallet máximo para cada transporte
  })
  .on('error', (err) => {
    console.error('Error al procesar el archivo CSV:', err.message);
  });