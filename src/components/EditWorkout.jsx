import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { searchExercises } from '../api/exerciseDb';

function EditWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const foundWorkout = savedWorkouts.find(w => w.id === parseInt(id));
    setWorkout(foundWorkout);
  }, [id]);

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim()) {
        setLoading(true);
        setError(null);
        try {
          const data = await searchExercises(query);
          setSearchResults(data);
        } catch (err) {
          setError('Failed to search exercises. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
    []
  );

  const updateWorkout = (updatedWorkout) => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    const updatedWorkouts = savedWorkouts.map(w => 
      w.id === updatedWorkout.id ? updatedWorkout : w
    );
    localStorage.setItem('workouts', JSON.stringify(updatedWorkouts));
    navigate('/');
  };

  const handleNameChange = (e) => {
    setWorkout({ ...workout, name: e.target.value });
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = workout.exercises.map((ex, i) => 
      i === index ? { ...ex, [field]: value } : ex
    );
    setWorkout({ ...workout, exercises: updatedExercises });
  };

  const removeExercise = (index) => {
    const updatedExercises = workout.exercises.filter((_, i) => i !== index);
    setWorkout({ ...workout, exercises: updatedExercises });
  };

  const addExercise = (exercise) => {
    setWorkout({
      ...workout,
      exercises: [...workout.exercises, { ...exercise, sets: 3, reps: 10 }]
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  if (!workout) return <p className="text-xl text-center mt-8">Workout not found</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Edit Workout</h2>
      <input
        type="text"
        value={workout.name}
        onChange={handleNameChange}
        className="p-3 border rounded w-full mb-6 text-lg"
      />
      
      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            debouncedSearch(e.target.value);
          }}
          placeholder="Search exercises to add..."
          className="p-3 border rounded w-full text-lg mb-4"
        />
        {loading && <p>Searching exercises...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((exercise) => (
            <div key={exercise.id} className="bg-white p-4 rounded-lg shadow-md">
              <h4 className="font-semibold text-lg mb-2">{exercise.name}</h4>
              <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-32 object-cover rounded mb-2" />
              <button 
                onClick={() => addExercise(exercise)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors w-full"
              >
                Add to Workout
              </button>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Current Exercises</h3>
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        {workout.exercises.map((exercise, index) => (
          <div key={exercise.id} className="border-b last:border-b-0 p-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={exercise.gifUrl} 
                  alt={exercise.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h4 className="font-semibold text-sm">{exercise.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="number"
                    value={exercise.sets}
                    onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                    className="p-1 border rounded w-12 text-center text-sm"
                    min="1"
                  />
                  <span className="text-xs">sets</span>
                  <span className="text-xs">x</span>
                  <input
                    type="number"
                    value={exercise.reps}
                    onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                    className="p-1 border rounded w-12 text-center text-sm"
                    min="1"
                  />
                  <span className="text-xs">reps</span>
                </div>
              </div>
              <button
                onClick={() => removeExercise(index)}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => updateWorkout(workout)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-green-600 transition-colors"
        >
          Save Changes
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default EditWorkout;