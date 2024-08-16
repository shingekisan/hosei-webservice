const express = require('express');
const app = express();
const path = require('node:path')
const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017')
app.set('view engine', 'ejs');
// publicディレクトリ以下のファイルを静的ファイルとして配信
app.use('/static', express.static(path.join(__dirname, 'public')));



const logMiddleware = (req, res, next) => {
  console.log(req.method, req.path);
  next();
}



app.get('/user/:id', logMiddleware,
  (req, res) => {
  // :idをreq.params.idとして受け取る
  res.status(200).send(req.params.id);
});

app.get('/fuga', (req, res) => {
  res.status(200).send('fugafuga\n');
});

const errorMiddleware = (req, res, next) => {
  next(new Error('ミドルウェアからのエラー'));
};
// 包括的エラーハンドリング// 引数が4つ && 最後に定義されている
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});


async function main(){
  // サーバーのlisten前に接続する
  await client.connect();

  const db = client.db('my-app');

  // GET '/' （トップ）アクセス時の挙動
  app.get(
  '/',
  // 追加したミドルウェア
  logMiddleware,
  // 元のミドルウェア
  async (req, res) => {
    //const users = ['alpha', 'beta', 'gamma','たかし'];
    const users = await db.collection('user').find().toArray();
    const names = users.map((user) => { 
      return user.name 
    });

    const days = await db.collection('day').find().toArray();
    const birthdays = days.map((day) => { 
      return day.birthday
    });

    const tels = await db.collection('tel').find().toArray();
    const numbers = tels.map((tel) => { 
      return tel.number
    });
    const keys = await db.collection('key').find().toArray();
    const all_keys = keys.map((key) => { 
      return key.all_key
    });

    const names_li=new Array();
    const birthdays_li=new Array();
    const numbers_li=new Array();
    const all_keys_li=new Array();

    for(let x = 0; x < names.length; x++){
      names_li.push([names[x],all_keys[x]])
    };
    for(let x = 0; x < birthdays.length; x++){
      birthdays_li.push([birthdays[x],all_keys[x]])
    };
    for(let x = 0; x < numbers.length; x++){
      numbers_li.push([numbers[x],all_keys[x]])
    };
    for(let x = 0; x < all_keys.length; x++){
      all_keys_li.push([all_keys[x],all_keys[x]])
    };
    
    res.render(path.join(__dirname, 'views', 'index.ejs'), { users: names_li ,days: birthdays_li ,tels: numbers_li ,keys: all_keys_li});


    //const foods = ['apple','egg','orange'];
    //res.render(path.resolve(__dirname, 'views/index.ejs'),{ users: users, foods:foods });
  });

  async function insertUser(name,all_key){
    if (!name || !all_key) {
      return{status1: 400, body1 :'Bad Request'};
    }
    await db.collection('user').insertOne({ name: name , all_key: all_key });
    return { status1: 200, body1: 'Created' };
  }

  async function insertDay(birthday,all_key){
    if (!birthday || !all_key) {
      return{status2: 400, body2 :'Bad Request'};
    }
    await db.collection('day').insertOne({ birthday: birthday , all_key: all_key });
    return { status2: 200, body2: 'Created' };
  }

  async function insertTel(number,all_key){
    if (!number || !all_key) {
      return{status3: 400, body3 :'Bad Request'};
    }
    await db.collection('tel').insertOne({ number: number , all_key: all_key });
    return { status3: 200, body3: 'Created' };
  }
  async function insertKey(all_key){
    if (!all_key) {
      return{status4: 400, body4 :'Bad Request'};
    }
    await db.collection('key').insertOne({ all_key: all_key });
    return { status4: 200, body4: 'Created' };
  }


  async function removeUser(all_key){
    if (!all_key) {
      return{status1: 400, body1 :'Bad Request'};
    }
    await db.collection('user').deleteMany({ all_key: all_key });
    return { status1: 200, body1: 'Created' };
  }

  async function removeDay(all_key){
    if (!all_key) {
      return{status2: 400, body2 :'Bad Request'};
    }
    await db.collection('day').deleteMany({ all_key: all_key });
    return { status2: 200, body2: 'Created' };
  }

  async function removeTel(all_key){
    if (!all_key) {
      
      return{status3: 400, body3 :'Bad Request'};
    }
    await db.collection('tel').deleteMany({ all_key: all_key });
    return { status3: 200, body3: 'Created' };
  }

  async function removeKey(all_key){
    if (!all_key) {
      return{status4: 400, body4:'Bad Request'};
    }
    await db.collection('key').deleteMany({ all_key: all_key });
    return { status4: 200, body4: 'Created' };
  }


  async function deleteAllUser(){
    await db.collection('user').deleteMany({});
    return { status1: 200, body1: 'Created' };
  }

  async function deleteAllDay(){
    await db.collection('day').deleteMany({});
    return { status2: 200, body2: 'Created' };
  }

  async function deleteAllTel(){
    await db.collection('tel').deleteMany({});
    return { status3: 200, body3: 'Created' };
  }

  async function deleteAllKey(){
    await db.collection('key').deleteMany({});
    return { status4: 200, body4: 'Created' };
  }
  
  
  app.post('/api/user', express.json(), async (req, res) => {
    const name = req.body.name;
    const birthday = req.body.birthday;
    const number = req.body.number;
    const all_key = req.body.all_key;

    const { status1, body1 } = await insertUser(name,all_key);
    const { status2, body2 } = await insertDay(birthday,all_key);
    const { status3, body3 } = await insertTel(number,all_key);
    const { status4, body4 } = await insertKey(all_key);
    
    if(status1===200 && status2===200 && status3===200 && status4===200){
      res.status(status1).send(body1);
    }else{
      res.status(400).send('Bad Request');
    }

  });


  app.post('/api/delete/user', express.json(), async (req, res) => {
    const all_key = req.body.all_key;
    const { status1, body1 } = await removeUser(all_key);
    const { status2, body2 } = await removeDay(all_key);
    const { status3, body3 } = await removeTel(all_key);
    const { status4, body4 } = await removeKey(all_key);
    if(status1===200 && status2===200 && status3===200 && status4===200){
      res.status(status1).send(body1);
    }else{
      res.status(400).send('Bad Request');
    }
  });
  
  app.post('/api/deleteAll/user', express.json(), async (req, res) => {
    const { status1, body1 } = await deleteAllUser();
    const { status2, body2 } = await deleteAllDay();
    const { status3, body3 } = await deleteAllTel();
    const { status4, body4 } = await deleteAllKey();

    if(status1===200 && status2===200 && status3===200 && status4===200){
      res.status(status1).send(body1);
    }else{
      res.status(400).send('Bad Request');
    }
  });



  // ポート: 3000でサーバーを起動
  app.listen(3000, () => {
  // サーバー起動後に呼び出されるCallback
  console.log('start listening');
});
}
main();
