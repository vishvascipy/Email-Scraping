import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import EmailVerificationForm from './pages/singleValidator/emailValidator'
import MultiScrap from './pages/Multipleurl/Multiurl';
import Scrap from './pages/Scrap';

function App() {
  return (
    <>
      <BrowserRouter> 
        <Routes>
          <Route path="EmailValidator" element={<EmailVerificationForm />}/>
          <Route path="Multiurl" element={<MultiScrap />} />
          <Route path="/" element={<Scrap />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
