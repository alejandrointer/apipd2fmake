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
        {
	        image: 'data:image/png;base64,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',
	        width: 120,
		},
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 530,
              h: 17,
              r: 7,
              lineColor: 'black',
              color:'#CCCCCC',
            },
            {
              type: 'rect',
              x: 0,
              y: 17,
              w: 530,
              h: 17,
              r: 7,
              lineColor: 'black',
           

            },
          ]
          },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [66 , 100, 100,46, 46,46, 46],
            body: [
              [
                {
                  radius: 5 ,
                  border: [false, false, true, false],
                  text: 'ZONA', style: 'tableHeader'
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: 'COORDINADOR', style: 'tableHeader'
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: 'CLIENTE - 9810000033', style: 'tableHeader'
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: 'CONS.SIST', style: 'tableHeader'
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: 'PEDIDO', style: 'tableHeader'
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: 'SOLICITUD', style: 'tableHeader'
                },
                {
                  radius: 5 ,
                  border: [false, false, false, false],

                 // border: [true, true, true, true],
                  text: 'IMPRESION', style: 'tableHeader'
                },
            ]
          ]

              
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
            },
            
          },
          absolutePosition: {x: 45, y: 102}
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [66 , 100, 100,46, 46,46, 46],
            body: [
              [
                {
                  radius: 5 ,
                  border: [false, false, true, false],
                  text: 'Honduras', style: 'tableHeader'
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: 'ebarahona', style: 'tableHeader'
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: 'DELTA APPAREL,INC', style: 'tableHeader'
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: '1220884',style:'tablebody'
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: '1220884',style:'tablebody' 
                },
                {
                  radius: 5 ,
                  border: [false, false, true, false],

                  //border: [true, true, true, true],
                  text: '08/05/2021',style:'tablebody'
                },
                {
                  radius: 5 ,
                  border: [false, false, false, false],

                 // border: [true, true, true, true],
                  text: '08/09/2021',style:'tablebody'
                },
            ]
          ]

              
          },
          layout: {
            fillColor: function (rowIndex, node, columnIndex) {
              return (rowIndex % 2 === 0) ? '#FFFFFF' : null;
            },
            
          },
          absolutePosition: {x: 45, y: 119}
        },
    
      ],
      styles: {
        tableHeader: {
            bold: true,
            fontSize: 8,
            color: 'black',
        },
        tablebody: {
          bold: false,
          fontSize: 8,
          color: 'black',
      }
    },
      defaultStyle: {
          font: 'Helvetica'
      },
     

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
