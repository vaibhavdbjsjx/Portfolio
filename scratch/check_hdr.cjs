const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/models/char_enviorment.hdr');
const buf = fs.readFileSync(filePath);
console.log("File size:", buf.length);
console.log("First 20 bytes (hex):", buf.toString('hex', 0, 20));
console.log("First 20 bytes (chars):", buf.toString('ascii', 0, 20).replace(/[^ -~]/g, '.'));
