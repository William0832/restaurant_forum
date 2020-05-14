const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const adminServices = require('../../services/adminServices.js')
const adminController = {
  getRestaurants: (req, res) => {
    adminServices.getRestaurants(req, res, (data) => {
      return res.json(data)
    })
  },
  getRestaurant: (req, res) => {
    adminServices.getRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  getCategories: (req, res) => {
    adminServices.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
  deleteRestaurant: (req, res) => {
    return adminServices.deleteRestaurant(req, res, (data) => {
      return res.json(data)
    })
  },
  postRestaurant: (req, res) => {
    return adminServices.postRestaurant(req, res, (data) => {
      return res.json(data)
    })
  }
}
module.exports = adminController
