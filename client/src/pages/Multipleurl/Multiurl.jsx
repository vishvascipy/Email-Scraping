import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import xlsx from 'json-as-xlsx';

function MultiScrap() {
  const [fileContent, setFileContent] = useState('');
  const [uniqueEmails, setUniqueEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileContent(e.target.result);
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleScrapeEmails = async () => {
    setLoading(true);
    setErr(false);

    try {
      const response = await axios.post(
        'http://localhost:8000/scrape/multipleurl',
        { file: fileContent },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setUniqueEmails(response.data.emailLinks);
    } catch (error) {
      console.error(error);
      setErr(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    if (uniqueEmails.length > 0) {
      const data = [
        {
          sheet: 'EmailLinks',
          columns: [{ label: 'Email Links', value: 'email' }],
          content: uniqueEmails.map((email) => ({ email })),
        },
      ];

      const settings = {
        fileName: 'EmailLinksExport',
        extraLength: 3,
      };

      xlsx(data, settings);
    }
  };

  const loaderBtn = () => {
    return (
      <button className="btn btn-primary" type="button" disabled>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Loading...
      </button>
    );
  };

  return (
    <div className="container mt-5">
      <h1>Email Scraper</h1>
      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="inputGroupFile01">
          Upload
        </label>
        <input type="file" className="form-control" id="inputGroupFile01" onChange={handleFileChange}></input>
      </div>
      {loading ? (
        loaderBtn()
      ) : (
        <button className="btn btn-primary" onClick={handleScrapeEmails} disabled={!fileContent}>
          Scrape Emails
        </button>
      )}

      <button className="btn btn-success ms-2" onClick={handleExportToExcel} disabled={!uniqueEmails.length}>
        Export to Excel
      </button>

      <div className="mt-4">
        <h3>Scraped Emails:</h3>
        <div className="email-container">
          {uniqueEmails.length > 0 ? (
            uniqueEmails.map((uniqueEmail, index) => (
              <span key={index}>{uniqueEmail}<br /></span>
            ))
          ) : (
            <p>{err && "No emails found try again"}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MultiScrap;






// import React, { useState } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import axios from 'axios';

// function MultiScrap() {
//     const [fileContent, setFileContent] = useState('');
//     const [uniqueEmails, setUniqueEmails] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [err, setErr] = useState(false);

//     const handleFileChange = (event) => {
//         const selectedFile = event.target.files[0];
//         if (selectedFile) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setFileContent(e.target.result);
//             };
//             reader.readAsText(selectedFile);
//         }
//     };

//     const handleScrapeEmails = async () => {
//         setLoading(true);
//         setErr(false);

//         try {
//             const response = await axios.post('http://localhost:8000/scrape/multipleurl', { file: fileContent }, {
//                 headers: {
//                     'Content-Type': 'application/json', // Update content type
//                 },
//             });

//             setUniqueEmails(response.data.emailLinks);
//         } catch (error) {
//             console.error(error);
//             setErr(true);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const loaderBtn = () => {
//         return (
//             <button className="btn btn-primary" type="button" disabled>
//                 <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                 Loading...
//             </button>
//         );
//     };

//     return (
//         <div className="container mt-5">
//             <h1>Email Scraper</h1>
//             <div className="input-group mb-3">
//                 <label className="input-group-text" htmlFor="inputGroupFile01">Upload</label>
//                 <input type="file" className="form-control" id="inputGroupFile01" onChange={handleFileChange}></input>
//             </div>
//             {
//                 loading ? loaderBtn() :
//                     <button className="btn btn-primary" onClick={handleScrapeEmails} disabled={!fileContent}>
//                         Scrape Emails
//                     </button>
//             }

//             <div className="mt-4">
//                 <h3>Scraped Emails:</h3>
//                 <div className='email-container'>
//                     {uniqueEmails.length > 0 ? (
//                         uniqueEmails.map((uniqueEmail, index) => (
//                             <span key={index}>{uniqueEmail}<br /></span>
//                         ))
//                     ) : (
//                         <p>{err && "No emails found try again"}</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default MultiScrap;
