import React, { createContext, useContext, useState } from 'react';

// Create the context
const UserContext = createContext();

// Create a custom hook for easier access to the context
export const useUser = () => useContext(UserContext);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simulating a user being logged in (replace with your login logic)
  React.useEffect(() => {
    // Replace this with actual user fetching logic
    const loggedInUser = {
      id: 1, // Ensure this ID matches one in your `friends` data
      username: "john_doe",
    };
    setUser(loggedInUser);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
