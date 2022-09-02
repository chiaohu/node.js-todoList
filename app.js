var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");

var serviceAccount = require("./project-f5ca7-firebase-adminsdk-kb1lr-68f8190c2e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://project-f5ca7-default-rtdb.firebaseio.com"
});

var fireData = admin.database()

// fireData.ref('todos').once('value', function(snapshot){
//    console.log(snapshot.val())
// })

// fireData.ref('todos').set({"content":'hello'}).then(function(){
//    fireData.ref('todos').once('value', function(snapshot){
//       console.log(snapshot.val())
//    })
// })

app.engine('ejs',engine);
app.set('views','./views');
app.set('view engine','ejs');
//增加靜態檔案的路徑
app.use(express.static('public'))

// 增加 body 解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

//路由
app.get('/',function(req,res){
   fireData.ref('todos').once('value', function(snapshot){
      var data = snapshot.val()
      res.render('index',{"todolist":data})
   })
})

// 新增邏輯

app.post('/addTodo',function(req,res){
   var content = req.body.content;
   var contentRef = fireData.ref('todos').push();
   contentRef.set({"content":content}).then(function(){
      fireData.ref('todos').once('value',function(snapshot){
         res.send({
            "success" : true,
            "result" : snapshot.val(),
            "message" : '成功'
         })
      })
   })
})

// 刪除邏輯

app.post('/removeTodo',function(req,res){
   var _id = req.body.id;
   fireData.ref('todos').child(_id).remove()
   .then(function(){
      fireData.ref('todos').once('value',function(snapshot){
         res.send({
            "success" : true,
            "result" : snapshot.val(),
            "message" : "資料刪除成功"
         })
      })
   })
})

// 監聽 port
var port = process.env.PORT || 8888;
app.listen(port);