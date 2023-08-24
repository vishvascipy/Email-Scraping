// import puppeteer from "puppeteer";

// export const scrap = async () => {
//   const browser = await puppeteer.launch();
//   const visitedLinks = new Set();
//   const scrapedEmails = new Set();

//   const blockedDomains = ['facebook.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'tel', 'twitter.com'];
//   const blockedPaths = ['/tel:'];

//   try {
//     const mainPage = await browser.newPage();
//     await mainPage.goto('https://scipytechnologies.com/', {
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
//       console.log('Email Links:', emailLinks);
//     } else {
//       console.log('No email links found.');
//     }
//   } catch (error) {
//     console.error('Error:', error);
//   } finally {
//     await browser.close();
//   }
// };