'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Workout extends Model {
    static associate(models) {
      // Define association to User model
      Workout.belongsTo(models.User, { foreignKey: 'created_by' });
    }
  }

  Workout.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type:DataTypes.STRING
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Name of the referenced model (users)
        key: 'id', // Key in the referenced model
      }
    }, 
    scheduled_time: {
      type: DataTypes.DATE, // Sequelize DATE type to store date and time
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Workout',
    tableName: 'Workouts',
    timestamps: false
  });

  return Workout;
};
