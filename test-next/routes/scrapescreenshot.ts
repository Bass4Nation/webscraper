import express, { Request, Response } from "express";
import { errorcodes } from "./utils/helper";
import { waitTime } from "./utils/helper";
import { titleFromURL } from "./utils/helper";
import puppeteer from "puppeteer";

const scrapescreenshot = async (req: any, res: any) => {
  const url = req.query.url;
  let filename = "template";
  const filetype = ".png";

  filename = await titleFromURL(url);

  const savepath = "./public/scraped-screenshots/" + filename + filetype;
  const responsePath = "./scraped-screenshots/" + filename + filetype; 

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await waitTime(4); 
    await page.screenshot({ path: savepath });
    await browser.close();

    res.status(200).json({ status: 'success', message: 'Screenshot created successfully', filePath: responsePath, filename: filename + filetype });
  } catch (error) {
    errorcodes(error, res);
  }
};

export default scrapescreenshot;
