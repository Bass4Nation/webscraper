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
  const serverUrl = serverCommand("scrape");
  const [rawHTML, setRawHTML] = useState("");

  useEffect(() => {
    const fetchHTML = async () => {
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url));
        const html = response.data;
        console.log(html);

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
  const serverUrl = serverCommand("scrapearray"); // url to the server that will scrape the html

  const [elements, setElements] = useState([]);
  // const [cleanedElements, setCleanedElements] = useState([]); // array of elements that will be returned to the component [

  useEffect(() => {
    const fetchHTML = async () => {
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url)); // get the html from the server sending the url
        const elementsArray = response.data;
        // console.log(elementsArray);

        setElements(elementsArray);
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
  }, [url, trigger, onCompletion]); // Empty array ensures the effect runs only on component mount
};

const useScrapScreenshot = (
  url: string,
  trigger: boolean,
  onCompletion: () => void
) => {
  const serverUrl = serverCommand("scrapescreenshot"); // url to the server that will take screenshot of requested page.

  const [elements, setElements] = useState("");

  useEffect(() => {
    const fetchHTML = async () => {
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url)); // get the html from the server sending the url
        const elementsArray = response.data;

        setElements(elementsArray);
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
    onCompletion();
  }, [url, trigger, onCompletion]); // Empty array ensures the effect runs only on component mount

  return elements;
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
  const serverUrl = serverCommand("scrapepdf"); // url to the server that will take screenshot of requested page.

  const [pdfInfo, setPdfInfo] = useState<{
    status: string;
    message: string;
    filePath: string;
  } | null>(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url));
        const jsonResponse = response.data;

        setPdfInfo(jsonResponse);
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
      fetchPDF();
    }
  }, [url, trigger, onCompletion]);

  return pdfInfo;
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
};
// // Path: helper\scrapers\scrapHTML.ts
