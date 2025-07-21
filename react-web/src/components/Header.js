// src/components/Header.jsx

import React from 'react';

export default function Header() {
  return (
    <div className="bg-blue-900 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold tracking-wider">
        <span className="text-red-500">F</span>
        <span className="text-yellow-400">A</span>
        <span className="text-green-400">C</span>
        <span className="text-blue-300">T</span>
        <span className="ml-3 text-sm font-normal">Field Audit Collection Tool</span>
      </div>
      <div>
        {/* optional navigation links or user menu */}
      </div>
    </div>
  );
}
