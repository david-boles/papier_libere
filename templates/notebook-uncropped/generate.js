const PDFDocument = require('pdfkit');
const SVGtoPDF = require('svg-to-pdfkit');
const fs = require('fs');
const qr = require('qr-image');
PDFDocument.prototype.addSVG = function(svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options), this;
};

const PPI = 72;

//CONFIG
const name = 'Elisa Boles';
const contactInfo = 'elisalboles@gmail.com';
const pageStart = 1;//What page index to start on, should be odd.
const pageCount = 100;//Should be even (actual sheets of paper is half this).
const textColor = '#bfbfbf';
const leftBindingTemplate = fs.readFileSync('./assets/page-dotted-left_binding.svg').toString();
const rightBindingTemplate = fs.readFileSync('./assets/page-dotted-right_binding.svg').toString();
const cardScanTemplate = fs.readFileSync('./assets/card_scan.svg').toString();

//GENERATE
const pages = new PDFDocument({autoFirstPage: false});
pages.pipe(fs.createWriteStream(`/home/deb/Temp/elisa-notebook_pages-uncropped-${pageStart}-${pageStart+pageCount-1}.pdf`));
pages.fontSize(PPI/3);
firstPage();
for(var i = pageStart; i < pageStart+pageCount; i++) {
  contentPage(i);
}
cardScanPage();
pages.end();

function firstPage() {
  pages.addPage({size: [8.5*PPI, 11*PPI], margin: 0});
  pages.fillColor(textColor).text(name, 0.375*PPI, (11 - 0.25 - 0.6666)*PPI);
  pages.fillColor(textColor).text(contactInfo, 0.375*PPI, (11 - 0.25 - 0.3333)*PPI);
  const pagesText = `${pageStart}-${pageStart+pageCount-1}`;
  pages.fillColor(textColor).text(pagesText, 8.25*PPI - pages.widthOfString(pagesText), (11 - 0.25 - 0.3333)*PPI);
  pages.image(qr.imageSync(`https://www.papierlibere.com/`, { ec_level: 'H', margin: 0, size: 40 }),  3.5625*PPI, 3.4375*PPI, {width: 1.5*PPI, height: 1.5*PPI});
  pages.flushPages();
}

function contentPage(index) {
  const bindingLeft = !(index % 2);
  pages.addPage({size: [8.5*PPI, 11*PPI], margin: 0});

  pages.addSVG(bindingLeft ? leftBindingTemplate : rightBindingTemplate, 0, 0, {
    width: 8.5*PPI,
    height: 11*PPI
  });

  pages.image(qr.imageSync(`2 ${index}`, { ec_level: 'H', margin: 0, size: 20 }),  ((bindingLeft ? 7.125 : 7)*PPI), 9.625*PPI, {width: 0.75*PPI, height: 0.75*PPI});

  pages.rect(((bindingLeft ? 0.5 : 0.375)*PPI)+6, 10.275*PPI, 10+(Math.ceil((pages.widthOfString(index.toString()))/14.1732288)*14.1732288), 24).fill('white');
  pages.fillColor(textColor).text(index, (bindingLeft ? 0.5 : 0.375)*PPI - 3 + (0.18*PPI), (10.75*PPI) - (PPI/3) - (0.13*PPI));
  pages.flushPages();
}

function cardScanPage() {
  pages.addPage({size: [8.5*PPI, 11*PPI], margin: 0});
  pages.addSVG(cardScanTemplate, 0, 0, {
    width: 8.5*PPI,
    height: 11*PPI
  });
  pages.fillColor(textColor).text('business', (0.625 + 0.031 + 0.25)*PPI, (3.875 - 0.031 - 0.25)*PPI);
  pages.image(qr.imageSync(`3 USBNS P`, { ec_level: 'H', margin: 0, size: 20 }),  1.875*PPI, 4.375*PPI, {width: 0.75*PPI, height: 0.75*PPI});
  pages.fillColor(textColor).text('standard', (3.875 + 0.031 + 0.25)*PPI, (3.875 - 0.031 - 0.25)*PPI);
  pages.image(qr.imageSync(`3 STNDRD P`, { ec_level: 'H', margin: 0, size: 20 }),  5.25*PPI, 4.375*PPI, {width: 0.75*PPI, height: 0.75*PPI});
  pages.fillColor(textColor).text('index', (1.125 + 0.031 + 0.25)*PPI, (9.625 - 0.031 - 0.25)*PPI);
  pages.image(qr.imageSync(`3 INDEX L`, { ec_level: 'H', margin: 0, size: 20 }),  6.875*PPI, 9.625*PPI, {width: 0.75*PPI, height: 0.75*PPI});
  pages.flushPages();
}