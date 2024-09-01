const fs = require('fs');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Substitui as variáveis de ambiente no arquivo script.js
const scriptJsPath = './script.js';
let scriptJsContent = fs.readFileSync(scriptJsPath, 'utf8');
scriptJsContent = scriptJsContent.replace(/process\.env\.BACKEND_URL/g, `'${process.env.BACKEND_URL}'`);
fs.writeFileSync(scriptJsPath, scriptJsContent);

console.log('Variáveis de ambiente substituídas no arquivo script.js');