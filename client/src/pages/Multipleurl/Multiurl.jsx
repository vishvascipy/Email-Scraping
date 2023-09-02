import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

function MultiScrap() {
    const [urls, setUrls] = useState('');
    const [uniqueEmails, setUniqueEmails] = useState([]);
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState(false)

    const handleUrlsChange = (event) => {
        setUrls(event.target.value);
    };

    const handleShowEmails = async () => {
        setLoading(true)
        setErr(false)
        const body = {
            'urls': urls
        }
        axios.post('http://localhost:8000/scrape/multipleurl', body)
            .then((res) => {
                console.log(res)
                setUniqueEmails(res.data.uniqueEmails)
                setLoading(false)
                if (res.data.uniqueEmails.length === 0) {
                    setErr(true)
                }
            })
            .catch((err) => {
                console.log(err);
                setErr(true)
                setLoading(false)
            })
    };

    const loaderBtn = () => {
        return (
            <>
                <button class="btn btn-primary" type="button" disabled>
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"> </span>
                    Loading...
                </button>
            </>
        )
    }

    return (
        <div className="container mt-5">
            <h1>Email Scraper</h1>
            <div class="input-group mb-3">
                <label class="input-group-text" for="inputGroupFile01">Upload</label>
                <input type="file" class="form-control" id="inputGroupFile01" onChange={ handleUrlsChange }></input>
            </div>
            {
                loading ? loaderBtn() :
                    <button className="btn btn-primary" onClick={handleShowEmails}>
                        Show Emails
                    </button>
            }


            <div className="mt-4 ">
                <h3>Scraped Emails:</h3>
                <div className='email-container'>

                    <p>
                        {
                            (uniqueEmails.length > 0)
                            && uniqueEmails.map((uniqueEmails, index) => (
                                <span key={index}>{uniqueEmails}<br /></span>
                            ))
                        }
                        <p>{err && "No emails found try again"}</p>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MultiScrap;
