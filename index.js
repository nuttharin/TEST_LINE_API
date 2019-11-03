const express = require('express');
const line = require('@line/bot-sdk');
const mysql = require('mysql')

require('dotenv').config();

const app = express();

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database : 'my_db'
})

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
})

const config = {
    channelAccessToken: 'dpCgQdEGIbWJLxet0efql4UWyC2pXjupzEMpcqvk6uWlzKu7kreeSaay0Ghz5cwCWUp32LDHmzsUQGzOuyMY0tlS0c/NG51wHmBcficS99bYwmdtRjZbMWISp3WGdSEXLt+34p+hsHFEmVu4ag9W2AdB04t89/1O/w1cDnyilFU=',
    channelSecret: '69e8910e0356694205464aa88367c0e6'
};

const client = new line.Client(config);

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

function handleEvent(event) {

    console.log(event);
    if (event.type === 'message' && event.message.type === 'text') {
        handleMessageEvent(event);
    } else {
        return Promise.resolve(null);
    }
}

function handleMessageEvent(event) {
   
    let message = ''

    var eventText = event.message.text.toLowerCase();

    if (eventText === 'product')
    {
        con.query("SELECT * FROM product_list", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            result.forEach(element => {
              message += "รหัสพนักงาน: "+element.product_name+"\r\n"
              message += "ชื่อพนักงาน: "+element.price+"\r\n"
              message += "วันที่เริ่มงาน: "+element.quantity+"\r\n"
            })
        })
    }
    else if (eventText === 'notebook')
    {
        con.query("SELECT * FROM product_list WHERE product_name LIKE '%"+message+"%'"
        ,function (err, result, fields) 
        {
            if (err) throw err;
            console.log(result);
            result.forEach(element => {
              message += "รหัสพนักงาน: "+element.product_name+"\r\n"
              message += "ชื่อพนักงาน: "+element.price+"\r\n"
              message += "วันที่เริ่มงาน: "+element.quantity+"\r\n"
            })
        })
    }
    else {
        message = "ไม่พบข้อมูลที่ค้นหา "
    }
  
   
  

    return  client.replyMessage(event.replyToken, {
        type: 'text',
        text: message,
    })
}

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
    console.log('run at port', app.get('port'));
});