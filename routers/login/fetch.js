//test only
const fetch = require('node-fetch');
function request(displayName,name){
    fetch("http://127.0.0.1:3344/internaltoken?"+"displayName=" + displayName + "&name=" + name)
    .then(response => response.json())
    .then(data => {
        console.log(data); // 處理伺服器回應的資料
    })
    .catch(error => {
        console.error('發生錯誤:', error);
    });
}

request("Test_displayName","Test_name")

module.exports = {
    request: request
  };
  