# About
Having toyed around with computer vision in the past and being frustrated with the price and writing experience of existing "smart paper" ecosystems, I decided to develop my own. Currently under the working title of Papier Libéré ("paper, freed" in French), it's still very much still in a prototype state, both in terms of features and code quality, but the site and image importing process is functional!

# Features
- Completely open source!
- All image processing happens locally in a web worker. Google's Firebase is currently used for authentication and eventually cloud storage solutions will be supported as destinations for exporting scans.
- Works great on mobile! (internet is currently required despite caching)
- New document formats can be quite easily added.
- Bicubic adaptive white balance adjusts for partial shading of the scan but preserves colors.
- Formats can include markable icons (eventually to be used for categorization).
- Scannable paper can be printed at home and relatively limited tooling and marginal costs are required to produce your own notebooks! Along with this comes the ability to customize your pages; I went with dots, clean black borders, and a selection of Google's material icons, but the scanning process is quite tolerant to changes!
- QR codes and markable icons are regenerated after a scan so that you can print out documents later, edit them, and then re-scan and re-categorize them with ease.

# Demo
1. Go to [the site](https://www.papierlibere.com/) and log in with a Google account.
2. Download [this photo](https://raw.githubusercontent.com/david476/papier_libere/master/demo/IMG_20181201_014619.jpg) and select it (shown below).
3. Wait for the importing process to finish (it can take a few seconds to load the image and find the QR code before it proceeds). Once complete, the scan is shown and any marked icons are indicated. The detected scan parameters (e.g. format and page corners) can be adjusted in the "Override" menu (currently works best on desktop), and the marked icons can be manually set if needed.
4. Currently, scans can be downloaded from most browsers by right-clicking on the image. Easy downloading, exporting, and multipage-merging are in the works!

# Gallery
The demo's sample image shows off the adaptive white balance quite nicely:
![demo image](https://raw.githubusercontent.com/david476/papier_libere/master/demo/IMG_20181201_014619.jpg)
![scanned demo image](https://raw.githubusercontent.com/david476/papier_libere/master/demo/619-scanned.png)

But white balance doesn't mean it's grayscale!
![scanned demo image](https://raw.githubusercontent.com/david476/papier_libere/master/demo/103-scanned.png)

Here's some of the notebooks I printed at home using 32lb paper and an Ibico Ibimaster 500 for 3:1 wire-o binding. In volumes of 10ish, including the binding machine cost and nice paper, they cost ~30% less than a similar commercially available product and for higher quantities they can be made at home for a few bucks each.
![demo image](https://raw.githubusercontent.com/david476/papier_libere/master/demo/IMG_20181201_021359.jpg)

And finally, my liege waffle recipe if anyone wants it :D
![scanned demo image](https://raw.githubusercontent.com/david476/papier_libere/master/demo/102-scanned.png)
