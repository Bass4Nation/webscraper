import UserAgent from "user-agents";
import puppeteer from "puppeteer"; //
import fs from "fs"; // File system module to read files/file location etc...



/**
 * 
 * @param savepath  The path to where the file should be saved
 * @param filename  The name of the file
 * @param fileformat  The format of the file
 * @param data  The data to be saved
 * @param res  The response object
 */
export async function fileWriterScrappedData(savepath: string, filename: string, fileformat: string, data: any, res: any) {
    console.log("Writing file" + filename + fileformat);
    // Path to the file from the standpoint of the client. Without public.
    const responsePath = "./scraped-json/" + filename + fileformat;

    try {
        // Save the elements string as a text file
        fs.writeFile(savepath + filename + fileformat, data, (err: any) => {
            if (err) {
                console.error("Error writing text file:", err);
                res.status(500).json({ error: "Error saving the scraped data to a file" });
            } else {
                res.json({ status: "success", message: "Scraped data saved to " + filename + fileformat, filePath: responsePath, filename: filename + fileformat });
            }
        });
    } catch (error) {
        console.error("Error writing text file:", error);
    }
}

// A function that convert link to this format : www_komplett_no_2023327164050
// Remove http: or https: and replace all special characters with _
// Fine for now. Can be used as name for files saved on server.
/**
 * 
 * @param url The url to be converted
 * @returns The converted url
 */
export async function titleFromURL(url: string) {
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
/**
 * 
 * @param folder_path The path to the folder
 * @returns An array with all files in the folder
 */
export const screenshotList = async (folder_path: string) => {
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
/**
 * 
 * @param folder_path The path to the folder
 * @returns  The latest screenshot taken
 */
export const latestScreenshot = async (folder_path: string) => {
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
/**
 * 
 * @param store  The store to scrap from - one of the following: "komplett", "power", "elkjop" or "all"
 * @param product  The product to scrap - a string - example: "playstation 5"
 */
export const scrapFromStore = async (store: StoreName, product: string) => {
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
                await page.goto("https://www.power.no" + href, { waitUntil: 'networkidle0' });

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
            await page.goto("https://www.elkjop.no/" + href, { waitUntil: 'networkidle0' });

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
/**
 * 
 * @param filename - The filename to extract the timestamp from
 * @returns  The timestamp as a number
 */
export function extractNumber(filename: string) {
    const regex = /.*-(\d+)\./;
    const result = filename.match(regex);

    if (result && result[1]) {
        return parseInt(result[1], 10);
    }

    return null;
}

// A function that returns a promise that resolves after a given time.
/**
 * 
 * @param time - The time to wait in seconds before resolving the promise
 */
export const waitTime = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time * 1000);
    });
};


// Error codes simplified
/**
 * 
 * @param error - The error that occurred while scraping the website
 * @param code - The error code to send back to the client
 */
export const errorcodes = (error: any, code: any) => {
    console.error(error);
    code.status(500).send("Error occurred while scraping the website");
    console.log("Error occurred while scraping the website");
};