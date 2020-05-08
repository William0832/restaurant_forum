const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const restController = {
  getRestaurants: (req, res) => {
    let whereQuery = {}
    if (req.query.categoryId) {
      whereQuery['CategoryId'] = Number(req.query.categoryId)
    }
    Restaurant.findAll({ include: Category, where: whereQuery }).then(
      (restaurants) => {
        const data = restaurants.map((r) => ({
          ...r.dataValues,
          description: r.dataValues.description.substring(0, 50)
        }))
        return Category.findAll({ raw: true, nest: true }).then((categories) =>
          res.render('restaurants', {
            restaurants: data,
            categories: categories
          })
        )
      }
    )
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    }).then((restaurant) =>
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    )
  }
}

module.exports = restController
