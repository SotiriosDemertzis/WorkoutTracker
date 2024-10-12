import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { searchExercises } from '../api/exerciseDb';

function CreateWorkout() {
  const navigate = useNavigate();
  const [workoutName, setWorkoutName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const addExercise = (exercise) => {
    setSelectedExercises([...selectedExercises, { ...exercise, sets: 3, reps: 10 }]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const updateExercise = (index, field, value) => {
    const updatedExercises = selectedExercises.map((ex, i) => 
      i === index ? { ...ex, [field]: value } : ex
    );
    setSelectedExercises(updatedExercises);
  };

  const removeExercise = (index) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(selectedExercises);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSelectedExercises(items);
  };

  const saveWorkout = () => {
    if (!workoutName.trim()) {
      setError('Please enter a workout name');
      return;
    }
    const workout = {
      id: Date.now(),
      name: workoutName,
      exercises: selectedExercises
    };
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    localStorage.setItem('workouts', JSON.stringify([...savedWorkouts, workout]));
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Create New Workout</h2>
      
      <input
        type="text"
        value={workoutName}
        onChange={(e) => setWorkoutName(e.target.value)}
        placeholder="Enter workout name"
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
          placeholder="Search exercises..."
          className="p-3 border rounded w-full text-lg mb-4"
        />
        {loading && <p>Searching exercises...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((exercise) => (
            <div key={exercise.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
              <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              <p className="text-gray-600 mb-1">Body Part: {exercise.bodyPart}</p>
              <p className="text-gray-600 mb-1">Target: {exercise.target}</p>
              <p className="text-gray-600">Equipment: {exercise.equipment}</p>
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

      {selectedExercises.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Selected Exercises:</h3>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div 
                  {...provided.droppableProps} 
                  ref={provided.innerRef}
                  className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
                >
                  {selectedExercises.map((exercise, index) => (
                    <Draggable key={exercise.id} draggableId={exercise.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border-b last:border-b-0 p-4"
                        >
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
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      <button
        onClick={saveWorkout}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors"
      >
        Save Workout
      </button>
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

export default CreateWorkout;