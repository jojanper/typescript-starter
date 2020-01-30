/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const fs = require('fs');
const path= require('path');

if (process.argv.length < 4) {
    console.log('Usage: node build_html.js <dist-folder> <ref_html> <template_html>');
    process.exit(1);
}

function getAttributeValue(attribute, source)
{
    const vals = [];
    const regex = RegExp(`<script?\\w+(?:\\s+(?:${attribute}=\"([^\"]*)\")|[^\\s>]+|\\s+)*>`, 'gi');

    let matches;
    while (matches = regex.exec(source)) {
        vals.push(matches[1].split('.')[0]);
    }

    return vals;
}

const files = fs.readdirSync(path.normalize(process.argv[2]), {encoding: 'utf8'});

const modernFiles = files.filter(name => /\.mjs$/.test(name));
const legacyFiles = files.filter(name => /\.js$/.test(name));

const templateHtml = fs.readFileSync(path.normalize(process.argv[4]), {encoding: 'utf8'});

const inputHtml = fs.readFileSync(path.normalize(process.argv[3]), {encoding: 'utf8'});
const srcs = getAttributeValue('src', inputHtml);


const modernScripts = srcs.map(prefix => {
    const data = modernFiles.filter(item => item.startsWith(prefix));
    return `<script type="module" src="${data[0]}"></script>`;
}).join('');

const legacyScripts = srcs.map(prefix => {
    const data = legacyFiles.filter(item => item.startsWith(prefix));
    return `<script defer nomodule src="${data[0]}"></script>`;
}).join('');


const htmlFinal = templateHtml.replace('{ script-template }', modernScripts + legacyScripts);

fs.writeFileSync(path.normalize(process.argv[3]), htmlFinal);
