import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Workout Tracker</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:underline">My Workouts</Link></li>
            <li><Link to="/create-workout" className="hover:underline">Create Workout</Link></li>
            <li><Link to="/exercises" className="hover:underline">Exercise Library</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;