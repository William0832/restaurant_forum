const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '93d57282fdfc93a'
const db = require('../models')
const fs = require('fs')
const User = db.User
const Restaurant = db.Restaurant
const Category = db.Category

const adminServices = require('../services/adminServices')

const adminController = {
  getRestaurants: (req, res) => {
    adminServices.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
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
    adminServices.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
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
  // User:
  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then((users) => {
      return res.render('admin/users', {
        users: users
      })
    })
  },
  putUsers: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => user.update({ isAdmin: !user.isAdmin }))
      .then(() => {
        req.flash('success_messages', 'user was sucessfully to update')
        res.redirect('/admin/users')
      })
  },
  // Category:
  getCategories: (req, res) => {
    adminServices.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exit")
      return res.redirect('back')
    } else {
      Category.create({
        name: req.body.name
      }).then((category) => {
        req.flash(
          'success_messages',
          `category: ${category.name} was successfully created`
        )
        res.redirect('/admin/categories')
      })
    }
  },
  getCategory: (req, res) => {
    Category.findAll({
      // 轉成一般物件的指令
      raw: true,
      nest: true
    }).then((categories) => {
      return Category.findByPk(req.params.id).then((category) => {
        return res.render('admin/categories', {
          // .findByPk 找到的資料才能用 .toJSON() 轉成一般物件
          category: category.toJSON(),
          categories: categories
        })
      })
    })
  },
  putCategory: (req, res) => {
    return Category.findByPk(req.params.id).then((category) => {
      category.update({ name: req.body.name })
      res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id).then((category) => {
      req.flash(
        'success_messages',
        `category: ${category.name} was successfully deleted`
      )
      category.destroy()
      return res.redirect('back')
    })
  }
}
module.exports = adminController
