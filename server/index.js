import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import dbConnect from './mongodb/config.js';
const app = express();

import router from './routes/scrapeRoute.js'

dotenv.config()
const PORT = process.env.PORT

dbConnect(); // MONGOOSE CONNECTION


app.use(cors());
app.use(express.json());
app.use("/scrape", router);
app.use("/multipleurl", router);
app.use("/pdfscrap", router)


app.listen(PORT, () => {console.log(`Server is porting ${PORT}`)})




// import express from 'express'
// import puppeteer from 'puppeteer';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv'

// dotenv.config()
// const app = express();
// const PORT = process.env.PORT;

// app.get('/', async (req, res) => {
//   res.status(200).json({message:"get api"})
// })

// app.get('/scrape', async (req, res) => {
//   try {
//     const browser = await puppeteer.launch();
//     const visitedLinks = new Set();
//     const scrapedEmails = new Set();

//     const blockedDomains = ['facebook.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'tel', 'twitter.com'];
//     const blockedPaths = ['/tel:'];

//     const mainPage = await browser.newPage();
//     await mainPage.goto('https://www.emmanuelcollege.ac.in/', {
//       waitUntil: 'domcontentloaded',
//     });

//     const pageLinks = await mainPage.evaluate(() => {
//       const links = Array.from(document.querySelectorAll('a'));
//       return links.map(link => link.href);
//     });

//     const emailLinks = [];

//     for (const link of pageLinks) {
//       if (
//         !visitedLinks.has(link) &&
//         !blockedDomains.some(domain => link.includes(domain)) &&
//         !blockedPaths.some(path => link.includes(path)) &&
//         !link.includes('#') &&   // Exclude URLs with fragments
//         !/\b\d{10,}\b/.test(link) // Exclude URLs with phone numbers
//       ) {
//         visitedLinks.add(link);
//         console.log(link)
//         if (link.includes('mailto:')) {
//           const email = link.replace('mailto:', '');
//           if (!scrapedEmails.has(email)) {
//             scrapedEmails.add(email);
//             emailLinks.push(email);
//           }
//         } else if (link.startsWith('http') || link.startsWith('www')) {
//           let newPage;

//           try {
//             newPage = await browser.newPage();
//             await newPage.goto(link, {
//               waitUntil: 'domcontentloaded',
//             });

//             const normalizedNewPageURL = new URL(newPage.url());
//             const normalizedLink = new URL(link);

//             if (normalizedNewPageURL.href === normalizedLink.href) {
//               const pageEmailLinks = await newPage.evaluate(() => {
//                 const links = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
//                 return links.map(link => link.getAttribute('href').replace('mailto:', ''));
//               });

//               for (const email of pageEmailLinks) {
//                 if (!scrapedEmails.has(email)) {
//                   scrapedEmails.add(email);
//                   emailLinks.push(email);
//                 }
//               }
//             }
//           } catch (error) {
//             console.error(`Error while processing link ${link}:`, error);
//           } finally {
//             if (newPage) {
//               await newPage.close();
//             }
//           }
//         }
//       }
//     }

//     if (emailLinks.length > 0) {
//       res.json({ emailLinks });
//     } else {
//       res.json({ message: 'No email links found.' });
//     }

//     await browser.close();
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred while scraping.' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });



// // import express from 'express';
// // import mongoose from 'mongoose';
// // import dotenv from 'dotenv';

// // const app = express();
// // dotenv.config();

// // const port = process.env.PORT;

// // app.listen(port, () => {
// //     console.log(`app listening to port ${port}`);
// // });

// // // Call the scrape function here
// // scrap();

// mongoose.connect(process.env.MONGODB, {})
//   .then(() => console.log("mongoose connected"))
//   .catch((err) => console.error("Error connecting mongoose:", err));




