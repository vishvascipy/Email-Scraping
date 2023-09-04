import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 

import MultiScrap from './pages/Multipleurl/Multiurl';
import Scrap from './pages/Scrap';

function App() {
  return (
    <>
      <BrowserRouter> 
        <Routes>
          <Route path="Multiurl" element={<MultiScrap />} />
          <Route path="/" element={<Scrap />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
