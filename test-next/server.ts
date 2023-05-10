const UserAgent = require("user-agents");
const express = require("express"); // Added express to create the server.
const axios = require("axios"); // Added axios to scrape the website.
const cheerio = require("cheerio"); // Added cheerio to scrape the website.
const rateLimit = require("express-rate-limit"); // Added a limiter since it would not stop scraping the website. So a limiter was added to stop the scraping.
const cors = require("cors"); // Added cors to allow the website to access the api.
const puppeteer = require("puppeteer"); //
const { title } = require("process");
const fs = require("fs"); // File system module to read files/file location etc...



const app = express(); // Added express to create the server.
const PORT = process.env.PORT || 3002; // Changed the port to 3000 since 8080 was already in use.

// ----------------- Start the server ----------------- //
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
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

app.get("/scrape", async (req: any, res: any) => {
  const url = req.query.url;

  try {
    const response = await axios.get(url);
    const body = response.data;
    const $ = cheerio.load(body);
    const html = $("*"); // Changed the * to div etc.... to only scrape the div tags.
    console.log(html.text()); // Logging the html text to the console. Logging what is being scraped to console.

    res.send(html.text());
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping the website");
  }
});

app.get("/scrapeh1", async (req: any, res: any) => {
  const url = req.query.url;

  try {
    const response = await axios.get(url);
    const body = response.data;
    const $ = cheerio.load(body);
    const html = $("h1"); // Extract only the h1 element
    const text = html.text().trim(); // Get the text and remove any whitespace
    console.log(text);

    res.send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error occurred while scraping the website");
  }
});

// ----------------- Routes for scaping and returning as array ----------------- //
app.use("/scrapearray", limiter); // Apply rate limiter to the /scrape endpoint
// Added a limiter since it would not stop scraping the website. So a limiter was added to stop the scraping.

app.get("/scrapearray", async (req: any, res: any) => {
  const url = req.query.url;

  try {
    const response = await axios.get(url);
    const body = response.data;
    const $ = cheerio.load(body);

    const createObject = (element: any) => {
      const tagName = element.prop("tagName").toLowerCase();
      const children = element.children().toArray().map((child: any) => createObject($(child)));

      return {
        tag: tagName,
        content: children.length > 0 ? children : element.text(),
      };
    };

    const elements = $("body > *").toArray().map((element: any) => createObject($(element)));
    console.log(elements); // Logging the html text to the console. Logging what is being scraped to console.

    res.json(elements);
  } catch (error) {
    errorcodes(error, res);
  }
});

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
// ----------------- Routes for scaping and returning as array ----------------- //
app.get("/scrapescreenshot", async (req: any, res: any) => {
  // public/scraped-screenshots/

  const url = req.query.url;
  let filename = "template";
  const filetype = ".png";

  filename = await titleFromURL(url);

  // console.log(filename);

  const savepath = "./public/scraped-screenshots/" + filename + filetype;
  const responsePath = "./scraped-screenshots/" + filename + filetype; // Path to the file from the standpoint of the client. Without public.


  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await waitTime(4); // Wrap setTimeout in a Promise. Waiting because the page needs to load before the screenshot is taken.
    await page.screenshot({ path: savepath });
    await browser.close();

    res.status(200).json({ status: 'success', message: 'Screenshot created successfully', filePath: responsePath, filename: filename + filetype });
  } catch (error) {
    errorcodes(error, res);
  }
});

// ----------------- Routes for scaping and returning as array ----------------- //
// Get a list over all screenshots taken. With filepath and a way display them.
app.get("/scrapescreenshotlist", async (req: any, res: any) => {
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

// ----------------- Routes for Latest screenshot ----------------- //
// Get the last screenshot taken. With filepath and a way display them.
app.get("/lastscreenshottaken", async (req: any, res: any) => {
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

// ----------------- Routes for scrapepdf ----------------- //
app.get("/scrapepdf", async (req: any, res: any) => {
  // public/scraped-pdfs/

  const url = req.query.url;
  let filename = "template";
  const filetype = ".pdf";

  // console.log(url);

  filename = await titleFromURL(url);

  const savepath = "./public/scraped-pdfs/" + filename + filetype;
  const responsePath = "./scraped-pdfs/" + filename + filetype; // Path to the file from the standpoint of the client. Without public.



  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    await waitTime(4); // Wrap setTimeout in a Promise. Waiting because the page needs to load before the pdf is created.
    await page.pdf({ format: 'A4', path: savepath, printBackground: true });
    await browser.close();

    // You may want to send a success response after the PDF is created and the browser is closed
    res.status(200).json({ status: 'success', message: 'PDF created successfully', filePath: responsePath, filename: filename + filetype });

  } catch (error) {
    errorcodes(error, res);
  }
});

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

async function fileWriterScrappedData(savepath: string, filename: string, fileformat: string, data: any, res: any) {
  console.log("Writing file" + filename + fileformat);
  try {
    // Save the elements string as a text file
    fs.writeFile(savepath + filename + fileformat, data, (err: any) => {
      if (err) {
        console.error("Error writing text file:", err);
        res.status(500).json({ error: "Error saving the scraped data to a file" });
      } else {
        res.json({ success: true, message: "Scraped data saved to " + filename + fileformat });
      }
    });
  } catch (error) {
    console.error("Error writing text file:", error);
  }
}

// A function that convert link to this format : www_komplett_no_2023327164050
// Remove http: or https: and replace all special characters with _
// Fine for now. Can be used as name for files saved on server.
async function titleFromURL(url: string) {
  const date = new Date();
  // Get timestamp from 1970-01-01 00:00:00
  const milliseconds = date.getTime();

  const timestamp = `${date.getFullYear()}${date.getMonth() + 1
    }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${milliseconds}`;
  const filename = `${url
    .replace(/(^\w+:|^)\/\//, "")
    .replace(/[^a-zA-Z0-9_]/g, "_")}_${timestamp}`;

  return filename;
}

//  A function that returns a list of all files in a folder with path to the file.
const screenshotList = async (folder_path: string) => {
  const fs = require("fs"); // File system module to read files
  const path = require("path"); // Path to file system folder and files in folder

  const files = fs.readdirSync(folder_path); // Read all files in folder

  const arr: any = [];

  //  Loop through all files and add them to an array with path to the file.
  files.forEach((file: any) => {
    arr.push({
      name: file,
      path: path.join(folder_path, file),
    });
  });

  return arr; // Return the array with all files in the folder.
};

// A function that returns the latest screenshot taken.
const latestScreenshot = async (folder_path: string) => {
  const allfiles = await screenshotList(folder_path); // Get all files in folder
  let latestFile = null; // Create a variable to store the latest file
  let maxNumber = 0; // Create a variable to store the maximum number found in filenames

  // Loop through all files and check if the number in the filename is larger than the current maxNumber
  allfiles.forEach((file: any) => {
    const fileNumber: any = extractNumber(file.name); // Get the number from the filename
    if (fileNumber > maxNumber) {
      maxNumber = fileNumber;
      latestFile = file;
    }
  });
  console.log(maxNumber);

  return latestFile;
};
// ----------------------------- -------------------------------
//  A function that scrap data from a specific store and product.
type StoreName = "komplett" | "power" | "elkjop" | "all";

const scrapFromStore = async ( store: StoreName, product: string) => {
  console.log("Scraping from store: " + store + " and product: " + product);

  const encodedProduct = encodeURIComponent(product);

  // const storeUrls: Record<StoreName, string> = {
  //   "komplett": "https://www.komplett.no/search?q=" + encodedProduct,
  //   "power": "https://www.power.no/search/?q=" + encodedProduct,
  //   "elkjop": "https://www.elkjop.no/search/" + encodedProduct,
  //   "all": "",
  // };
  // const searchProduct: string = storeUrls[store] || storeUrls["komplett"];
  // console.log(searchProduct);

  //  ----------- Handle the different stores  ----------------
  // -------------------- Power ------------------------------
  async function handlePowerScraping() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const userAgent = new UserAgent();
    await page.setUserAgent(userAgent.toString());
    // await page.goto(url);
    await page.goto("https://www.power.no/search/?q=" + encodedProduct, { waitUntil: 'networkidle0' });

    console.log("Scraping from power");
    const acceptCookies = await page.$('button.coi-banner__accept'); // Find the accept cookies button
    if (acceptCookies) {
      await acceptCookies.click();
    }

    // Find the product by its name
    const productToFind: string = product;
  // Find the product by a partial name match
  const productElement = await page.$x(`//a[contains(@class, 'product-item')]//h6[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ', 'abcdefghijklmnopqrstuvwxyzæøå'), '${productToFind.toLowerCase()}')]`);

  if (productElement.length > 0) {
    // Product found, now find the 'a' element with the class 'product-item'
    const productLinkElement = await productElement[0].$x(`./ancestor::a[contains(@class, 'product-item')]`);

    if (productLinkElement.length > 0) {
      // Get the 'href' attribute of the product link
      const href = await page.evaluate((el: any) => el.getAttribute('href'), productLinkElement[0]);

      // Navigate to the product page
      await page.goto("https://www.power.no"+href, { waitUntil: 'networkidle0' });

      // Perform any actions you want on the product page
      console.log('Navigated to the product page:', href);
    } else {
      console.log('Product link not found for:', productToFind);
    }
  } else {
    console.log('Product not found:', productToFind);
  }
    await waitTime(2);
    await page.screenshot({ path: `./public/scraped-products/screenshots/power.png` });
    await page.pdf({ format: 'A4', path: `./public/scraped-products/pdfs/power.pdf`, printBackground: true });

    await browser.close();
    console.log("Scraping from power COMPLETE");

  }

  // -------------------- Komplett ------------------------------
  async function handleKomplettScraping() {
    // Implementation for Komplett store
    console.log("Scraping from komplett");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const userAgent = new UserAgent();
    await page.setUserAgent(userAgent.toString());
    // await page.goto(url);
    await page.goto("https://www.komplett.no/search?q=" + encodedProduct, { waitUntil: ['load', 'networkidle0'] });
    const acceptCookies = await page.$('button.btn-large.primary'); // Find the accept cookies button
    if (acceptCookies) {
      await acceptCookies.click();
    } else { console.log("No cookies to accept"); }
    // Find the product by its name  
    const productToFind: string = product;
    const productElement = await page.$x(`//div[contains(@class, 'name')]//h2[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${productToFind.toLowerCase()}")]`);

    if (productElement.length > 0) {
      console.log('Product found:', productToFind);
      
      // Product found, now find the 'a' element with the class 'product-link'
      const productLinkElement = await productElement[0].$x(`./ancestor::div[contains(@class, 'name')]/a[contains(@class, 'product-link')]`);
  
      if (productLinkElement.length > 0) {
    //     // Get the 'href' attribute of the product link
        console.log("Product link found");
        

        const href = await page.evaluate((el: any) => el.getAttribute('href'), productLinkElement[0]);
        console.log("href: " + href);
        
  
        // Navigate to the product page
        await page.goto("https://www.komplett.no" + href, { waitUntil: 'networkidle0' });
 
        // Perform any actions you want on the product page
        console.log('Navigated to the product page:', href);
      } else {
        console.log('Product link not found for:', productToFind);
      }
    } else {
      console.log('Product not found:', productToFind);
    }
    await page.screenshot({ path: `./public/scraped-products/screenshots/komplett.png` });
    await page.pdf({ format: 'A4', path: `./public/scraped-products/pdfs/komplett.pdf`, printBackground: true });

    await browser.close();
    console.log("Scraping from komplett COMPLETE");

  }


  // -------------------- Elkjop ------------------------------
  async function handleElkjopScraping() {
    // Implementation for Elkjop store
    console.log("Scraping from elkjop");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const userAgent = new UserAgent();
    await page.setUserAgent(userAgent.toString());
    // await page.goto(url);
    // await page.goto(searchProduct, {  timeout: 60000  });
    await page.goto("https://www.elkjop.no/search/" + encodedProduct, { waitUntil: ['load', 'networkidle0'] });
    const productToFind: string = product;
  // Find the product by a partial name match
  const productElement = await page.$x(`//h2[contains(@class, 'h2 ng-star-inserted')]//a[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZÆØÅ', 'abcdefghijklmnopqrstuvwxyzæøå'), '${productToFind.toLowerCase()}')]`);

  if (productElement.length > 0) {
    // Get the 'href' attribute of the product link
    const href = await page.evaluate((el: any) => el.getAttribute('href'), productElement[0]);

    // Navigate to the product page
    await page.goto("https://www.elkjop.no/"+href, { waitUntil: 'networkidle0' });

    // Perform any actions you want on the product page
    console.log('Navigated to the product page:', href);
  } else {
    console.log('Product not found:', productToFind);
  }
  await page.screenshot({ path: `./public/scraped-products/screenshots/elkjop.png` });
  await page.pdf({ format: 'A4', path: `./public/scraped-products/pdfs/elkjop.pdf`, printBackground: true });
  await browser.close();
  console.log("Scraping from elkjøp COMPLETE");

  }

  // -----------------  All stores -----------------------------
  async function handleAllStores() {
    // Implementation for all stores one at a time
    console.log("Scraping from all stores");
    await handlePowerScraping();
    await handleKomplettScraping();
    await handleElkjopScraping();
  }

// Create a mapping from store names to their handling functions
const storeHandlers: Record<StoreName, () => Promise<void>> = {
  "power": handlePowerScraping,
  "komplett": handleKomplettScraping,
  "elkjop": handleElkjopScraping,
  "all": handleAllStores,
};

// Use the storeHandlers object to call the appropriate handling function
const handler = storeHandlers[store];
if (handler) {
  await handler(); // No 'page' argument is required now
} else {
  console.log("No store found");
}

  // await waitTime(2);
  // await page.screenshot({ path: `${store}.png` });

}


// A function that extracts the timestamp from the filename.
function extractNumber(filename: string) {
  const regex = /.*-(\d+)\./;
  const result = filename.match(regex);

  if (result && result[1]) {
    return parseInt(result[1], 10);
  }

  return null;
}

// A function that returns a promise that resolves after a given time.
const waitTime = async (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time * 1000);
  });
};


// Error codes simplified
const errorcodes = (error: any, code: any) => {
  console.error(error);
  code.status(500).send("Error occurred while scraping the website");
  console.log("Error occurred while scraping the website");
};

// puppeteer can also make pdf. Maybe create in later stages.

// Prints in terminal when the server is starting. It is this port that the requests are going through.


// export default app; // Export the app to be used in other files.
// export default server; // Export the app to be used in other files. Only Uncomment this when testing with Jest.