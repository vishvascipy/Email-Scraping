import React, { useState } from 'react';
import axios from 'axios';

const MultiEmailValidation = () => {
  const [emailList, setEmailList] = useState('');
  const [results, setResults] = useState([]);
  const [fileInput, setFileInput] = useState(null);

  const handleValidation = async () => {
    try {
      const response = await axios.post('http://localhost:8000/scrape/multiverifyemail', {
        emails: emailList.split('\n').map((email) => email.trim()),
      });
      const data = response.data;

      setResults(data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;
      setEmailList(fileContent);
    };

    reader.readAsText(file);
  };

  const downloadSpreadsheet = () => {
    const csvContent = `Email,Email Syntax,Valid MX Record\n${results
      .map((result) => `${result.email},${result.isValid ? 'Valid' : 'Invalid'},${result.isValidMXrecord ? 'Found' : 'Not Found'}`)
      .join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'email_validation_results.csv';
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-5">
      <h1>Multiple Email Validation</h1>
      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="fileInput">
          Upload File:
        </label>
        <input
          type="file"
          id="fileInput"
          accept=".txt"
          onChange={handleFileUpload}
          className="form-control"
        />
      </div>
      <button className="btn btn-primary" onClick={handleValidation}>
        Validate Emails
      </button>

      <div>
        {results.length > 0 ? (
          results.map((result, index) => (
            <div className='email-container' key={index}>
              <p>Email {result.email}</p>
              <p>Email syntax is <span style={{ color: result.isValid ? 'green' : 'red' }}>{result.isValid ? 'Valid' : 'Invalid'}</span></p>
              <p>MX Record is <span style={{ color: result.isValidMXrecord ? 'green' : 'red' }}>{result.isValidMXrecord ? 'Found' : 'Not Found'}</span></p>
              {result.MXRecord && result.MXRecord.length > 0 && (
                <div>
                  <p>MX Records:</p>
                  <ul>
                    {result.MXRecord.map((mxRecord, mxIndex) => {
                      const parts = mxRecord.split(' ');
                      const priority = parts[0];
                      const server = parts.slice(1).join(' ');
                      return (
                        <li key={mxIndex}>
                          {server} (Priority {priority})
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : null}
      </div>

      {results.length > 0 ? (
        <button className="btn btn-success" onClick={downloadSpreadsheet}>
          Download Spreadsheet
        </button>
      ) : null}
    </div>
  );
};

export default MultiEmailValidation;













