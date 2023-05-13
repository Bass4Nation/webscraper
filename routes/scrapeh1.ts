import express, { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { errorcodes } from "./utils/helper";

/**
 * Scrape the website
 * @param url - The url of the website to scrape
 * @returns The scraped website in raw text format with only the h1 element
 * 
 */

const app = express();

app.get("/scrapeh1", async (req: any, res: any) => {
    const url = req.query.url;

    try {
        const response = await axios.get(url);
        const body = response.data;
        const $ = cheerio.load(body);
        const html = $("h1"); // Extract only the h1 element
        const text = html.text().trim(); // Get the text and remove any whitespace
        console.log(text);

        res.send(text);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error occurred while scraping the website");
    }
});


export default app;