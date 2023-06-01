import { useState, useEffect } from 'react';
import axios from "axios";


/**
 * 
 * @param url - url to the server that will take screenshot of requested page.
 * @param trigger - boolean that triggers the effect.
 * @param onCompletion - function to be executed when the effect is completed.
 * @returns - a string with the latest screenshot taken.
 */
export const useScrapeJson = (url: string, trigger: boolean, onCompletion: () => void) => {
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


const serverCommand = (command: string) => {
    return "http://localhost:3002/" + command + "?url="; // command is the server command to be executed
  };