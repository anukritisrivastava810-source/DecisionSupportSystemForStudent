const parse = require('@babel/parser').parse;
const fs = require('fs');

try {
  parse(fs.readFileSync('src/App.jsx', 'utf8'), {
    sourceType: 'module',
    plugins: ['jsx']
  });
  console.log("SUCCESS");
} catch (e) {
  if (e.loc) {
    console.error("Syntax Error at line " + e.loc.line + " col " + e.loc.column);
  }
  console.error(e.message);
}
