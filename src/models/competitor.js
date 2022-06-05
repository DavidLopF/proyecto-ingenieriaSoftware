'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Competitor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Competitor.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      Competitor.hasOne(models.Captain, {
        foreignKey: 'competitor_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      Competitor.belongsTo(models.Team, {
        foreignKey: 'team_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Competitor.init({
    user_id: DataTypes.INTEGER,
    languaje: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Competitor',
  });
  return Competitor;
};