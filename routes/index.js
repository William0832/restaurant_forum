const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const commentController = require('../controllers/commentController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  const isRightUser = (req, res, next) => {
    if (req.user.id == req.params.id) {
      return next()
    }
    req.flash('error_messages', '沒有修改權限')
    return res.redirect(`/users/${req.params.id}`)
  }

  // 前台路由
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  // 前台 show 單一餐廳
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  app.get(
    '/restaurants/:id/dashBoard',
    authenticated,
    restController.getDashboard
  )
  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete(
    '/favorite/:restaurantId',
    authenticated,
    userController.removeFavorite
  )
  //  like or unlike
  app.post('/like/:restaurantId', authenticated, userController.addLike)
  app.delete('/like/:restaurantId', authenticated, userController.removeLike)

  // ===== comment 相關 =====
  app.post('/comments', authenticated, commentController.postComment)
  app.delete(
    '/comments/:id',
    authenticatedAdmin,
    commentController.deleteComment
  )
  // 後臺路由
  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('/admin/restaurants')
  )
  // ===== Restaurant 相關 =====
  app.get(
    '/admin/restaurants',
    authenticatedAdmin,
    adminController.getRestaurants
  )
  // 新增餐廳
  app.get(
    '/admin/restaurants/create',
    authenticatedAdmin,
    adminController.createRestaurant
  )
  app.post(
    '/admin/restaurants',
    authenticatedAdmin,
    upload.single('image'),
    adminController.postRestaurant
  )
  app.get(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.getRestaurant
  )
  app.get(
    '/admin/restaurants/:id/edit',
    authenticatedAdmin,
    adminController.editRestaurant
  )
  app.put(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    upload.single('image'),
    adminController.putRestaurant
  )
  app.delete(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.deleteRestaurant
  )
  //====== User 相關 ======
  // user 註冊
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signIn
  )
  app.get('/logout', userController.logout)
  // 顯示 users
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  // 修改 user 權限
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)

  app.get('/users/top', authenticated, userController.getTopUser)
  // user profile
  app.get('/users/:id', authenticated, userController.getUser)
  app.get(
    '/users/:id/edit',
    authenticated,
    isRightUser,
    userController.editUser
  )
  app.put(
    '/users/:id',
    authenticated,
    upload.single('image'),
    userController.putUser
  )

  //====== Category 相關 ======
  app.get(
    '/admin/categories',
    authenticatedAdmin,
    adminController.getCategories
  )
  app.post(
    '/admin/categories',
    authenticatedAdmin,
    adminController.postCategory
  )
  app.get(
    '/admin/categories/:id',
    authenticatedAdmin,
    adminController.getCategory
  )
  app.put(
    '/admin/categories/:id',
    authenticatedAdmin,
    adminController.putCategory
  )
  app.delete(
    '/admin/categories/:id',
    authenticatedAdmin,
    adminController.deleteCategory
  )
}
