// run `node minify-script`

/** improvements, if you're ever bored for some reason (lol)
 * - pass the files you want to minify as args
 * - use Promise.all
 * - use fs & replace the contents of the given file with the contents that it spits back
 */

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

// const filesToMinify = ['./index.html', './css/style.css', './js/script.js'];
const filesToMinify = ['./css/test.css'];

async function minifyStuff(files) {
  // files.map(file => {
  const [err, data] = await tryToCatch(minify, './css/test.css', options);

  if (err) {
    console.error(err.message);
    return;
  }

  // console.log(data);
  // console.log(typeof data);

  fs.writeFile('./css/test.css', data, { encoding: 'utf8', flag: 'w' }, err => {
    if (err) console.error(`nooooo :sob: ${err}`);
    console.log('success! :tada:');
  });
  // });
}
minifyStuff(filesToMinify);
