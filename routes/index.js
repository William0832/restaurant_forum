const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

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

  // 前台路由
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  // 後臺路由
  app.get('/admin', authenticatedAdmin, (req, res) =>
    res.redirect('/admin/restaurants')
  )
  app.get(
    '/admin/restaurants',
    authenticatedAdmin,
    adminController.getRestaurants
  )
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
  // 新增餐廳
  app.get(
    '/admin/restaurants/create',
    authenticatedAdmin,
    adminController.createRestaurant
  )
  app.post(
    '/admin/restaurants',
    authenticatedAdmin,
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
    adminController.putRestaurant
  )
  app.delete(
    '/admin/restaurants/:id',
    authenticatedAdmin,
    adminController.deleteRestaurant
  )
}
