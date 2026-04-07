const parse = require('@babel/parser').parse;
const fs = require('fs');
const code = fs.readFileSync('src/App.jsx', 'utf8');

try {
  parse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
} catch (e) {
  if (e.loc) {
    const lines = code.split('\n');
    const errLine = e.loc.line - 1;
    console.error("Error at line:", errLine + 1, "col:", e.loc.column);
    console.error("Line text:", JSON.stringify(lines[errLine]));
    console.error("Prev text:", JSON.stringify(lines[errLine-1]));
    console.error("Prev prev text:", JSON.stringify(lines[errLine-2]));
  }
  console.error(e.message);
}
