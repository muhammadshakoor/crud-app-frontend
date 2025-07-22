// src/utils/exportBarcodes.ts
import jsPDF from 'jspdf';
import bwipjs from 'bwip-js';

export const exportBarcodes = async (products: any[]) => {
  const doc = new jsPDF();
  let y = 10;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    // Use existing barcode or generate a random 12-digit one
    const barcode =
      product.barcode && product.barcode.toString().trim() !==''
       ? product.barcode.toString()
       : Math.floor(Math.random() * 1000000000000).toString();

    // Create canvas
    const canvas = document.createElement('canvas');

    try {
      bwipjs.toCanvas(canvas, {
        bcid: 'code128',
        text: barcode,
        scale: 2,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });

      const imgData = canvas.toDataURL('image/png');
      doc.text(`Product: ${product.name}`, 10, y + 5);
      doc.addImage(imgData, 'PNG', 10, y + 10, 100, 30);
      y += 50;

      if (y > 260) {
        doc.addPage();
        y = 10;
      }
    } catch (err) {
      console.error(`Failed to generate barcode for ${product.name}`, err);
    }
  }

  doc.save('barcodes.pdf');
};
