const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models') // 引入資料庫
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT || 3000
// 設定 view engine
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
    helpers: require('./config/handlebars-helpers')
  })
)
app.set('view engine', 'handlebars')
require('dotenv').config()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user // 加這行

  next()
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})
// 引入 routes 並輸入 app 物件 來指定路由
require('./routes')(app)
