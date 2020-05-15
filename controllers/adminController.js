const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
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
    adminServices.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_message', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
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
    adminServices.putRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminServices.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') res.redirect('/admin/restaurants')
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
    adminServices.postCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/Categories')
    })
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
    adminServices.putCategory(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect('/admin/categories')
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
