// context/UserContext.js
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1, // User's ID, you can modify this based on actual user login data
    username: 'john_doe',
    profilePic: 'https://example.com/john.jpg',
    email: 'john.doe@example.com',
    points: 1200,
    isFollowing: false,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
