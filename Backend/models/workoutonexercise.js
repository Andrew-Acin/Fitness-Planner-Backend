'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WorkoutOnExercise extends Model {
    static associate(models) {
      WorkoutOnExercise.belongsTo(models.Workout, { foreignKey: 'workout_id' });
      WorkoutOnExercise.belongsTo(models.Exercise, { foreignKey: 'exercise_id' });
    }
  }
  
  WorkoutOnExercise.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    workout_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Workouts', // Match migration name
        key: 'id',
      }
    },
    exercise_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Exercises', // Match migration name
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: 'WorkoutOnExercise',
    tableName: 'WorkoutOnExercises',
    timestamps: false
  });
  
  return WorkoutOnExercise;
};
