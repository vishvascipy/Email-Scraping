import puppeteer from "puppeteer";
import { Single } from "../model/urlSchema.js";
import axios from "axios";
import cheerio from "cheerio";
import emailExtractor from "node-email-extractor";

export const singleurlController = async (req, res) => {
  try {
    const { url } = req.body;

    // Validate the URL
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Make an HTTP request to the specified URL
    const response = await axios.get(url);

    if (response.status === 200) {
      const $ = cheerio.load(response.data);
      const baseUrl = new URL(url);
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const extractedEmails = new Set();

      // Extract unique links using Cheerio selectors
      const uniqueLinks = new Set();
      $("a").each((index, element) => {
        const link = $(element).attr("href");
        if (link && !link.startsWith("#")) {
          const absoluteLink = new URL(link, baseUrl);
          if (absoluteLink.hostname === baseUrl.hostname) {
            uniqueLinks.add(absoluteLink.href);
          }
        }
      });

      // Define a function to process links concurrently
      async function processLink(link) {
        try {
          const response = await axios.get(link);
          const htmlContent = response.data;
          const extractedEmailsFromUrl = htmlContent.match(emailRegex) || [];
          extractedEmailsFromUrl.forEach((email) => {
            extractedEmails.add(email);
          });
        } catch (error) {
          console.error("Error extracting email addresses from", link, ":", error.message);
        }
      }

      // Process links concurrently using Promise.all
      const linkPromises = Array.from(uniqueLinks).map(processLink);

      await Promise.all(linkPromises);

      // Convert the Set of email addresses to an array
      const emailsArray = Array.from(extractedEmails);

      res.status(200).json({emailLinks: emailsArray });
    } else {
      res.status(response.status).json({ error: "Failed to fetch the page" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

export const multipleurlController = async (req, res) => {
  try {
    const fileContent = req.body.file; // Corrected to access the uploaded file content
    const urls = fileContent.split("\n");
    console.log(urls);

    const browser = await puppeteer.launch();
    const scrapedEmails = new Set();

    const blockedDomains = [
      "www.facebook.com",
      "linkedin.com",
      "instagram.com",
      "youtube.com",
      "tel",
      "twitter.com",
    ];
    const blockedPaths = ["/tel:"];

    for (const url of urls) {
      const visitedLinks = new Set();
      const allEmailLinks = [];

      const mainPage = await browser.newPage();
      await mainPage.goto(url, {
        waitUntil: "domcontentloaded",
      });

      const pageLinks = await mainPage.evaluate(() => {
        const links = Array.from(document.querySelectorAll("a"));
        return links.map((link) => link.href);
      });

      for (const link of pageLinks) {
        if (
          !visitedLinks.has(link) &&
          !blockedDomains.some((domain) => link.includes(domain)) &&
          !blockedPaths.some((path) => link.includes(path)) &&
          !link.includes("#") && // Exclude URLs with fragments
          !/\b\d{10,}\b/.test(link) // Exclude URLs with phone numbers
        ) {
          visitedLinks.add(link);
          console.log(link);
          if (link.includes("mailto:")) {
            const email = link.replace("mailto:", "");
            if (!scrapedEmails.has(email)) {
              scrapedEmails.add(email);
              allEmailLinks.push(email);
            }
          } else if (link.startsWith("http") || link.startsWith("www")) {
            let newPage;

            try {
              newPage = await browser.newPage();
              await newPage.goto(link, {
                waitUntil: "domcontentloaded",
              });

              const normalizedNewPageURL = new URL(newPage.url());
              const normalizedLink = new URL(link);

              if (normalizedNewPageURL.href === normalizedLink.href) {
                const pageEmailLinks = await newPage.evaluate(() => {
                  const links = Array.from(
                    document.querySelectorAll('a[href^="mailto:"]')
                  );
                  return links.map((link) =>
                    link.getAttribute("href").replace("mailto:", "")
                  );
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

      await mainPage.close();
    }

    const uniqueEmails = [...scrapedEmails];
    if (uniqueEmails.length > 0) {
      res.json({ emailLinks: uniqueEmails });
    } else {
      res.json({ message: "No email links found." });
    }

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while scraping." });
  }
};
