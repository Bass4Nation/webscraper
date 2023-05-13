import express, { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { errorcodes } from "./utils/helper";
import { waitTime } from "./utils/helper";
import { titleFromURL } from "./utils/helper";
import puppeteer from "puppeteer";

/**
 * Scrape the website and return pdf path.
 * @param url - The url of the website to scrape
 * @returns The scraped website in pdf format - filepath on the server.
 * @ps - The pdf is saved in the public/scraped-pdfs folder.
 * @warning - CAN NOT RETURN THE PDF FILE TO THE CLIENT. THE CLIENT HAS TO DOWNLOAD THE FILE FROM THE SERVER.
 */

const app = express();

app.get("/scrapepdf", async (req: any, res: any) => {
    // public/scraped-pdfs/
  
    const url = req.query.url;
    let filename = "template";
    const filetype = ".pdf";
  
    // console.log(url);
  
    filename = await titleFromURL(url);
  
    const savepath = "./public/scraped-pdfs/" + filename + filetype;
    const responsePath = "./scraped-pdfs/" + filename + filetype; // Path to the file from the standpoint of the client. Without public.
  
  
  
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      await waitTime(4); // Wrap setTimeout in a Promise. Waiting because the page needs to load before the pdf is created.
      await page.pdf({ format: 'A4', path: savepath, printBackground: true });
      await browser.close();
  
      // You may want to send a success response after the PDF is created and the browser is closed
      res.status(200).json({ status: 'success', message: 'PDF created successfully', filePath: responsePath, filename: filename + filetype });
  
    } catch (error) {
      errorcodes(error, res);
    }
  });

  export default app;