import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WorkoutList from './components/WorkoutList';
import WorkoutDetail from './components/WorkoutDetail';
import CreateWorkout from './components/CreateWorkout';
import EditWorkout from './components/EditWorkout';
import ExerciseList from './components/ExerciseList';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<WorkoutList />} />
            <Route path="/workout/:id" element={<WorkoutDetail />} />
            <Route path="/create-workout" element={<CreateWorkout />} />
            <Route path="/edit-workout/:id" element={<EditWorkout />} />
            <Route path="/exercises" element={<ExerciseList />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;