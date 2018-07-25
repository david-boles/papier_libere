const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');
const fs = require('fs');
const qr = require('qr-image');
PDFDocument.prototype.addSVG = function(svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options), this;
};

const PPI = 72;

//CONFIG
const pageWidth = 612;
const pageHeight = 792;
const pageStart = 99;//What page index to start on, should be odd.
const pageCount = 2;//Should be even (actual sheets of paper is half this).
const newPageOpts = {margin: 0}
const pageNumColor = '#c0c0c0';
const coverTemplate = fs.readFileSync('./assets/cover.svg').toString();
const leftBindingTemplate = fs.readFileSync('./assets/page-dot_grid-left_binding.svg').toString();
const rightBindingTemplate = fs.readFileSync('./assets/page-dot_grid-right_binding.svg').toString();

//Generate
const notebook = new PDFDocument({autoFirstPage: false});
notebook.pipe(fs.createWriteStream('./notebook.pdf'));

frontCover();
notebook.fontSize(PPI/3);
for(var i = pageStart; i < pageStart+pageCount; i++) {
  contentPage(i);
}
backCover();

function contentPage(index) {
  const bindingLeft = !!(index % 2);
  notebook.addPage(newPageOpts);
  notebook.addSVG(bindingLeft ? leftBindingTemplate : rightBindingTemplate, 0, 0, {
    width: pageWidth,
    height: pageHeight
  });
  notebook.image(qr.imageSync(`1 LTR ${index-1}`, { margin: 0, size: 20 }), (bindingLeft ? 7.375 : 7)*PPI, 9.875*PPI, {width: 0.75*PPI, height: 0.75*PPI});
  notebook.rect((bindingLeft ? 0.5 : 0.125)*PPI, 10.475*PPI, 16+(Math.ceil((notebook.widthOfString(index.toString()))/14.1732288)*14.1732288), 0.4*PPI).fill('white');
  notebook.fillColor(pageNumColor).text(index, (bindingLeft ? 0.5 : 0.125)*PPI + (0.18*PPI), pageHeight - (PPI/3) - (0.18*PPI));
}

function frontCover() {
  notebook.addPage(newPageOpts);
  notebook.addSVG(coverTemplate, 0, 0, {
    width: pageWidth,
    height: pageHeight
  });
  notebook.addPage(newPageOpts);
  notebook.text('Inside front');
}

function backCover() {
  notebook.addPage(newPageOpts);
  notebook.text('Inside back');
  notebook.addPage(newPageOpts);
  notebook.addSVG(coverTemplate, 0, 0, {
    width: pageWidth,
    height: pageHeight
  }); 
}

//FINALIZE + END STREAM
notebook.end();