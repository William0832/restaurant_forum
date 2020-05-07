const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category }).then((restaurants) => {
      let data = restaurants.map((r) => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50)
        // categoryName: r.Category.name
      }))
      return res.render('restaurants', {
        // handlebars 很像只會檢查第一層的物件是不是特殊物件，第二層之後是特殊物件還是OK
        // restaurants: JSON.parse(JSON.stringify({restaurants:data}))
        restaurants: data
      })
    })
  },
}

module.exports = restController
