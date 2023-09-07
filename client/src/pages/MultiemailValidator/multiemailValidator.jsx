import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";

function VerifyEmails() {
  const [emails, setEmails] = useState("");
  const [results, setResults] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = event.target.result;
        setUploadedFile(fileContent);
      };
      reader.readAsText(file);
    }
  };

  const handleVerify = async () => {
    try {
      const response = await axios.post("/api/multiverifyEmail", {
        emails: uploadedFile.split("\n"),
      });

      if (response.status === 200) {
        const data = response.data;
        setResults(data);
        downloadSpreadsheet(data);
      } else {
        console.error("Failed to verify emails");
      }
    } catch (error) {
      console.error("Error while verifying emails:", error.message);
    }
  };

  const downloadSpreadsheet = (data) => {
    const csvContent = "data:text/csv;charset=utf-8," + "Email,Valid,MX Record Valid\n";
    data.forEach((result) => {
      csvContent += `${result.email},${result.isValid},${result.isValidMXrecord}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "email_verification_results.csv");
  };

  return (
    <div className="App">
      <h1>Email Verification</h1>
      <input type="file" accept=".txt" onChange={handleFileUpload} />
      <button onClick={handleVerify} disabled={!uploadedFile}>
        Verify
      </button>
      {uploadedFile && (
        <div>
          <h2>Uploaded Emails:</h2>
          <textarea rows="5" cols="40" readOnly value={uploadedFile} />
        </div>
      )}
      {results.length > 0 && (
        <div>
          <h2>Verification Results:</h2>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Valid</th>
                <th>MX Record Valid</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.email}</td>
                  <td>{result.isValid.toString()}</td>
                  <td>{result.isValidMXrecord.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VerifyEmails;
