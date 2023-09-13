import puppeteer from 'puppeteer';

export const scrapePdfsController = async (req, res) => {
  const { url } = req.body;
  console.log("url", url);

  try {
    const browser = await puppeteer.launch();
    const visitedLinks = new Set();
    const pdfLinks = new Set();

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
        if (link.toLowerCase().endsWith('.pdf')) {
          pdfLinks.add(link);
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
              const pagePdfLinks = await newPage.evaluate(() => {
                const links = Array.from(document.querySelectorAll('a[href$=".pdf"]'));
                return links.map(link => link.href);
              });

              for (const pdfLink of pagePdfLinks) {
                pdfLinks.add(pdfLink);
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

    const pdfLinksArray = Array.from(pdfLinks);

    if (pdfLinksArray.length > 0) {
      res.json({ pdfLinks: pdfLinksArray });
    } else {
      res.json({ message: 'No PDF links found.' });
    }

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while scraping.' });
  }
};
