import React, { useEffect, useState } from 'react';

export const App = () => {
  const [backendData, setBackendData] = useState(null);
  
  useEffect(() => {
    fetch('/api')
      .then(res => res.json())
      .then(data => setBackendData(data));
  }, []);
  
  return (
    <div>
      {backendData ? (
        <p>{backendData.name}</p>
      ) : (
        <h1>Loading ...</h1>
      )}
    </div>
  );
};

export default App;
