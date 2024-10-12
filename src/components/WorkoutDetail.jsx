import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function WorkoutDetail() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const foundWorkout = savedWorkouts.find(w => w.id === parseInt(id));
    setWorkout(foundWorkout);
  }, [id]);

  if (!workout) return <p className="text-xl text-center mt-8">Workout not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">{workout.name}</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {workout.exercises.map((exercise, index) => (
          <div key={index} className="border-b last:border-b-0 p-6">
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={exercise.gifUrl} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
                <p className="text-gray-600 mb-1">Target: {exercise.target}</p>
                <p className="text-gray-600 mb-1">Equipment: {exercise.equipment}</p>
                <p className="text-lg font-medium mt-2">
                  {exercise.sets} sets x {exercise.reps} reps
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link
        to="/"
        className="mt-8 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors"
      >
        Back to Workouts
      </Link>
    </div>
  );
}

export default WorkoutDetail;