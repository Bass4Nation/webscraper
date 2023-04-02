import { useState, useEffect } from "react";
import axios from "axios";
// import {startArrayFromData} from "./cleanup";

const useScrapHTML = (url: string, trigger: boolean) => {
  const serverUrl = serverCommand("scrape");
  const [rawHTML, setRawHTML] = useState("");

  useEffect(() => {
    const fetchHTML = async () => {
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url));
        const html = response.data;
        console.log(html);

        setRawHTML(html);
      } catch (error) {
        console.log(error);
      }
    };

    if (url && trigger) {
      fetchHTML();
    }
  }, [url, trigger]); // Add the url to the dependency array

  return rawHTML;
};

const useScrapHTMLArray = (url: string, trigger: boolean) => {
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

    if (url && trigger) {
      fetchHTML();
    }
  }, [url, trigger]); // Empty array ensures the effect runs only on component mount
};

const useScrapScreenshot = (url: string, trigger: boolean) => {
  const serverUrl = serverCommand("scrapescreenshot"); // url to the server that will take screenshot of requested page.

  const [elements, setElements] = useState("");

  useEffect(() => {
    const fetchHTML = async () => {
      try {
        const response = await axios.get(serverUrl + encodeURIComponent(url)); // get the html from the server sending the url
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

    if (url  && trigger) {
      fetchHTML();
    }
  }, [url, trigger]); // Empty array ensures the effect runs only on component mount

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

const useScrapPdf = (url: string) => {};

const serverCommand = (command: string) => {
  return "http://localhost:3002/" + command + "?url="; // command is the server command to be executed
};
export { useScrapHTML, useScrapHTMLArray, useScrapScreenshot, useGetListScreenshotsTaken, useGetLatestScreenshotsTaken };
// // Path: helper\scrapers\scrapHTML.ts
