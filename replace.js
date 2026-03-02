const fs = require('fs');

const file = 'src/components/jade-bar/JadeBarBuilder.tsx';
let lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
let comp = fs.readFileSync('newComponent.txt', 'utf8');

lines.splice(207, 118, comp);
fs.writeFileSync(file, lines.join('\n'));
console.log('Successfully replaced SelectionGrid');
