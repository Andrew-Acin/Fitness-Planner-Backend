'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Exercise extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Exercise.init({
    id: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type:DataTypes.STRING
    },
    type: {
      type:DataTypes.STRING
    },
    muscle: {
      type:DataTypes.STRING
    },
    equipment: {
      type:DataTypes.STRING
    },
    difficulty: {
      type:DataTypes.STRING
    },
    instructions: {
      type:DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Exercise',
    tableName: 'Exercises',
    timestamps: false
  });
  return Exercise;
};