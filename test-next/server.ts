// ----------------- Imports ----------------- //
import UserAgent from "user-agents";
import http from 'http';
import express from "express"; // Added express to create the server.
import axios from "axios"; // Added axios to scrape the website.
import cheerio from "cheerio"; // Added cheerio to scrape the website.
import rateLimit from "express-rate-limit"; // Added a limiter since it would not stop scraping the website. So a limiter was added to stop the scraping.
import cors from "cors"; // Added cors to allow the website to access the api.
import puppeteer from "puppeteer"; //
import fs from "fs"; // File system module to read files/file location etc...
import { title } from "process";
// -------------- Routes imports --------------- //
import scrape from "./routes/scrape";
import scrapeh1 from "./routes/scrapeh1";
import scrapearray from "./routes/scrapearray";
import scrapejson from "./routes/scrapejson";
import scrapescreenshot from "./routes/scrapescreenshot";
import scrapepdf from "./routes/scrapepdf";
import latestscreenshottaken from "./routes/lastscreenshottaken";
import scrapeproduct from "./routes/scrapeproduct";

/**
 * This is the main file for the webscraper API. 
 * This file is where the server is created and the routes are imported.
 * The server is created with express and the routes are imported from the routes folder.
 * This is premade for the webscraper framework. And should be used as a template for future projects or as an example on how this is used.
 */




const app = express(); // Added express to create the server.
const PORT = process.env.PORT || 3002; // Changed the port to 3000 since 8080 was already in use.

let server: http.Server;

// ----------------- Start the server ----------------- //
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

if (process.env.NODE_ENV !== 'test') {
  const serverInstance = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
export async function startServer() {
  server = app.listen(3000);
  return server;
}

export async function stopServer(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}


const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // Limit each IP to 10 requests per windowMs
  message: "Too many requests, please try again later.",
});

app.use((req: any, res: any, next: any) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

app.use(cors()); // Added cors to allow the website to access the api.
// More info at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// ----------------- Routes ----------------- //
app.use("/scrape", limiter); // Apply rate limiter to the /scrape endpoint
// Added a limiter since it would not stop scraping the website. So a limiter was added to stop the scraping.

app.use("/scrape", scrape);

app.get("/scrapeh1", scrapeh1);

// ----------------- Routes for scaping and returning as array ----------------- //
app.use("/scrapearray", limiter); // Apply rate limiter to the /scrape endpoint
// Added a limiter since it would not stop scraping the website. So a limiter was added to stop the scraping.

app.get("/scrapearray", scrapearray);

app.get("/scrapejson", scrapejson);
// ----------------- Routes for scaping and returning as array ----------------- //
app.get("/scrapescreenshot", scrapescreenshot);

// ----------------- Routes for scaping and returning as array ----------------- //
// Get a list over all screenshots taken. With filepath and a way display them.
app.get("/scrapescreenshotlist", scrapescreenshot);

// ----------------- Routes for Latest screenshot ----------------- //
// Get the last screenshot taken. With filepath and a way display them.
app.get("/lastscreenshottaken", latestscreenshottaken);

// ----------------- Routes for scrapepdf ----------------- //
app.get("/scrapepdf", scrapepdf);

app.get("/scrapproduct", scrapeproduct);


// export default app; // Export the app to be used in other files.
// export default serverInstance; // Export the app to be used in other files. Only Uncomment this when testing with Jest.
export default app;