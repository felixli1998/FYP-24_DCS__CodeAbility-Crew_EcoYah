import React, { useEffect } from 'react';

const Home: React.FC = () => {
  useEffect(() => {
    // Add any initialization logic or side effects here
    console.log('Homepage mounted');

    return () => {
      // Cleanup logic if needed
      console.log('Homepage unmounted');
    };
  }, []);

  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <p>
        This is a generic landing page that does not require donor to be
        authenticated
      </p>
    </div>
  );
};

export default Home;
