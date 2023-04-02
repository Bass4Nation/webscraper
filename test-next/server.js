// This file is javascript code since I did not get the Typescript version to work.
const express = require("express"); // Added express to create the server.
const axios = require("axios"); // Added axios to scrape the website.
const cheerio = require("cheerio"); // Added cheerio to scrape the website.
const rateLimit = require("express-rate-limit"); // Added a limiter since it would not stop scraping the website. So a limiter was added to stop the scraping.
const cors = require("cors"); // Added cors to allow the website to access the api.
const puppeteer = require("puppeteer"); //
const { title } = require("process");
const RobotsParser = require("robots-txt-parser"); // Import robots-txt-parser instead

const app = express(); // Added express to create the server.
const PORT = process.env.PORT || 3002; // Changed the port to 3000 since 8080 was already in use.

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many requests, please try again later.",
});

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});
app.use(cors()); // Added cors to allow the website to access the api.
// More info at: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

// Function to fetch and parse the robots.txt file
const canScrape = async (url) => {
  const robotsUrl = new URL(url);
  robotsUrl.pathname = "/robots.txt";
  try {
    const response = await axios.get(robotsUrl.toString());
    const robotsParser = new RobotsParser();
    robotsParser.parse(response.data);
    const userAgent =
      "scrape-bot-schoolassignment/0.3 (+https://github.com/Bass4Nation/webscraper;)";
    return robotsParser.isAllowed(url, userAgent); // Swap the arguments for isAllowed
  } catch (error) {
    console.error(`Error fetching robots.txt: ${error}`);
    return true;
  }
};

// ----------------- Routes ----------------- //
app.use("/scrape", limiter); // Apply rate limiter to the /scrape endpoint
// Added a limiter since it would not stop scraping the website. So a limiter was added to stop the scraping.

app.get("/scrape", async (req, res) => {
  const url = req.query.url;

  // Check if you are allowed to scrape the website
  const allowedToScrape = await canScrape(url);
  if (!allowedToScrape) {
    res
      .status(403)
      .send("Scraping this website is not allowed according to robots.txt");
    return;
  }
  try {
    const response = await axios.get(url);
    const body = response.data;
    const $ = cheerio.load(body);
    const html = $("*"); // Changed the * to div etc.... to only scrape the div tags.
    // console.log(html.text()); // Logging the html text to the console. Logging what is being scraped to console.

    res.send(html.text());
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping the website");
  }
});

// ----------------- Routes for scaping and returning as array ----------------- //
app.use("/scrapearray", limiter); // Apply rate limiter to the /scrape endpoint
// Added a limiter since it would not stop scraping the website. So a limiter was added to stop the scraping.

app.get("/scrapearray", async (req, res) => {
  const url = req.query.url;

  // Check if you are allowed to scrape the website
  const allowedToScrape = await canScrape(url);
  if (!allowedToScrape) {
    res
      .status(403)
      .send("Scraping this website is not allowed according to robots.txt");
    return;
  }

  try {
    const response = await axios.get(url);
    const body = response.data;
    const $ = cheerio.load(body);
    const elements = [];

    $("*").each(function () {
      elements.push($(this).html());
      // console.log($(this).html());
    });

    res.send(elements);
  } catch (error) {
    errorcodes(error, res);
  }
});

// ----------------- Routes for scaping and returning as array ----------------- //
app.get("/scrapescreenshot", async (req, res) => {
  // Coming soon
  // Create folder if folder does not exist
  // public/scraped-screenshots/

  const url = req.query.url;

  // Check if you are allowed to scrape the website
  const allowedToScrape = await canScrape(url);
  if (!allowedToScrape) {
    res
      .status(403)
      .send("Scraping this website is not allowed according to robots.txt");
    return;
  }

  // console.log(url);
  let filename = "template";
  const filetype = ".png";

  filename = await titleFromURL(url);

  console.log(filename);

  const savepath = "./public/scraped-screenshots/" + filename + filetype;

  const seconds = 4 * 1000;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    setTimeout(async () => {
      await page.screenshot({ path: savepath });
      await browser.close();
    }, seconds);
  } catch (error) {
    errorcodes(error, res);
  }
});

// ----------------- Routes for scaping and returning as array ----------------- //
// Get a list over all screenshots taken. With filepath and a way display them.
app.get("/scrapescreenshotlist", async (req, res) => {
  // Path to folder where screenshots is placed from standpoint to the server
  //  ./public/scraped-screenshots/......
  const folder_path = "./public/scraped-screenshots";
  try {
    const list = await screenshotList(folder_path);
    console.log(list);
    res.send(list);
  } catch (error) {
    errorcodes(error, res);
  }
});

// ----------------- Routes for Latest screenshot ----------------- //
// Get the last screenshot taken. With filepath and a way display them.
app.get("/lastscreenshottaken", async (req, res) => {
  // Path to folder where screenshots is placed from standpoint to the server"
  //  ./public/scraped-screenshots/......
  const folder_path = "./public/scraped-screenshots";
  try {
    const list = await latestScreenshot(folder_path);
    console.log(list);
    res.send(list);
  } catch (error) {
    errorcodes(error, res);
  }
});

// A function that convert link to this format : www_komplett_no_2023327164050
// Remove http: or https: and replace all special characters with _
// Fine for now. Can be used as name for files saved on server.
async function titleFromURL(url) {
  const date = new Date();
  // Get timestamp from 1970-01-01 00:00:00
  const milliseconds = date.getTime();

  const timestamp = `${date.getFullYear()}${
    date.getMonth() + 1
  }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${milliseconds}`;
  const filename = `${url
    .replace(/(^\w+:|^)\/\//, "")
    .replace(/[^a-zA-Z0-9_]/g, "_")}_${timestamp}`;

  return filename;
}

//  A function that returns a list of all files in a folder with path to the file.
const screenshotList = async (folder_path) => {
  const fs = require("fs"); // File system module to read files
  const path = require("path"); // Path to file system folder and files in folder

  const files = fs.readdirSync(folder_path); // Read all files in folder

  const arr = [];

  //  Loop through all files and add them to an array with path to the file.
  files.forEach((file) => {
    arr.push({
      name: file,
      path: path.join(folder_path, file),
    });
  });

  return arr; // Return the array with all files in the folder.
};

// A function that returns the latest screenshot taken.
const latestScreenshot = async (folder_path) => {
  const allfiles = await screenshotList(folder_path); // Get all files in folder
  let latestFile = null; // Create a variable to store the latest file
  let maxNumber = 0; // Create a variable to store the maximum number found in filenames

  // Loop through all files and check if the number in the filename is larger than the current maxNumber
  allfiles.forEach((file) => {
    const fileNumber = extractNumber(file.name); // Get the number from the filename
    if (fileNumber > maxNumber) {
      maxNumber = fileNumber;
      latestFile = file;
    }
  });
  console.log(maxNumber);

  return latestFile;
};

// A function that extracts the timestamp from the filename.
function extractNumber(filename) {
  const regex = /.*-(\d+)\./;
  const result = filename.match(regex);

  if (result && result[1]) {
    return parseInt(result[1], 10);
  }

  return null;
}

// Error codes simplified
const errorcodes = (error, code) => {
  console.error(error);
  code.status(500).send("Error occurred while scraping the website");
};

// puppeteer can also make pdf. Maybe create in later stages.

// Prints in terminal when the server is starting. It is this port that the requests are going through.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
