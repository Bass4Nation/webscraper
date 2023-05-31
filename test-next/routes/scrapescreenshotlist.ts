import express, { Request, Response } from "express";
// import axios from "axios";
// import cheerio from "cheerio";
import { latestScreenshot } from "./utils/helper";
import { errorcodes } from "./utils/helper";
import { screenshotList } from "./utils/helper";

/**
 * Finding all screenshots taken on the server.
 * @returns a list of all screenshots taken on the server. 
 */

const app = express();

app.get("/scrapescreenshotlist", async (req: Request, res: Response) => {
    // Path to folder where screenshots is placed from standpoint to the server
    //  ./public/scraped-screenshots/......
    console.log("Finding all screenshots taken on the server.");
    
    const folder_path = "./public/scraped-screenshots";
    try {
      const list = await screenshotList(folder_path);
      console.log(list); // Logging the screenshot list to the console.
      res.send(list);
    } catch (error) {
      errorcodes(error, res);
    }
  });

export default app;
