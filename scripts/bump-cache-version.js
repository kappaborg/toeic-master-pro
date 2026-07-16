#!/usr/bin/env node
// Bumps the cache-busting version everywhere it must stay in sync:
//   - every  ?v=<stamp>  asset URL in index.html
//   - CACHE_NAME / DATA_CACHE_NAME in sw.js
// Run before every deploy (deploy.sh calls it automatically):
//   node scripts/bump-cache-version.js

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const swPath = path.join(root, 'sw.js');

const today = new Date();
const datePart = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0')
].join('');

let indexHtml = fs.readFileSync(indexPath, 'utf8');
let sw = fs.readFileSync(swPath, 'utf8');

// Current stamp from index.html, e.g. 20260708g
const current = indexHtml.match(/\?v=(\d{8})([a-z]*)/);
if (!current) {
    console.error('No ?v= stamp found in index.html — aborting.');
    process.exit(1);
}

// Same-day bumps increment the letter suffix: 20260716 -> 20260716b -> 20260716c ...
let suffix = 'a';
if (current[1] === datePart && current[2]) {
    suffix = String.fromCharCode(current[2].charCodeAt(0) + 1);
} else if (current[1] === datePart) {
    suffix = 'b';
}
const stamp = `${datePart}${suffix}`;

const before = (indexHtml.match(/\?v=\d{8}[a-z]*/g) || []).length;
indexHtml = indexHtml.replace(/\?v=\d{8}[a-z]*/g, `?v=${stamp}`);

sw = sw.replace(/const CACHE_NAME = '[^']+'/, `const CACHE_NAME = 'toeic-master-pro-${stamp}'`);
sw = sw.replace(/const DATA_CACHE_NAME = '[^']+'/, `const DATA_CACHE_NAME = 'toeic-data-${stamp}'`);

fs.writeFileSync(indexPath, indexHtml);
fs.writeFileSync(swPath, sw);

console.log(`Bumped cache version to ${stamp} (${before} asset URLs in index.html, CACHE_NAME + DATA_CACHE_NAME in sw.js)`);
