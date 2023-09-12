import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import EmailVerificationForm from './pages/singleValidator/emailValidator'
import MultiScrap from './pages/Multipleurl/Multiurl';
import Scrap from './pages/Scrap';
import MultiEmailValidation from './pages/MultiemailValidator/multiemailValidator';
import Pdfscrap from './pages/Pdfscrap/Pdfscrap';

function App() {
  return (
    <>
      <BrowserRouter> 
        <Routes>
          <Route path="Pdfscrap" element={<Pdfscrap/>} />
          <Route path="MultiEmail" element={<MultiEmailValidation/>}/>
          <Route path="EmailValidator" element={<EmailVerificationForm />}/>
          <Route path="Multiurl" element={<MultiScrap />} />
          <Route path="/" element={<Scrap />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
