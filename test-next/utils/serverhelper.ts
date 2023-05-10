// utils/helpers.ts
import fs from 'fs';






// A function that returns the latest screenshot taken.
export const latestScreenshot = async (folder_path: string) => {
  const allfiles = await screenshotList(folder_path); // Get all files in folder
  let latestFile = null; // Create a variable to store the latest file
  let maxNumber = 0; // Create a variable to store the maximum number found in filenames

  // Loop through all files and check if the number in the filename is larger than the current maxNumber
  allfiles.forEach((file: any) => {
    const fileNumber: any = extractNumber(file.name); // Get the number from the filename
    if (fileNumber > maxNumber) {
      maxNumber = fileNumber;
      latestFile = file;
    }
  });
  console.log(maxNumber);

  return latestFile;
};



//  A function that returns a list of all files in a folder with path to the file.
export const screenshotList = async (folder_path: string) => {
    const fs = require("fs"); // File system module to read files
    const path = require("path"); // Path to file system folder and files in folder
  
    const files = fs.readdirSync(folder_path); // Read all files in folder
  
    const arr: any = [];
  
    //  Loop through all files and add them to an array with path to the file.
    files.forEach((file: any) => {
      arr.push({
        name: file,
        path: path.join(folder_path, file),
      });
    });
  
    return arr; // Return the array with all files in the folder.
  };
  



/**
 * 
 * @param {string} url - The URL of the page.
 * @returns {string} - The title of the page.
 * This function is used for generating a filename from string and add a timestap after.
 */
export async function titleFromURL(url: string) {
    const date = new Date();
    // Get timestamp from 1970-01-01 00:00:00
    const milliseconds = date.getTime();
  
    const timestamp = `${date.getFullYear()}${date.getMonth() + 1
      }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}-${milliseconds}`;
    const filename = `${url
      .replace(/(^\w+:|^)\/\//, "")
      .replace(/[^a-zA-Z0-9_]/g, "_")}_${timestamp}`;
  
    return filename;
  }



/**
 * Write scrapped data to a file.
 *
 * @param {string} savepath - The path where the file will be saved.
 * @param {string} filename - The name of the file to save.
 * @param {string} fileformat - The file format (including the dot, e.g., '.txt', '.json', etc.).
 * @param {any} data - The data to be saved to the file.
 * @param {any} res - The response object to send status messages.
 * @returns {Promise<void>} - A promise that resolves when the file has been written.
 */
export async function fileWriterScrappedData(savepath: string, filename: string, fileformat: string, data: any, res: any) {
  console.log("Writing file" + filename + fileformat);
  try {
    // Save the elements string as a text file
    fs.writeFile(savepath + filename + fileformat, data, (err: any) => {
      if (err) {
        console.error("Error writing text file:", err);
        res.status(500).json({ error: "Error saving the scraped data to a file" });
      } else {
        res.json({ success: true, message: "Scraped data saved to " + filename + fileformat });
      }
    });
  } catch (error) {
    console.error("Error writing text file:", error);
  }
}



/**
 * 
 * @param {string} filename 
 * @returns number from the filename
 * A function that extracts the timestamp from the filename.

 */
export const extractNumber = (filename: string) => {
    const regex = /.*-(\d+)\./;
    const result = filename.match(regex);
  
    if (result && result[1]) {
      return parseInt(result[1], 10);
    }
  
    return null;
  }

/**
 * A function that returns a promise that resolves after a given time.
 * 
 * @param {number} time - The number of seconds to wait before resolving the promise.
 * @returns {Promise<void>} A promise that resolves after the specified time.
 */
export const waitTime = async (time: number) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time * 1000);
    });
  };
  



  /**
   * A utility function for handling errors and sending appropriate error responses.
   *
   * @param {any} error - The error object thrown by the catch block.
   * @param {any} code - The response object from the Express route.
   */
  export const errorcodes = (error: any, code: any) => {
    console.error(error);
    code.status(500).send("Error occurred while scraping the website");
    console.log("Error occurred while scraping the website");
  };
  