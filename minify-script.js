// run `node minify-script`

import { minify } from 'minify';
import tryToCatch from 'try-to-catch';
import fs from 'fs';

const options = {
  html: {
    removeAttributeQuotes: false,
    removeOptionalTags: false,
  },
  css: {
    compatibility: '*',
  },
  js: {
    ecma: 5,
  },
};

const filesToMinify = ['./index.html', './css/style.css'];
// minifying JS causes weird sht to happen 😨

async function minifyStuff(files) {
  files.forEach(async file => {
    const [err, data] = await tryToCatch(minify, file, options);

    if (err) {
      console.error(err.message);
      return;
    }

    // console.log(data);
    // console.log(typeof data);

    fs.writeFile(file, data, { encoding: 'utf8', flag: 'w' }, err => {
      if (err) console.error(`nooooo :sob: ${err}`);
      console.log(`success: ${file} has been minified.`);
    });
  });
}
minifyStuff(filesToMinify);
