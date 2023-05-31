import express, { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { errorcodes } from "./utils/helper";

/**
 * Scrape the website
 * @param url - The url of the website to scrape
 * @returns The scraped website in array format with tags and content.
 *  User can use this to create a website with the same tags and content.
 * */
const app = express();

app.get("/scrapearray", async (req: Request, res: Response) => {
    const url = req.query.url?.toString(); // Cast url to string

    try {
        if (!url) {
            throw new Error("URL is not defined");
        }

        const response = await axios.get(url);
        const body = response.data;
        const $ = cheerio.load(body);

        const createObject = (element: any) => {
            const tagName = element.prop("tagName").toLowerCase();
            const children = element.children().toArray().map((child: any) => createObject($(child)));

            return {
                tag: tagName,
                content: children.length > 0 ? children : element.text(),
            };
        };

        const elements = $("body > *").toArray().map((element: any) => createObject($(element)));
        res.json(elements);
    } catch (error) {
        errorcodes(error, res);
    }
});

export default app;