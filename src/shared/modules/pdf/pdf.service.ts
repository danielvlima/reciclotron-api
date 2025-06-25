import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  private doc: PDFKit.PDFDocument;

  create() {
    this.doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      margins: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
      },
    });
  }

  lineSeparator(y: number) {
    this.doc
      .moveDown()
      .lineCap('butt')
      .moveTo(20, y)
      .lineTo(575, y)
      .lineWidth(0.5)
      .stroke();
  }

  addTitle(title: string) {
    this.doc.fontSize(24).text(title);
  }

  addPeriod(initialDate: Date, finalDate: Date) {
    this.doc
      .fontSize(11)
      .text(
        `Período: ${
          initialDate.getMonth() + 1
        }/${initialDate.getFullYear()} - ${
          finalDate.getMonth() + 1
        }/${finalDate.getFullYear()}`,
      );

    this.lineSeparator(65);
  }

  async generate(): Promise<Buffer | null> {
    if (this.doc) {
      const pdfBuffer: Buffer = await new Promise((resolve) => {
        // customize your PDF document
        this.doc.end();

        const buffer = [];
        this.doc.on('data', buffer.push.bind(buffer));
        this.doc.on('end', () => {
          const data = Buffer.concat(buffer);
          resolve(data);
        });
      });

      return pdfBuffer;
    }
    return null;
  }
}
