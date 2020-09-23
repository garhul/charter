import React, {useState, useLayoutEffect} from 'react';
// import './App.css';
import MainLayout from './components/MainLayout';


function App() {
  const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);

  return (
    <div className="App" > 
      <MainLayout></MainLayout>
    </div>    
  );
}

export default App;
