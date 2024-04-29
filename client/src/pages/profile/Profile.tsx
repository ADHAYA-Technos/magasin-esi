import React, { useState } from 'react';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('John Doe');
  const [role, setRole] = useState('Admin');
  const [email, setEmail] = useState('johndoe@example.com');
  const [theme, setTheme] = useState('light');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'role':
        setRole(value);
        break;
      case 'email':
        setEmail(value);
        break;
      default:
        break;
    }
  };

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  return (
    <div className={`min-h-screen flex bg-${theme}-100 text-${theme}-900`}>
      <div className="container mx-auto flex-1 flex flex-col md:flex-row">
        <div className="flex-1 p-8 md:border-r md:border-gray-300 dark:md:border-gray-700">
          <h2 className="text-3xl font-semibold mb-6">Profile</h2>
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-8">
              <img
                src="/path/to/profile-pic.jpg"
                alt="Profile Picture"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{username}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{role}</p>
              <p className="text-gray-600 dark:text-gray-400">{email}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-semibold mb-6">Settings</h2>
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-full md:w-auto md:mr-4 mb-4 md:mb-0">
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="w-full md:w-auto md:mr-4 mb-4 md:mb-0">
              <label htmlFor="role" className="block text-sm font-medium mb-1">
                Role
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={role}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="w-full md:w-auto md:mr-4 mb-4 md:mb-0">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="w-full md:w-auto md:mr-4 mb-4 md:mb-0">
              <label htmlFor="theme" className="block text-sm font-medium mb-1">
                Theme
              </label>
              <select
                id="theme"
                value={theme}
                onChange={handleThemeChange}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <button
              className={`bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;