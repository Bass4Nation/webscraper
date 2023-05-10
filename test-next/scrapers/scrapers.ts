import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';
import { waitTime } from "@/utils/serverhelper";

// A function that scrap data from a specific store and product.
export type StoreName = "komplett" | "power" | "elkjop" | "all";

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

}

