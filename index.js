var Caman = require('caman').Caman;

Caman.Filter.register("lineDetect", function () {
  this.processKernel("Line Detect", [
    1, 0, -2, 0, 1,
    1, 0, -2, 0, 1,
    1, 0, -2, 0, 1,
    1, 0, -2, 0, 1,
    1, 0, -2, 0, 1,
  ], 4, 0);
});

Caman("./test.jpg", function () {
  this.resize({
    width: 2159,
    height: 2794
  });
  this.exposure(33);
  this.lineDetect();


  this.render(function () {
    this.save("./test_output.png");
  });
});

