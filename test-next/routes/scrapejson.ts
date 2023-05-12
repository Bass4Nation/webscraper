import express, { Request, Response } from "express";
import axios from "axios";
import cheerio from "cheerio";
import { errorcodes } from "./utils/helper";
import { fileWriterScrappedData } from "./utils/helper";
import { titleFromURL } from "./utils/helper";

const app = express();

app.get("/scrapejson", async (req: any, res: any) => {
    const url = req.query.url;
    try {
      const response = await axios.get(url);
      const body = response.data;
      const $ = cheerio.load(body);
      let filename = "template"; // Default filename
      const filetype = ".json"; // Filetype
      const savepath = "./public/scraped-json/"; // Path to folder where json is placed from standpoint to the server
      filename = await titleFromURL(url); // Get the title from the url.
  
  
      const createObject = (element: any) => {
        const tagName = element.prop("tagName").toLowerCase(); // Get the tag name and make it lowercase.
        const children = element.children().toArray().map((child: any) => createObject($(child))); // Get the children of the element and create an object for each child.
  
        return {
          tag: tagName,
          content: children.length > 0 ? children : element.text(),
        }; // Return the object with the tag name and the content.
      };
  
      const elements = $("body > *").toArray().map((element: any) => createObject($(element))); // Get the body and all the children of the body and create an object for each child.
      // console.log(elements);
  
      // Convert the elements array to a string representation
      const elementsString = JSON.stringify(elements, null, 2);
  
      fileWriterScrappedData(savepath, filename, filetype, elementsString, res); // Write the file to the server.
  
    } catch (error) {
      errorcodes(error, res);
    }
  });

  export default app;