# About
Having toyed around with computer vision in the past and being frustrated with the price and writing experience of existing "smart paper" ecosystems, I decided to develop my own. Currently under the working title of Papier Libéré ("paper, freed" in French), it's still very much still in a prototype state, both in terms of features and code quality, but the image importing process is _fully armed and operational_!

# Demo
1. Go to [the site](https://www.papierlibere.com/) and log in with a Google account.
2. Click 'Select Photos' and either choose this one or take a new photo on mobile.
3. Wait for the importing process to finish (it can take a few seconds to find the QR and then proceeds). Once complete, the scan is shown and any marked icons are indicated. The detected scan parameters (e.g. format and page corners) can be adjusted in the "Override" menu (currently works best on desktop), and the marked icons can be manually set if needed.
4. Currently, scans can be downloaded from most browsers by right-clicking on the image. Easy downloading, exporting, and multipage-merging are in the works!

# Features
- Completely open source!
- All image processing happens locally in a web worker. Google's Firebase is currently used for authentication and eventually cloud storage solutions will be supported as destinations for exporting scans.
- New document formats can be easily added.
- Bicubic adaptive white balance adjusts for partial shading of the scan.
- Formats can include markable icons (eventually to be used for categorization).
- Works great on mobile! (currently, internet is required)
- Scannable paper can be printed at home and relatively limited tooling and marginal costs are required to produce your own notebooks!
- QR code and markable icons are regenerated after a scan so that you can print out documents later, edit them, and then re-scan and re-categorize them with ease.
