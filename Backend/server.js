const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables from .env
const { Workout, Exercise, WorkoutOnExercise } = require('./models');


// Connect to database using environment variables
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

const app = express();
const port = 5000;

// Test Sequelize connection
sequelize.authenticate()
  .then(() => {
    console.log('Sequelize connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Apply CORS middleware before routes
app.use(cors({
    origin: 'https://fitness-frontend-production-7999.up.railway.app', 
    methods: 'GET,POST,PUT,DELETE', 
}));

// Body Parser Middleware
app.use(bodyParser.json()); 

// API Ninjas fetch requests from here to frontend SearchExercise.js
app.get('/api/exercise', async (req, res) => {
  const muscle = req.query.muscle; // Extract muscle from the query string
  const apiKey = process.env.API_NINJAS_KEY;
  const apiUrl = `https://api.api-ninjas.com/v1/exercises?muscle=${muscle}`;

  if (!muscle) {
    return res.status(400).json({ error: 'Muscle parameter is required' });
  }

  try {
    // First, try to fetch exercises from the database
    let exercises = await Exercise.findAll({ where: { muscle } });

    // If no exercises are found in the database, fetch from API
    if (exercises.length === 0) {
      console.log(`No exercises found for muscle: ${muscle}. Fetching from API...`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching exercises from API: ${response.statusText}`);
      }

      const apiData = await response.json();

      // Optionally, store fetched exercises in the database for future use
      exercises = await Promise.all(apiData.map(async (ex) => {
        const newExercise = await Exercise.create({
          name: ex.name,
          type: ex.type,
          muscle: ex.muscle,
          equipment: ex.equipment,
          difficulty: ex.difficulty,
          instructions: ex.instructions,
        });
        return newExercise;
      }));
    }

    // Return exercises (either from database or API)
    res.json(exercises);
  } catch (error) {
    console.error('Error fetching exercise:', error);
    res.status(500).json({ error: 'Unable to fetch data' });
  }
});


app.post('/api/exercise', async (req, res) => {
  const {name, type, muscle, equipment, difficulty, instructions} = req.body;

  if (!name || !type || !muscle || !equipment || !difficulty || !instructions) {
  return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const newExercise = await Exercise.create({
      name,
      type,
      muscle,
      equipment,
      difficulty,
      instructions,
    })

    res.status(201).json(newExercise);
  } catch (error) {
    console.error('Error saving exercise', error);
    res.status(500).json({ error: 'Failed to save the exercise'})
  }
})


// API Routes for workout creation
app.post('/api/workouts', async (req, res) => {
  const { name, exercises, scheduled_time } = req.body;

  console.log('Data received from frontend:', req.body);

  try {
    // Check if start_time and end_time are provided and in the correct format
    if (!name || !scheduled_time) {
      return res.status(400).json({ error: 'Name, start_time, and end_time are required' });
    }

    // Create a new workout
    const newWorkout = await Workout.create({
      name,
      created_by: 1, 
      scheduled_time: new Date(scheduled_time)
    });

    // Ensure that exercises array is not empty
    if (exercises && exercises.length > 0) {
      for (const ex of exercises) {
        let exercise = await Exercise.findOne({
          where: {
            name: ex.name,
            type: ex.type,
            muscle: ex.muscle,
            equipment: ex.equipment,
            difficulty: ex.difficulty,
          },
        });

        if (!exercise) {
          exercise = await Exercise.create({
            name: ex.name,
            type: ex.type,
            muscle: ex.muscle,
            equipment: ex.equipment,
            difficulty: ex.difficulty,
          });
        }

        // Link the exercise to the workout
        await WorkoutOnExercise.create({
          workout_id: newWorkout.id,
          exercise_id: exercise.id,
        });
      }
    }

    res.status(201).json(newWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create workout with exercises' });
  }
});


// API Route to fetch all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const workouts = await Workout.findAll(); // Fetch all workouts from the database
    res.status(200).json(workouts); // Send the workouts as JSON
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// API Routes for login and signup
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Backend server running on https://fitness-backend-production-d337.up.railway.app:${port}`);
});
