import express, { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";

const app = express();

app.get("/scrape", async (req: Request, res: Response) => {
  const url: string = req.query.url as string;
    
  try {
    const response = await axios.get(url);
    const body = response.data;
    const $ = cheerio.load(body);
    const html = $("*");
    console.log(html.text());

    res.send(html.text());
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping the website");
  }
});

export default app;
