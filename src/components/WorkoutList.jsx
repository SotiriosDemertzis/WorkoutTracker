import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function WorkoutList() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = () => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    setWorkouts(savedWorkouts);
  };

  const deleteWorkout = (id) => {
    const updatedWorkouts = workouts.filter(workout => workout.id !== id);
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    loadWorkouts();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">My Workouts</h2>
      {workouts.length === 0 ? (
        <p className="text-xl text-gray-600">No workouts saved yet. Create your first workout!</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <div key={workout.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-2xl font-semibold mb-4">{workout.name}</h3>
                <div className="space-y-4">
                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={exercise.gifUrl} 
                          alt={exercise.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-sm">{exercise.name}</h4>
                        <p className="text-xs text-gray-600">
                          {exercise.sets} sets x {exercise.reps} reps
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                {workout.exercises.length > 3 && (
                  <p className="mt-4 text-sm text-gray-600 italic">
                    +{workout.exercises.length - 3} more exercises
                  </p>
                )}
              </div>
              <div className="flex border-t mt-auto">
                <Link
                  to={`/workout/${workout.id}`}
                  className="flex-1 bg-blue-500 text-white text-center py-2 font-semibold hover:bg-blue-600 transition-colors"
                >
                  View
                </Link>
                <button
                  onClick={() => navigate(`/edit-workout/${workout.id}`)}
                  className="flex-1 bg-yellow-500 text-white text-center py-2 font-semibold hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteWorkout(workout.id)}
                  className="flex-1 bg-red-500 text-white text-center py-2 font-semibold hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Link
        to="/create-workout"
        className="mt-8 inline-block bg-green-500 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors"
      >
        Create New Workout
      </Link>
    </div>
  );
}

export default WorkoutList;