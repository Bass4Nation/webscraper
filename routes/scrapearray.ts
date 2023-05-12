import express, { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { errorcodes } from "./utils/helper";
const app = express();

app.get("/", async (req: Request, res: Response) => {

    const url = req.query.url?.toString(); // Cast url to string

    try {
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
        console.log(elements); // Logging the html text to the console. Logging what is being scraped to console.

        res.json(elements);
    } catch (error) {
        errorcodes(error, res);
    }
});



export default app;