import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/ping', {
      credentials: 'include', // because your backend has `credentials: true`
    })
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch((err) => {
        console.error('Error connecting to backend:', err);
        setStatus('Backend not connected');
      });
  }, []);

  return (
    <div>
      <h1>{status ? status : 'Connecting to backend...'}</h1>
    </div>
  );
}

export default App;
