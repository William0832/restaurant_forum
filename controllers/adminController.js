const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '93d57282fdfc93a'
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category
const fs = require('fs')

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      // 加入關聯資料
      include: [Category]
    }).then((restaurants) => {
      return res.render('admin/restaurants', {
        restaurants: restaurants
      })
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then((categories) => {
      res.render('admin/create', {
        categories: categories
      })
    })
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_message', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then((restaurant) => {
        req.flash('success_message', 'restaurant was successfully created')
        res.redirect('/admin/restaurants')
      })
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      // raw: true,
      // nest: true,
      include: [Category]
    }).then((restaurant) => {
      return res.render('admin/restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  },
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then((categories) => {
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        return res.render('admin/create', {
          categories: categories,
          // 因為 handlebars 只接受一般物件，由toJSON()轉換成一般物件
          restaurant: restaurant.toJSON()
        })
      })
    })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant
            .update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId
            })
            .then((restaurant) => {
              req.flash(
                'success_messages',
                'restaurant was successfully to update'
              )
              res.redirect('/admin/restaurants')
            })
        })
      })
    } else
      return Restaurant.findByPk(req.params.id).then((restaurant) => {
        restaurant
          .update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
          .then((restaurant) => {
            req.flash(
              'success_messages',
              'restaurant was successfully to update'
            )
            res.redirect('/admin/restaurants')
          })
      })
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then((restaurant) => {
      restaurant.destroy()
      res.redirect('/admin/restaurants')
    })
  },
  // getUsers: 顯示使用者清單
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then((users) => {
      return res.render('admin/users', {
        users: users
      })
    })
  },
  // putUsers: 修改使用者權限
  putUsers: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      user.update({ isAdmin: !user.isAdmin }).then((user) => {
        req.flash('success_messages', 'user was sucessfully to update')
        res.redirect('/admin/users')
      })
    })
  }
}
module.exports = adminController
