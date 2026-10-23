// The page is one self-contained HTML file (images inlined). Building only copies it to dist/.
const { cpSync, mkdirSync, rmSync } = require('node:fs')
rmSync('dist', { recursive: true, force: true })
mkdirSync('dist')
cpSync('index.html', 'dist/index.html')
console.log('dist/index.html ready')
