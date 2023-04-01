import {
  useScrapHTML,
  useScrapHTMLArray,
  useScrapScreenshot,
  useGetListScreenshotsTaken,
  useGetLatestScreenshotsTaken,
} from "@/helper/scrapers/scrapHTML";
import React from "react";
import Image from "next/image";
import styles from "../styles/Webscraper.module.css";

const ScraperResult = () => {
  // This is just an example on how to use each of the hooks in my webscraper framework.
  // The hooks are located in the helper folder.
  // The hooks are used to scrape data from a website and return the data in a JSON format.
  // Or to take screenshot of a website and return the screenshot in a JSON format.
  // More in depth explanation:
  //  CHECK PDF FILE IN THE ROOT FOLDER OF THE PROJECT OR THE README.md FILE IN THE GITHUB REPO.

  const [url, setUrl] = React.useState("");
  //  -------------- Hooks Triggers Boolean --------------
  const [triggerRaw, setTriggeRaw] = React.useState(false);
  const [triggerArray, setTriggerArray] = React.useState(false);
  const [screenshotTrigger, setScreenshotTrigger] = React.useState(false);

  const [overlay, setOverlay] = React.useState(true);

  // -------------- Hooks  --------------
  const screenshotUrl: any = useScrapScreenshot(url, screenshotTrigger);
  const screenshotList: any = useGetListScreenshotsTaken();
  const latestScreenshot: any = useGetLatestScreenshotsTaken();
  const rawHTML: any = useScrapHTML(url, triggerRaw);
  const htmlArray: any = useScrapHTMLArray(url, triggerArray);

  const listEmpty: boolean = false;

  //  ------------ Event Handlers ------------
  const handleBtnClickRaw = () => {
    setTriggeRaw(!triggerRaw);
  };

  const handleBtnClickArray = () => {
    setTriggerArray(!triggerArray);
  };

  const handleBtnClickScreenshot = () => {
    setScreenshotTrigger(!screenshotTrigger);
  };

  //  -------------- Display Functions --------------

  // Display all screenshots taken from the screenshotListUrl array
  const displayAllScreenshots = () => {
    if (screenshotList.length > 0) {
      // console.log(screenshotList);
      const path: string = "/scraped-screenshots/";

      return screenshotList.map((item: any, index: number) => {
        // console.log(path + item.name);

        return (
          <div key={index}>
            <Image
              src={path + item.name}
              alt={item.name}
              width={200}
              height={200}
            />
          </div>
        );
      });
    } else {
      return <div>There are no screenshots taken yet</div>;
    }
  };

  // Display the latest screenshot taken
  const displayLatestScreenshot = () => {
    // console.log(latestScreenshot);

    if (latestScreenshot) {
      const path: string = "/scraped-screenshots/";

      return (
        <div>
          <Image
            src={path + latestScreenshot.name}
            alt={latestScreenshot}
            width={200}
            height={200}
          />
        </div>
      );
    } else {
      return <div>There are no screenshots taken yet</div>;
    }
  };

  // -------------- Warning --------------
  const displayWarning = () => {
    return (
      <div className={styles.warning}>
        <div>
          <h2>Warning</h2>
          <p>
            This is a proof of concept. Do not use this on websites that you do
            not have permission to scrape. Or checked after if the website has a
            robots.txt file that disallows web scraping. To deactivate this
            warning, remove the overlay state in the ScraperResult.tsx file in
            components.
          </p>
          <button onClick={() => setOverlay(false)}>Close</button>
        </div>
      </div>
    );
  };

  const displayRawHTML = () => {
    if (rawHTML) {
      return <p className={styles.raw_data}>{rawHTML}</p>;
    } else {
      return <div>There is no raw data to display</div>;
    }
  };

  const displayHTMLArray = () => {
    if (htmlArray) {
      return <div>{htmlArray}</div>;
    } else {
      return <div>There is no array data to display</div>;
    }
  };

  // --------------- Functions ---------------
  const refreshPage = () => {
    window.location.reload();
  };

  // -------------- JSX --------------
  return (
    <>
      {/*  This is just an warning when first running. Since it is a webscraper after all */}
      {overlay ? displayWarning() : null}

      <div className={styles.webscraper}>
        <button onClick={refreshPage} className={styles.refresh_button}>
          Refresh
        </button>
        <div className={styles.search}>
          <label>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={styles.input}
            />
          </label>
          <div className={styles.buttons}>
            <button onClick={handleBtnClickScreenshot}>
              Scrape Screenshot
            </button>
            <button onClick={handleBtnClickRaw}>Scrape raw data</button>
            <button onClick={handleBtnClickArray}>Scrape data to array</button>
          </div>
        </div>
        <div className={styles.data}>
          <h2>Latest screenshot taken</h2>
          {displayLatestScreenshot()}
        </div>
        <div className={styles.data}>
          <h2>Data from array</h2>
          {displayHTMLArray()}
        </div>
        <div className={styles.data}>
          <h2>Raw data</h2>
          {displayRawHTML()}
        </div>

        <div className={styles.all_images}>
          {/* All pictures in screenshotslist displayed here */}
          <h2>All screenshots taken</h2>
          {displayAllScreenshots()}
        </div>
      </div>
    </>
  );
};

export default ScraperResult;

// Path: components\ScraperResult.ts
