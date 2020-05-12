const express = require('express')
const router = express.Router()

const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const commentController = require('../controllers/commentController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const passport = require('../config/passport')

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
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// 前台 show 單一餐廳
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get(
  '/restaurants/:id/dashBoard',
  authenticated,
  restController.getDashboard
)
router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
)
router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.removeFavorite
)
//  like or unlike
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// ===== comment 相關 =====
router.post('/comments', authenticated, commentController.postComment)
router.delete(
  '/comments/:id',
  authenticatedAdmin,
  commentController.deleteComment
)
// 後臺路由
router.get('/admin', authenticatedAdmin, (req, res) =>
  res.redirect('/admin/restaurants')
)
// ===== Restaurant 相關 =====
router.get(
  '/admin/restaurants',
  authenticatedAdmin,
  adminController.getRestaurants
)
// 新增餐廳
router.get(
  '/admin/restaurants/create',
  authenticatedAdmin,
  adminController.createRestaurant
)
router.post(
  '/admin/restaurants',
  authenticatedAdmin,
  upload.single('image'),
  adminController.postRestaurant
)
router.get(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  adminController.getRestaurant
)
router.get(
  '/admin/restaurants/:id/edit',
  authenticatedAdmin,
  adminController.editRestaurant
)
router.put(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  upload.single('image'),
  adminController.putRestaurant
)
router.delete(
  '/admin/restaurants/:id',
  authenticatedAdmin,
  adminController.deleteRestaurant
)
//====== User 相關 ======
// user 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/logout', userController.logout)
// 顯示 users
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
// 修改 user 權限
router.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)

router.get('/users/top', authenticated, userController.getTopUser)
// user profile
router.get('/users/:id', authenticated, userController.getUser)
router.get(
  '/users/:id/edit',
  authenticated,
  isRightUser,
  userController.editUser
)
router.put(
  '/users/:id',
  authenticated,
  upload.single('image'),
  userController.putUser
)

//====== Category 相關 ======
router.get(
  '/admin/categories',
  authenticatedAdmin,
  adminController.getCategories
)
router.post(
  '/admin/categories',
  authenticatedAdmin,
  adminController.postCategory
)
router.get(
  '/admin/categories/:id',
  authenticatedAdmin,
  adminController.getCategory
)
router.put(
  '/admin/categories/:id',
  authenticatedAdmin,
  adminController.putCategory
)
router.delete(
  '/admin/categories/:id',
  authenticatedAdmin,
  adminController.deleteCategory
)
// user follow
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete(
  '/following/:userId',
  authenticated,
  userController.removeFollowing
)
module.exports = router
