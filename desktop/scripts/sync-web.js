#!/usr/bin/env node
// Copies the web app into desktop/dist for the Tauri bundle.
// The desktop app ships the SAME code as the website — this script is the
// only "build step": copy, then strip cache-busting query strings that
// mean nothing when files load from disk.

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..', '..');
const dist = path.join(__dirname, '..', 'dist');

const INCLUDE = [
    'index.html',
    'login.html',
    'favicon.ico',
    'manifest.json',
    'assets'
];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

let files = 0;
const copy = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
        if (path.basename(src) === '.DS_Store') return;
        fs.mkdirSync(dest, { recursive: true });
        for (const entry of fs.readdirSync(src)) {
            if (entry === '.DS_Store') continue;
            copy(path.join(src, entry), path.join(dest, entry));
        }
    } else {
        fs.copyFileSync(src, dest);
        files++;
    }
};

for (const item of INCLUDE) {
    const src = path.join(repoRoot, item);
    if (!fs.existsSync(src)) {
        console.error(`Missing: ${item}`);
        process.exit(1);
    }
    copy(src, path.join(dist, item));
}

// Local files don't need cache-busting; keeping the ?v= would just make
// the custom-protocol asset resolver work harder
for (const page of ['index.html', 'login.html']) {
    const p = path.join(dist, page);
    fs.writeFileSync(p, fs.readFileSync(p, 'utf8').replace(/\?v=\d{8}[a-z]*/g, ''));
}

console.log(`Synced ${files} files into desktop/dist`);
