import { useState, useEffect } from "react";
import axios from "axios";

/*
Most of the functions in this file needs the input of a url and a trigger (boolean true or false) and a reset switch for trigger used.
The trigger is used to trigger the function to run. If the trigger is false, the function will not run.
The url is the url of the page that will be scraped.
The reset switch is used to reset the trigger to false after the function has run.

The functions in this file are:
- useScrapHTML: This function will return the raw html of the page.
- useScrapHTMLArray: This function will return an array of elements from the page.
- useScrapScreenshot: This function will return a screenshot of the page.
- useGetListScreenshotsTaken: This function will return a list of screenshots taken.
- useGetLatestScreenshotsTaken: This function will return the latest screenshot taken.
- useScrapPdf: This function will return a pdf of the page.

The functions in this file are used in the following files:
- ScraperResult.tsx - This is a demo of how to use the functions in this file.
*/

const useScrapHTML = (
  url: string,
  trigger: boolean,
  onCompletion: () => void
) => {
  const serverUrl = serverCommand("scrape"); // url to the server that will scrape the requested page.
  const [rawHTML, setRawHTML] = useState(""); // This is the string that will be returned.

  useEffect(() => {
    const fetchHTML = async () => {
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url)); // get the html from the server sending the url
        const html = response.data; // get the html from the response
        // console.log(html);

        setRawHTML(html);
        onCompletion();
      } catch (error) {
        console.log(error);
        onCompletion();
      }
    };

    if (url && trigger) {
      fetchHTML();
    }
  }, [url, trigger, onCompletion]); // Add the url to the dependency array

  return rawHTML;
};

const useScrapHTMLArray = (
  url: string,
  trigger: boolean,
  onCompletion: () => void
) => {
  const serverUrl = serverCommand("scrapearray");

  const [elements, setElements] = useState<Array<{ tag: string; content: any }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHTML = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url));
        const elementsArray = response.data;

        setElements(elementsArray);
        setIsLoading(false);
        onCompletion();
      } catch (error: any) {
        console.log("Axios Error:", error);
        console.log(
          "Error details:",
          error.response?.data,
          error.response?.status,
          error.response?.headers
        );
        setIsLoading(false);
        onCompletion();
      }
    };

    if (url && trigger && !isLoading) {
      fetchHTML();
    }
  }, [url, trigger, onCompletion, isLoading]);

  return elements;
};

const useScrapScreenshot = (
  url: string,
  trigger: boolean,
  onCompletion: () => void
) => {
  const serverUrl = serverCommand("scrapescreenshot");

  const [screenshotInfo, setScreenshotInfo] = useState<{
    status: string;
    message: string;
    filePath: string;
  } | null>(null);

  useEffect(() => {
    const fetchHTML = async () => {
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url));
        const jsonResponse = response.data;

        setScreenshotInfo(jsonResponse);
        onCompletion();
      } catch (error: any) {
        console.log("Axios Error:", error);
        console.log(
          "Error details:",
          error.response?.data,
          error.response?.status,
          error.response?.headers
        );
        onCompletion();
      }
    };

    if (url && trigger) {
      fetchHTML();
    }
  }, [url, trigger, onCompletion]);

  return screenshotInfo;
};

const useGetListScreenshotsTaken = () => {
  const serverUrl = serverCommand("scrapescreenshotlist"); // url to the server that will take screenshot of requested page.

  const [elements, setElements] = useState("");

  useEffect(() => {
    const fetchHTML = async () => {
      try {
        const response = await axios.get(serverUrl); // get the html from the server sending the url
        const elementsArray = response.data;

        setElements(elementsArray);
      } catch (error: any) {
        console.log("Axios Error:", error);
        console.log(
          "Error details:",
          error.response?.data,
          error.response?.status,
          error.response?.headers
        );
      }
    };

    fetchHTML();
  }, [serverUrl]); // Empty array ensures the effect runs only on component mount

  return elements;
};

const useGetLatestScreenshotsTaken = () => {
  const serverUrl = serverCommand("lastscreenshottaken"); // url to the server that will take screenshot of requested page.

  const [elements, setElements] = useState("");

  useEffect(() => {
    const fetchHTML = async () => {
      try {
        const response = await axios.get(serverUrl); // get the html from the server sending the url
        const elementsArray = response.data;

        setElements(elementsArray);
      } catch (error: any) {
        console.log("Axios Error:", error);
        console.log(
          "Error details:",
          error.response?.data,
          error.response?.status,
          error.response?.headers
        );
      }
    };

    fetchHTML();
  }, [serverUrl]); // Empty array ensures the effect runs only on component mount

  return elements;
};

const useScrapPdf = (
  url: string,
  trigger: boolean,
  onCompletion: () => void
) => {
  const serverUrl = serverCommand("scrapepdf");

  const [pdfInfo, setPdfInfo] = useState<{
    status: string;
    message: string;
    filePath: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPDF = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url));
        const jsonResponse = response.data;

        setPdfInfo(jsonResponse);
        setIsLoading(false);
        onCompletion();
      } catch (error: any) {
        console.log("Axios Error:", error);
        console.log(
          "Error details:",
          error.response?.data,
          error.response?.status,
          error.response?.headers
        );
        setIsLoading(false);
        onCompletion();
      }
    };

    if (url && trigger && !isLoading) {
      fetchPDF();
    }
  }, [url, trigger, onCompletion, isLoading]);

  return pdfInfo;
};
const useScrapeJson = (url: string, trigger: boolean, onCompletion: () => void) => {
  const serverUrl = serverCommand("scrapejson");

  const [jsonInfo, setJsonInfo] = useState<{
    status: string;
    message: string;
    filePath: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchJSON = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url));
        const jsonResponse = response.data;

        setJsonInfo(jsonResponse);
        setIsLoading(false);
        onCompletion();
      } catch (error: any) {
        console.log("Axios Error:", error);
        console.log(
          "Error details:",
          error.response?.data,
          error.response?.status,
          error.response?.headers
        );
        setIsLoading(false);
        onCompletion();
      }
    };

    if (url && trigger && !isLoading) {
      fetchJSON();
    }
  }, [url, trigger, onCompletion, isLoading]);

  return jsonInfo;
};


// ------- Scrape a product from a store like Komplett, Elkjøp, etc. -------
// Need to get storename and a product name to search for.
const useScrapeProduct = (store: string, product: string, trigger: boolean, onCompletion: () => void) => {
  console.log("useScrapeProduct", store, product);
  const storeChosen: string = store;
  const productChosen: string = `&product=${product}`;
  const serverUrl = serverCommand("scrapproduct");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchHTML = async () => {
      setIsLoading(true);
      try {
        // const response = await axios.get(serverUrl + encodeURIComponent(store) + "/" + encodeURIComponent(product));
        const response = await axios.get(serverUrl+storeChosen + productChosen);
        const elementsArray = response.data;

        // setElements(elementsArray);
        setIsLoading(false);
        onCompletion();
      } catch (error: any) {
        console.log("Axios Error:", error);
        console.log(
          "Error details:",
          error.response?.data,
          error.response?.status,
          error.response?.headers
        );
        setIsLoading(false);
        onCompletion();
      }
    };

    if (store && product && trigger && !isLoading) {
      fetchHTML();
    }
  }, [store, product, trigger, onCompletion]);


};


const serverCommand = (command: string) => {
  return "http://localhost:3002/" + command + "?url="; // command is the server command to be executed
};
export {
  useScrapHTML,
  useScrapHTMLArray,
  useScrapScreenshot,
  useGetListScreenshotsTaken,
  useGetLatestScreenshotsTaken,
  useScrapPdf,
  useScrapeJson,
  useScrapeProduct
};
// // Path: helper\scrapers\scrapHTML.ts
