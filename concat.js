const fs    = require('fs');
const join  = require('path').join;
const argv  =   require('minimist')(process.argv.slice(2));

let apps    = (argv.files || "").split(",");
let output  = "";

apps.forEach((path)=>{
  output += fs.readFileSync(join(__dirname,path),'utf-8');
});

if (!fs.existsSync('bundle')){
    fs.mkdirSync('bundle');
}

fs.writeFileSync( join(__dirname,'bundle',argv.output) ,output);
