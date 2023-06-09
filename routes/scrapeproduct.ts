import express, { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { errorcodes } from "./utils/helper";
import { scrapFromStore } from "./utils/helper";
import { waitTime } from "./utils/helper";

/**
 * For scraping a product from several stores
 * @param store name - komplett, power, elkjop or all, or your own store
 * @param product - The product to scrape
 * @return nothing yet. Will return a json object with data/filepath of screenshot and pdf.
 * @Komplett - NOT WORKING (This got blocked by Komplett.no)
 * @POWER - WORKING
 * @ELKJOP - WORKING
 */


const app = express();

app.get("/scrapproduct", async (req: any, res: any) => {
    console.log("GET /scrapproduct called with query: ", req.query);
  
    const store: any = req.query.url;
  
    const product = req.query.product;
    console.log("Product: ", product);
  
  
    try {
      await scrapFromStore(store, product); // Scrape the product from the store. This is where the developer need to add their own store.
      await waitTime(4); // Wrap setTimeout in a Promise. Waiting because the page needs to load before the screenshot is taken.
      res.status(200).json({ status: 'success', message: 'Scraping complete' });
    } catch (error) {
      errorcodes(error, res);
    }
  
  });

  export default app;