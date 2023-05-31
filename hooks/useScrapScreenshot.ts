import { useState, useEffect } from 'react';
import axios from "axios";


/**
 * A custom hook to scrape a screenshot from a given URL.
 *
 * @param {string} url - The URL to scrape the PDF from.
 * @param {boolean} trigger - A boolean to trigger the scraping process.
 * @param {() => void} resetTrigger - A function to reset the trigger value.
 * @returns {any} - The path for scraped screenshot
 */
export const useScrapScreenshot = (url: string, trigger: boolean, resetTrigger: () => void) => {
  // Implement the hook logic here    
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
        resetTrigger();
      } catch (error: any) {
        console.log("Axios Error:", error);
        console.log(
          "Error details:",
          error.response?.data,
          error.response?.status,
          error.response?.headers
        );
        resetTrigger();
      }
    };

    if (url && trigger) {
      fetchHTML();
    }
  }, [url, trigger, resetTrigger]);

  return screenshotInfo;

};


const serverCommand = (command: string) => {
    return "http://localhost:3002/" + command + "?url="; // command is the server command to be executed
  };