const pdf = require('pdfjs');
const fs = require('fs');

const PPI = 72;

//CONFIG
const pageWidth = 612;
const pageHeight = 792;
const contentPages = 100;//Actual sheets of paper is half this.
const bindingMargin = 0.375 * PPI;
const contentPageTemplate = new pdf.Image(fs.readFileSync('./assets/page-dot_grid-1.pdf'));

const notebook = new pdf.Document({
  width: pageWidth,
  height: pageHeight,
  padding: 0,
});

//GENERATE
frontCover();
for(var i = 1; i <= contentPages; i++) {
  contentPage(i);
}
backCover();

//SAVE
notebook.asBuffer((err, data) => {
  if (err) {
    console.error(err)
  } else {
    fs.writeFileSync('notebook.pdf', data, { encoding: 'binary' })
  }
})

function contentPage(index) {
  const bindingLeft = !!(index % 2);
  notebook.pageBreak();
  //notebook.text(`Content page: ${index}, binding: ${bindingLeft ? 'left' : 'right'}`);
  //notebook.image(contentPageTemplate);
}

function frontCover() {
  notebook.text('Outside Front Cover');
  notebook.pageBreak();
  notebook.text('Inside Front Cover');
}

function backCover() {
  notebook.text('Inside Back Cover');
  notebook.pageBreak();
  notebook.text('Outside Back Cover');
}