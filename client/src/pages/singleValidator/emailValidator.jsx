import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const EmailVerificationForm = () => {
  const [email, setEmail] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleVerifyEmail = async () => {
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/scrape/verifyemail', { email });
      const data = response.data;
      setVerificationResult(data);
    } catch (error) {
      console.error('Error verifying email:', error);
      setVerificationResult({ isValid: false, isValidMXrecord: false, MXRecord: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Email Verification</h2>
      <div className='mb-3'>
        <label className="form-label">Email Verification</label>
        <input className="form-control" type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} /><br />
        <button className="btn btn-primary" onClick={handleVerifyEmail} disabled={isLoading}>
          Verify Email
        </button>
      </div>
      {isLoading && <p>Verifying email...</p>}
      {verificationResult && !isLoading && (
        <div className='email-container'>
          {verificationResult.isValid && (
            <p>
              <span style={{ color: 'green' }}>&#10003;</span>
              Email syntax is <span style={{ color: verificationResult.isValid ? 'green' : 'red' }}>{verificationResult.isValid ? 'valid' : 'invalid'}</span>
            </p>
          )}
          {!verificationResult.isValid && <p>Email syntax is <span style={{ color: verificationResult.isValid ? 'green' : 'red' }}>{verificationResult.isValid ? 'valid' : 'invalid'}</span></p>}
          <p>MX record is <span style={{ color: verificationResult.isValidMXrecord ? 'green' : 'red' }}>{verificationResult.isValidMXrecord ? 'found' : 'not found'}</span></p>
          {verificationResult.MXRecord && verificationResult.MXRecord.length > 0 && (
            <div>
              <p>MX Records:</p>
              <ul>
                {verificationResult.MXRecord.map((record, index) => {
                  const parts = record.split(' ');
                  const priority = parts[0];
                  const server = parts.slice(1).join(' ');
                  return (
                    <li key={index}>
                      {server} (Priority {priority})
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailVerificationForm;
