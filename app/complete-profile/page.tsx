'use client';

import { useState } from 'react';

export default function CompleteProfilePage() {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setProfile((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(profile);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-md rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Complete Your Profile
        </h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={profile.name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
              placeholder="Matej"
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="mb-2 block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              id="age"
              name="age"
              type="number"
              value={profile.age}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
              placeholder="22"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800"
        >
          Save profile
        </button>
      </form>
    </main>
  );
}
