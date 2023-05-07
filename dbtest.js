const { MongoClient } = require('mongodb');

const url = 'mongodb://192.168.231.128:27017/fido';

async function findUser() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    // 連接資料庫
    await client.connect();

    // 選擇集合
    const collection = client.db().collection('user');

    // 查詢資料
    const items = await collection.find({ name: 'John' }).toArray();

    console.log('Results:\n', JSON.stringify(items, null, 2));
    console.log('We found ' + items.length + ' results!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // 確保在查詢結果返回後關閉連接
    client.close();
  }
}

findUser();
