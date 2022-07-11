const express = require('express');
const app = express();
const PdfPrinter = require('pdfmake');
const Promise = require("bluebird");
const port = process.env.PORT || 3001;
const www = process.env.WWW || './';
app.use(express.static(www));
console.log(`serving ${www}`);

createPdf = async ()=>{
    let fonts = {
      Helvetica: {
          normal: 'Helvetica',
          bold: 'Helvetica-Bold',
          italics: 'Helvetica-Oblique',
          bolditalics: 'Helvetica-BoldOblique'
     }
    }
    let printer = new PdfPrinter(fonts)
    var docDefinition = {
      content: [
          'First paragraph',
          'Another paragraph, this time a little bit longer to make sure,'+ 
             ' this line will be divided into at least two lines'
      ],
      defaultStyle: {
          font: 'Helvetica'
      }
    };
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
  
    return new Promise((resolve, reject) =>{ try {
      var chunks = [];
      pdfDoc.on('data', chunk => chunks.push(chunk));
      pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
      pdfDoc.end();
    } catch(err) {
      reject(err);
    }});
  };


app.get('*', async (req, res, next)=>{ try {
    var binaryResult = await createPdf();
    res.contentType('application/pdf').send(binaryResult);
} catch(err){
    saveError(err);
    res.send('<h2>There was an error displaying the PDF document</h2>Error message: ' + err.message);
}});


app.listen(port, () => console.log(`listening on http://localhost:${port}`));
