import { useState, useEffect } from 'react';
import axios from "axios";

export const useGetLatestScreenshotsTaken = () => {
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


  const serverCommand = (command: string) => {
    return "http://localhost:3002/" + command + "?url="; // command is the server command to be executed
  };