import React, { useState, useEffect } from 'react';
import { 
  fetchExercises, 
  fetchBodyPartList, 
  fetchEquipmentList, 
  fetchTargetList,
  fetchExercisesByBodyPart,
  fetchExercisesByEquipment,
  fetchExercisesByTarget,
  searchExercises
} from '../api/exerciseDb';

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [targets, setTargets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [exercisesData, bodyPartsData, equipmentsData, targetsData] = await Promise.all([
        fetchExercises(20),
        fetchBodyPartList(),
        fetchEquipmentList(),
        fetchTargetList()
      ]);
      setExercises(exercisesData);
      setBodyParts(bodyPartsData);
      setEquipments(equipmentsData);
      setTargets(targetsData);
    } catch (err) {
      setError('Failed to load initial data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLoading(true);
      setError(null);
      try {
        const data = await searchExercises(searchQuery);
        setExercises(data);
      } catch (err) {
        setError('Failed to search exercises. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFilter = async (type, value) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (value === '') {
        data = await fetchExercises(20);
      } else {
        switch (type) {
          case 'bodyPart':
            data = await fetchExercisesByBodyPart(value);
            break;
          case 'equipment':
            data = await fetchExercisesByEquipment(value);
            break;
          case 'target':
            data = await fetchExercisesByTarget(value);
            break;
          default:
            data = await fetchExercises(20);
        }
      }
      setExercises(data);
    } catch (err) {
      setError('Failed to filter exercises. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Exercise Library</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search exercises..."
          className="p-2 border rounded mr-2 w-64"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </form>

      <div className="mb-6 flex space-x-4">
        <select 
          value={selectedBodyPart} 
          onChange={(e) => {
            setSelectedBodyPart(e.target.value);
            handleFilter('bodyPart', e.target.value);
          }}
          className="p-2 border rounded"
        >
          <option value="">Select Body Part</option>
          {bodyParts.map((part, index) => (
            <option key={index} value={part}>{part}</option>
          ))}
        </select>
        <select 
          value={selectedEquipment} 
          onChange={(e) => {
            setSelectedEquipment(e.target.value);
            handleFilter('equipment', e.target.value);
          }}
          className="p-2 border rounded"
        >
          <option value="">Select Equipment</option>
          {equipments.map((eq, index) => (
            <option key={index} value={eq}>{eq}</option>
          ))}
        </select>
        <select 
          value={selectedTarget} 
          onChange={(e) => {
            setSelectedTarget(e.target.value);
            handleFilter('target', e.target.value);
          }}
          className="p-2 border rounded"
        >
          <option value="">Select Target Muscle</option>
          {targets.map((target, index) => (
            <option key={index} value={target}>{target}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-xl">Loading exercises...</p>}
      {error && <p className="text-red-500 text-xl">{error}</p>}
      {!loading && !error && (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
              <img src={exercise.gifUrl} alt={exercise.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              <p className="text-gray-600 mb-1">Body Part: {exercise.bodyPart}</p>
              <p className="text-gray-600 mb-1">Target: {exercise.target}</p>
              <p className="text-gray-600">Equipment: {exercise.equipment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExerciseList;