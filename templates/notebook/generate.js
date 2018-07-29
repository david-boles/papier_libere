const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');
const fs = require('fs');
const qr = require('qr-image');
PDFDocument.prototype.addSVG = function(svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options), this;
};

const PPI = 72;

//CONFIG
const pageStart = 9999999;//What page index to start on, should be odd.
const pageCount = 2;//Should be even (actual sheets of paper is half this).
const pageNumColor = '#c0c0c0';
const cuttingTemplate = fs.readFileSync('./assets/cutting_template.svg').toString();
const leftBindingTemplate = fs.readFileSync('./assets/page-dotted-left_binding.svg').toString();
const rightBindingTemplate = fs.readFileSync('./assets/page-dotted-right_binding.svg').toString();

//GENERATE
const pages = new PDFDocument({autoFirstPage: false});
pages.pipe(fs.createWriteStream('./notebook_pages.pdf'));
pages.fontSize(PPI/3)
for(var i = pageStart; i < pageStart+pageCount; i++) {
  contentPage(i);
}
pages.end();

function contentPage(index) {
  const bindingLeft = !!(index % 2);
  pages.addPage({size: [8.5*PPI, 11*PPI], margin: 0});

  pages.addSVG(cuttingTemplate, 0, 0, {
    width: 8.5*PPI,
    height: 11*PPI
  });

  pages.addSVG(bindingLeft ? leftBindingTemplate : rightBindingTemplate, 0.5*PPI, 0.5*PPI, {
    width: 7.5*PPI,
    height: 10*PPI
  });

  pages.image(qr.imageSync(`1 ${index}`, { ec_level: 'H', margin: 0, size: 20 }),  ((bindingLeft ? 6.875 : 6.5)*PPI), 9.375*PPI, {width: 0.75*PPI, height: 0.75*PPI});

  pages.rect(((bindingLeft ? 1 : 0.625)*PPI)+6, 9.975*PPI, 10+(Math.ceil((pages.widthOfString(index.toString()))/14.1732288)*14.1732288), 24).fill('white');
  pages.fillColor(pageNumColor).text(index, (bindingLeft ? 1 : 0.625)*PPI + (0.18*PPI), (10.5*PPI) - (PPI/3) - (0.18*PPI));
}