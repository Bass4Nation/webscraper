import express, { Request, Response } from "express";
// import axios from "axios";
// import cheerio from "cheerio";
import { latestScreenshot } from "./utils/helper";
import { errorcodes } from "./utils/helper";

/**
 * Return the latest screenshot taken
 * @param none - No parameters
 * @returns {string} The path of the last screenshot taken
 */

const app = express();

app.get("/lastscreenshottaken", async (req: Request, res: Response) => {
    // Path to folder where screenshots is placed from standpoint to the server"
    //  ./public/scraped-screenshots/......
    const folder_path = "./public/scraped-screenshots";
    try {
        const list = await latestScreenshot(folder_path);
        // console.log(list); // Logging the screenshot list to the console. Which is the latest screenshot taken.
        res.send(list);
    } catch (error) {
        errorcodes(error, res);
    }
});


export default app;
