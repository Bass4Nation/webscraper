import express, { Request, Response } from "express";
// import axios from "axios";
// import cheerio from "cheerio";
import { latestScreenshot } from "./utils/helper";
import { errorcodes } from "./utils/helper";
import { screenshotList } from "./utils/helper";

const app = express();

app.get("/", async (req: any, res: any) => {
    // Path to folder where screenshots is placed from standpoint to the server
    //  ./public/scraped-screenshots/......
    const folder_path = "./public/scraped-screenshots";
    try {
      const list = await screenshotList(folder_path);
      // console.log(list); // Logging the screenshot list to the console.
      res.send(list);
    } catch (error) {
      errorcodes(error, res);
    }
  });

export default app;
