import { useState, useEffect } from 'react';
import axios from "axios";


/**
 * 
 * @param url  - The url to the website that will be scraped.
 * @param trigger  - A boolean that will trigger the scraping. 
 * @param onCompletion - A function that will be called when the scraping is done.
 * @returns  a string with the scraped html in raw data form.
 */
export const useScrapHTML = (
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
  

const serverCommand = (command: string) => {
    return "http://localhost:3002/" + command + "?url="; // command is the server command to be executed
  };