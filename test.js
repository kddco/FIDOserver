const jsonStr = '{"r":"ff81a9b24f49055e02022fb9830128aef1243615d65aa0841e6a53b87a20c8ce","s":"2ce0db9edd6a5d88c4a4441c4d441ca9e4481201b23d4bca3518aee657197be0","recoveryParam":0}';

const obj = jsonStr.slice(1, -1);
console.log(obj);