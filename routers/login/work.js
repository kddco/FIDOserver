const fetch = require('isomorphic-fetch');


function request(displayName, name) {
  return new Promise((resolve, reject) => {
    console.log(displayName, name);
    fetch(`http://127.0.0.1:3344/internaltoken?displayName=${displayName}&name=${name}`)
      .then((response) => response.text())
      .then((text) => {
        console.log(text);
        resolve();
      })
      .catch((error) => {
        console.error('發生錯誤:', error);
        reject(error);
      });
  });
}

const displayName = process.argv[2];
const name = process.argv[3];

request(displayName, name)
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('发生错误:', error);
    process.exit(1);
  });
