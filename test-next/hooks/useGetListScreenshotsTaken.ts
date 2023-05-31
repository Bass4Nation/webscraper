import { useState, useEffect } from 'react';
import axios from "axios";

export const useGetListScreenshotsTaken = () => {
    const serverUrl = serverCommand("scrapescreenshotlist"); // url to the server that will take screenshot of requested page.
  
    const [elements, setElements] = useState("");
  
    useEffect(() => {
      const fetchHTML = async () => {
        try {
          const response = await axios.get(serverUrl); // get the html from the server sending the url
          const elementsArray = response.data;
          console.log("elementsArray: ", elementsArray);
          
  
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
    console.log("elements: ", elements);
    
    return elements;
  };

  const serverCommand = (command: string) => {
    return "http://localhost:3002/" + command ; // command is the server command to be executed
  };