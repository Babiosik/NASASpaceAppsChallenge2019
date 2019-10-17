const fs = require('fs');

let rd = fs.readdirSync('./');
let arr = [];
rd.forEach((fname, _, __) => {
    arr.push({
        filename: fname,
        scale: 1,
        texture: '',
    });
});
fs.writeFileSync('./index.json', JSON.stringify(arr, null, '\t'));
console.log(rd);