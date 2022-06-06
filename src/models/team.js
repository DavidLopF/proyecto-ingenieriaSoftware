'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Team.hasMany(models.Competitor, {
        foreignKey: 'team_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      Team.hasOne(models.Captain, {
        foreignKey: 'team_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Team.init({
    team_name: DataTypes.STRING,
    clave_team: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Team',

  });
  return Team;
};