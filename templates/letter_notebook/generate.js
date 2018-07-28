const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');
const fs = require('fs');
const qr = require('qr-image');
PDFDocument.prototype.addSVG = function(svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options), this;
};

const PPI = 72;

//CONFIG
const bleedMargin = 0.25*PPI
const doubleBleedMargin = 2*bleedMargin;
const pageWidth = 612 + doubleBleedMargin;
const pageHeight = 792 + doubleBleedMargin;
const pageStart = 1;//What page index to start on, should be odd.
const pageCount = 2;//Should be even (actual sheets of paper is half this).
const newPageOpts = {size: [pageWidth, pageHeight],margin: 0}
const insideCoverColor = '#404040';
const pageNumColor = '#c0c0c0';
const coverTemplate = fs.readFileSync('./assets/cover-with_bleed.svg').toString();
const leftBindingTemplate = fs.readFileSync('./assets/page-dot_grid-left_binding-with_bleed.svg').toString();
const rightBindingTemplate = fs.readFileSync('./assets/page-dot_grid-right_binding-with_bleed.svg').toString();

//Generate
const notebook = new PDFDocument({autoFirstPage: false});
notebook.pipe(fs.createWriteStream('./notebook-with_bleed-fixed.pdf'));

frontCover();
notebook.fontSize(PPI/3)
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
  notebook.image(qr.imageSync(`1 ${index}`, { ec_level: 'H', margin: 0, size: 20 }), bleedMargin + ((bindingLeft ? 7.375 : 7)*PPI), (9.875*PPI)+bleedMargin, {width: 0.75*PPI, height: 0.75*PPI});
  notebook.rect(bleedMargin+((bindingLeft ? 0.5 : 0.125)*PPI)+6, (10.475*PPI)+bleedMargin, 10+(Math.ceil((notebook.widthOfString(index.toString()))/14.1732288)*14.1732288), 24).fill('white');
  notebook.fillColor(pageNumColor).text(index, (bindingLeft ? 0.5 : 0.125)*PPI + (0.18*PPI) + bleedMargin, pageHeight - (PPI/3) - (0.18*PPI) - bleedMargin);
}

function frontCover() {
  notebook.addPage(newPageOpts);
  notebook.addSVG(coverTemplate, 0, 0, {
    width: pageWidth,
    height: pageHeight
  });
  notebook.addPage(newPageOpts);
  notebook.fontSize(PPI/5).fillColor(insideCoverColor).text('David Boles\nme@davidbol.es\n(415) 825-2464\n\n\n\n\n\n\nstart date: ______\nend date: ______', 0 + bleedMargin, (2.75*PPI)+bleedMargin, {
    width: 8.125*PPI,
    align: 'center',
    lineGap: 0.375*PPI
  });
}

function backCover() {
  notebook.addPage(newPageOpts);
  notebook.addPage(newPageOpts);
  notebook.addSVG(coverTemplate, 0, 0, {
    width: pageWidth,
    height: pageHeight
  });

  notebook.image(qr.imageSync('https://github.com/david476/papier_libere', { margin: 0, size: 20 }), (7*PPI)+bleedMargin, (9.875*PPI)+bleedMargin, {width: 0.75*PPI, height: 0.75*PPI});
}

//FINALIZE + END STREAM
notebook.end();