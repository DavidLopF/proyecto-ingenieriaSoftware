'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Captain extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Captain.belongsTo(models.Competitor, {
        foreignKey: 'competitor_id',
        as: 'competitor'
      });

      Captain.belongsTo(models.Team, {
        foreignKey: 'team_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Captain.init({
    competitor_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Captain',
  });
  return Captain;
};