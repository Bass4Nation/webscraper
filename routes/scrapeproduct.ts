import express, { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { errorcodes } from "./utils/helper";
import { scrapFromStore } from "./utils/helper";
import { waitTime } from "./utils/helper";

/**
 * For scraping a product from several stores
 * Komplett.no - NOT WORKING (This got blocked by Komplett.no)
 * POWER.no - WORKING
 * ELKJOP.no - WORKING
 */


const app = express();

app.get("/scrapproduct", async (req: any, res: any) => {
    console.log("GET /scrapproduct called with query: ", req.query);
  
    const store: any = req.query.url;
  
    const product = req.query.product;
    console.log("Product: ", product);
  
  
    try {
      await scrapFromStore(store, product)
      await waitTime(4); // Wrap setTimeout in a Promise. Waiting because the page needs to load before the screenshot is taken.
      res.status(200).json({ status: 'success', message: 'Scraping complete' });
    } catch (error) {
      errorcodes(error, res);
    }
  
  });

  export default app;