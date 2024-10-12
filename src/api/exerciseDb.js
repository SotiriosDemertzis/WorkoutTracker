const API_BASE_URL = 'https://exercisedb.p.rapidapi.com';
const API_KEY = '2adeaba6afmshb93805b3429a780p19ff28jsn7297bf2bc11a';

const headers = {
  'X-RapidAPI-Key': API_KEY,
  'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
};

const fetchFromApi = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};

export const fetchExercises = (limit = 20) => fetchFromApi(`/exercises?limit=${limit}`);

export const fetchExercisesByBodyPart = (bodyPart) => fetchFromApi(`/exercises/bodyPart/${bodyPart}?limit=1000&offset=0`);

export const fetchBodyPartList = () => fetchFromApi('/exercises/bodyPartList');

export const fetchEquipmentList = () => fetchFromApi('/exercises/equipmentList');

export const fetchTargetList = () => fetchFromApi('/exercises/targetList');

export const fetchExercisesByEquipment = (equipment) => fetchFromApi(`/exercises/equipment/${equipment}?limit=1000&offset=0`);

export const fetchExercisesByTarget = (target) => fetchFromApi(`/exercises/target/${target}?limit=1000&offset=0`);

export const fetchExerciseById = (id) => fetchFromApi(`/exercises/exercise/${id}?limit=1000&offset=0`);

export const searchExercises = (name) => fetchFromApi(`/exercises/name/${name}?limit=1000&offset=0`);