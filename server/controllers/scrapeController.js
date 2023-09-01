import puppeteer from 'puppeteer';
import { Single } from '../model/urlSchema.js';

export const singleurlController = async (req, res) => {
  const { url } = req.body
  console.log("url", url)
  try {
    const browser = await puppeteer.launch();
    const visitedLinks = new Set();
    const scrapedEmails = new Set();

    const blockedDomains = ['www.facebook.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'tel', 'twitter.com'];
    const blockedPaths = ['/tel:'];

    const mainPage = await browser.newPage();
    await mainPage.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    const pageLinks = await mainPage.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      return links.map(link => link.href);
    });

    const emailLinks = [];

    for (const link of pageLinks) {
      if (
        !visitedLinks.has(link) &&
        !blockedDomains.some(domain => link.includes(domain)) &&
        !blockedPaths.some(path => link.includes(path)) &&
        !link.includes('#') &&   // Exclude URLs with fragments
        !/\b\d{10,}\b/.test(link) // Exclude URLs with phone numbers
      ) {
        visitedLinks.add(link);
        console.log(link)
        if (link.includes('mailto:')) {
          const email = link.replace('mailto:', '');
          if (!scrapedEmails.has(email)) {
            scrapedEmails.add(email);
            emailLinks.push(email);
          }
        } else if (link.startsWith('http') || link.startsWith('www')) {
          let newPage;

          try {
            newPage = await browser.newPage();
            await newPage.goto(link, {
              waitUntil: 'domcontentloaded',
            });

            const normalizedNewPageURL = new URL(newPage.url());
            const normalizedLink = new URL(link);

            if (normalizedNewPageURL.href === normalizedLink.href) {
              const pageEmailLinks = await newPage.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
                return links.map(link => link.getAttribute('href').replace('mailto:', ''));
              });

              for (const email of pageEmailLinks) {
                if (!scrapedEmails.has(email)) {
                  scrapedEmails.add(email);
                  emailLinks.push(email);
                }
              }
            }
          } catch (error) {
            console.error(`Error while processing link ${link}:`, error);
          } finally {
            if (newPage) {
              await newPage.close();
            }
          }
        }
      }
    }

    if (emailLinks.length > 0) {
      const scrapedData = new Single({
        url: url,
        emailLinks: emailLinks,
      });
      await scrapedData.save();
      res.json({ emailLinks });
    } else {
      res.json({ message: 'No email links found.' });
    }

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while scraping.' });
  }
}




export const multipleurlController = async (req, res) => {
  const { urls } = req.body; // Assuming 'urls' is an array of URLs
  console.log("urls", urls);
  try {
    const browser = await puppeteer.launch();
    const scrapedEmails = new Set();

    const blockedDomains = ['www.facebook.com', 'linkedin.com', 'instagram.com', 'youtube.com', 'tel', 'twitter.com'];
    const blockedPaths = ['/tel:'];

    const allEmailLinks = [];

    for (const url of urls) {
      const visitedLinks = new Set();

      const mainPage = await browser.newPage();
      await mainPage.goto(url, {
        waitUntil: 'domcontentloaded',
      });

      const pageLinks = await mainPage.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        return links.map(link => link.href);
      });

      for (const link of pageLinks) {
        if (
          !visitedLinks.has(link) &&
          !blockedDomains.some(domain => link.includes(domain)) &&
          !blockedPaths.some(path => link.includes(path)) &&
          !link.includes('#') &&   // Exclude URLs with fragments
          !/\b\d{10,}\b/.test(link) // Exclude URLs with phone numbers
        ) {
          visitedLinks.add(link);
          console.log(link)
          if (link.includes('mailto:')) {
            const email = link.replace('mailto:', '');
            if (!scrapedEmails.has(email)) {
              scrapedEmails.add(email);
              allEmailLinks.push(email);
            }
          } else if (link.startsWith('http') || link.startsWith('www')) {
            let newPage;

            try {
              newPage = await browser.newPage();
              await newPage.goto(link, {
                waitUntil: 'domcontentloaded',
              });

              const normalizedNewPageURL = new URL(newPage.url());
              const normalizedLink = new URL(link);

              if (normalizedNewPageURL.href === normalizedLink.href) {
                const pageEmailLinks = await newPage.evaluate(() => {
                  const links = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
                  return links.map(link => link.getAttribute('href').replace('mailto:', ''));
                });

                for (const email of pageEmailLinks) {
                  if (!scrapedEmails.has(email)) {
                    scrapedEmails.add(email);
                    allEmailLinks.push(email);
                  }
                }
              }
            } catch (error) {
              console.error(`Error while processing link ${link}:`, error);
            } finally {
              if (newPage) {
                await newPage.close();
              }
            }
          }
        }
      }

      allEmailLinks.push(...allEmailLinks);

      await mainPage.close();
    }
    const uniqueEmails = [...scrapedEmails];
    if (uniqueEmails.length > 0) {
      res.json({ emailLinks: uniqueEmails });
    } else {
      res.json({ message: 'No email links found.' });
    }

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while scraping.' });
  }
}
