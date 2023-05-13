import express, { Request, Response } from "express";
// import axios from "axios";
// import cheerio from "cheerio";
import { errorcodes } from "./utils/helper";
import { waitTime } from "./utils/helper";
import { titleFromURL } from "./utils/helper";
import puppeteer from "puppeteer";

/**
 * Scraping a screenshot from a website
 * @param url - The url of the website to scrape
 * @returns the filepath of the screenshot
 */

const app = express();

app.get("/scrapescreenshot", async (req: any, res: any) => {
    // public/scraped-screenshots/
  
    const url = req.query.url;
    let filename = "template";
    const filetype = ".png";
  
    filename = await titleFromURL(url);
  
    // console.log(filename);
  
    const savepath = "./public/scraped-screenshots/" + filename + filetype;
    const responsePath = "./scraped-screenshots/" + filename + filetype; // Path to the file from the standpoint of the client. Without public.
  
  
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      await waitTime(4); // Wrap setTimeout in a Promise. Waiting because the page needs to load before the screenshot is taken.
      await page.screenshot({ path: savepath });
      await browser.close();
  
      res.status(200).json({ status: 'success', message: 'Screenshot created successfully', filePath: responsePath, filename: filename + filetype });
    } catch (error) {
      errorcodes(error, res);
    }
  });

export default app;
