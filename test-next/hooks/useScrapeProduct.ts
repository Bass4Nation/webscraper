import { useState, useEffect } from 'react';
import axios from "axios";

// ------- Scrape a product from a store like Komplett, Elkjøp, etc. -------
// Need to get storename and a product name to search for.
/**
 * 
 * @param store  - store name like Komplett, Elkjøp, etc. Must be a valid store name.
 * @param product  - product name to search for. Must be a valid product name.
 * @param trigger - boolean to trigger the scrape. Must be true to trigger.
 * @param onCompletion - callback function to be called when the scrape is completed.
 */
export const useScrapeProduct = (store: string, product: string, trigger: boolean, onCompletion: () => void) => {
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