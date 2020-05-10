'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isAdmin: DataTypes.BOOLEAN,
      image: DataTypes.STRING
    },
    {}
  )
  User.associate = function (models) {
    User.hasMany(models.Comment)
    User.belongsToMany(model.Restaurant, {
      throught: models.Favorite,
      foreignKey: 'UserId',
      as: 'FavoritedRestaurants'
    })
  }
  return User
}
