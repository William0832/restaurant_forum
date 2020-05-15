const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminServices = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    }).then((restaurants) => callback({ restaurants: restaurants }))
  },
  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exit" })
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
        }).then((restaurant) =>
          callback({
            status: 'success',
            message: 'restaurnat was successfully created'
          })
        )
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
      }).then((restaurant) =>
        callback({
          status: 'success',
          message: 'restaurnat was successfully created'
        })
      )
    }
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category]
    }).then((restaurant) => callback({ restaurant: restaurant.toJSON() }))
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => restaurant.destroy())
      .then(() => callback({ status: 'success', message: '' }))
  },
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true, nest: true }).then((categories) =>
      callback({
        categories: categories
      })
    )
  },
  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: "name didn't exist" })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) =>
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
            .then(() =>
              callback({
                status: 'success',
                message: 'restaurant was successfully to update'
              })
            )
        )
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) =>
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            CategoryId: req.body.categoryId
          })
        )
        .then(() =>
          callback({
            status: 'success',
            message: 'restaurant was successfully to update'
          })
        )
    }
  },
  postCategory: (req, res, callback) => {
    // console.log('=========')
    // console.log(req)
    // console.log('=========')

    if (!req.body.name) {
      return callback({
        status: 'error',
        message: "name didn't exit"
      })
    } else {
      Category.create({
        name: req.body.name
      }).then((category) =>
        callback({
          status: 'success',
          message: `category: ${category.name} was successfully created`
        })
      )
    }
  }
}
module.exports = adminServices
