import {
  useScrapHTML,
  useScrapHTMLArray,
  useScrapScreenshot,
  useGetListScreenshotsTaken,
  useGetLatestScreenshotsTaken,
  useScrapPdf,
} from "../scrapers/scrapHTML"; //  Importing the webscraper framework
import React from "react";
import Image from "next/image";
import styles from "../styles/Webscraper.module.css"; //  CSS file for the webscraper

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
  const [pdfTrigger, setPdfTrigger] = React.useState(false);

  const [overlay, setOverlay] = React.useState(true);  // Warning overlay for that user must follow the rules of the website. Robots.txt
  const [waitOverlay, setWaitOverlay] = React.useState(false); // This is for when a action is being performed and the user needs to wait for the action to finish.

  // -------------- Hooks  --------------

  // This is in use and working
  const screenshotUrl: any = useScrapScreenshot(url, screenshotTrigger, () =>
    setScreenshotTrigger(false)
  );
  const screenshotList: any = useGetListScreenshotsTaken();
  const latestScreenshot: any = useGetLatestScreenshotsTaken();
  const rawHTML: any = useScrapHTML(url, triggerRaw, () => setTriggeRaw(false));
  const htmlArray: any = useScrapHTMLArray(url, triggerArray, () =>
    setTriggerArray(false)
  );
  const pdf: any = useScrapPdf(url, pdfTrigger, () => setPdfTrigger(false));

  React.useEffect(() => {
    if (triggerRaw || triggerArray || screenshotTrigger || pdfTrigger) {
      setWaitOverlay(true);
    } else {
      setWaitOverlay(false);
    }
  }, [triggerRaw, triggerArray, screenshotTrigger, pdfTrigger]);

  // const listEmpty: boolean = false;

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

  const handleBtnClickPdf = () => {
    setPdfTrigger(!pdfTrigger);
  };

  // --------------- Styles ---------------
  const stylesearchoverlay = waitOverlay ? styles.overlay : styles.search;
  const styleinputbuttons = waitOverlay ? styles.disabled : styles.buttons;
  const styleinputfield = waitOverlay ? styles.inputdisabled : styles.input;

  //  -------------- Display Functions --------------

  // Display the input field and buttons
  const displayInputField = () => {
    return (
      <div className={styles.search}>
        <div className={stylesearchoverlay}>
          <label>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={styleinputfield}
            />
          </label>
          <div className={styles.buttons}>
            <button
              className={styleinputbuttons}
              onClick={handleBtnClickScreenshot}
            >
              Scrape Screenshot
            </button>
            <button className={styleinputbuttons} onClick={handleBtnClickRaw}>
              Scrape raw data
            </button>
            <button className={styleinputbuttons} onClick={handleBtnClickArray}>
              Scrape data to array
            </button>
            <button className={styleinputbuttons} onClick={handleBtnClickPdf}>
              Scrape PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

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

  // Display the raw html data from the url
  const displayRawHTML = () => {
    if (rawHTML) {
      return <p className={styles.raw_data}>{rawHTML}</p>;
    } else {
      return <div>There is no raw data to display</div>;
    }
  };

  // Display the html array
  const displayHTMLArray = () => {
    if (htmlArray) {
      return <div>{htmlArray}</div>;
    } else {
      return <div>There is no array data to display</div>;
    }
  };

  // Display pdf info and download button
  const displayPdfInfo = () => {
    if (pdf) {
      return (
        <div className={styles.data}>
          {/* <p>Status: {pdf.status}</p> */}
          <h2>{pdf.message}</h2>
          {pdf.status === "success" && (
            <>
              <p>Download PDF with the name:</p>
              <p>{pdf.filename}</p>
              <a href={pdf.filePath} download>
                <button>Download PDF</button>
              </a>
            </>
          )}
        </div>
      );
    } else {
      return;
    }
  };

  // Display the loading animation when waiting for the data
  const displayLoading = () => {
    return (
      <div>
        <div className={styles.loader} />
      </div>
    );
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

  // --------------- Functions ---------------
  const refreshPage = () => {
    window.location.reload();
  };

  // -------------- useEffect --------------
  React.useEffect(() => {
    if(screenshotUrl){
      refreshPage();
    }
  }, [screenshotUrl]);


  // -------------- TSX --------------
  return (
    <>
      {/*  This is just an warning when first running. Since it is a webscraper after all */}
      {/* Comment over it to deactivate the warning when launching this demo */}
      {overlay ? displayWarning() : null}

      <div className={styles.webscraper}>
        <button onClick={refreshPage} className={styles.refresh_button}>
          Refresh
        </button>
        {waitOverlay ? displayLoading() : displayInputField()}
        {displayPdfInfo()}
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
