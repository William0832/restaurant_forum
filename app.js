const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models') // 引入資料庫
const bodyParser = require('body-parser') 

const app = express()
const port = 3000
// 設定 view engine
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
// 引入 routes 並輸入 app 物件 來指定路由
require('./routes')(app)
