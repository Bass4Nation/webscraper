import { useState, useEffect } from 'react';
import axios from "axios";

export const useScrapPdf = (
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


const serverCommand = (command: string) => {
    return "http://localhost:3002/" + command + "?url="; // command is the server command to be executed
  };