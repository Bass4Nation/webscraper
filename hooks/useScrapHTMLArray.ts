import { useState, useEffect } from 'react';
import axios from "axios";

export const useScrapHTMLArray = (
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
  

const serverCommand = (command: string) => {
    return "http://localhost:3002/" + command + "?url="; // command is the server command to be executed
  };