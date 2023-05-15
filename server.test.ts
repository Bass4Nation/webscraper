// server.test.ts
import request from 'supertest';
import { startServer, stopServer } from './server'; 

let app: any;

describe('Server', () => {
  beforeAll(async () => {
    app = await startServer();
  });

  afterAll(async () => {
    await stopServer();
  });

  it('should be able to reach the /scrape endpoint', async () => {
    const url = 'http://example.com'; 
    const response = await request(app).get(`/scrape?url=${encodeURIComponent(url)}`);
    expect(response.status).toBe(200);
  });

  it('should be able to reach the /scrapproduct endpoint', async () => {
    const store = 'power'; 
    const product = 'playstation 5'; 
    const response = await request(app).get(`/scrapproduct?store=${encodeURIComponent(store)}&product=${encodeURIComponent(product)}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'success', message: 'Scraping complete' });
  });

  it('scrapes a webpage and creates a screenshot', async () => {
    const url = 'https://b4n.no/'; 
    const response = await request(app).get(`/scrapescreenshot?url=${encodeURIComponent(url)}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body).toHaveProperty('message', 'Screenshot created successfully');
    expect(response.body).toHaveProperty('filePath');
    expect(response.body).toHaveProperty('filename');
  });
});







// // src/server.test.ts
// import request from 'supertest';
// import axios from 'axios';
// import cheerio from 'cheerio';
// import server from './server';

// const app = server;

// // Mock axios get request
// jest.mock('axios');
// const mockedAxios = axios as jest.Mocked<typeof axios>;

// // beforeAll(() => {
// //   const PORT = process.env.PORT || 3002;
// //   server = app.listen(PORT);
// // });

// // afterAll(async () => {
// //   await server.close();
// // });

// describe("GET /scrapeh1", () => {
//   // --------------------- Test 1 ---------------------
//   test("should return scraped text from a valid URL", async () => {
//     const scrapecommand: string = "/scrapeh1"; // The scrape command to test
//     const url = "https://example.com";
//     const expectedText = "Example Domain";

//     const axios = require("axios");
//     jest.mock("axios");  // Mock the axios module 
//     axios.get.mockResolvedValue({ data: "<html><body><h1>Example Domain</h1></body></html>" }); // Mock/fake the axios.get response

//     const cheerio = require("cheerio");
//     jest.mock("cheerio");
//     const loadMock = jest.spyOn(cheerio, "load"); // Mock the cheerio.load function and return a mock function
//     loadMock.mockReturnValue(() => ({
//       h1: () => ({
//         text: () => expectedText,
//       }),
//     }));
//     const response = await request(app).get(`${scrapecommand}?url=${encodeURIComponent(url)}`);
//     expect(response.status).toBe(200);  // Expect the response status to be 200
//     expect(response.text).toEqual(expectedText); // Expect the response text to be the expected text

//     loadMock.mockRestore(); // Restore the original cheerio.load function after the test
//   });

//   // --------------------- Test 2 ---------------------
//   test('should return 500 error if the URL is invalid', async () => {
//     const scrapecommand: string = "/scrapeh1"; // The scrape command to test

//     const url = 'http://invalidurl';

//     // Mock the axios.get error
//     mockedAxios.get.mockRejectedValue(new Error('Error occurred while scraping the website'));

//     const response = await request(app).get(`${scrapecommand}?url=${encodeURIComponent(url)}`);
//     expect(response.status).toBe(500);
//     expect(response.text).toEqual('Error occurred while scraping the website');

//     // Reset the axios.get mock
//     mockedAxios.get.mockReset();
//   });
// });

// describe("GET /scrapearray", () => {
//   // --------------------- Test 1 ---------------------
//   test("should return scraped data to an array from a valid URL", async () => {
//     const scrapecommand: string = "/scrapearray"; // The scrape command to test
//     const url = "https://example.com"; // The URL to scrape
//     const expectedArray: any = "[{\"tag\":\"h1\",\"content\":\"Example Domain\"}]" // The expected text to be scraped

//     const axios = require("axios");
//     jest.mock("axios");  // Mock the axios module 
//     axios.get.mockResolvedValue({ data: "<html><body><h1>Example Domain</h1></body></html>" }); // Mock/fake the axios.get response

//     const cheerio = require("cheerio");
//     jest.mock("cheerio");
//     const loadMock = jest.spyOn(cheerio, "load"); // Mock the cheerio.load function and return a mock function
//     loadMock.mockReturnValue(() => ({
//       h1: () => ({
//         text: () => expectedArray,
//       }),
//     }));
//     const response = await request(app).get(`${scrapecommand}?url=${encodeURIComponent(url)}`);
//     expect(response.status).toBe(200);  // Expect the response status to be 200
//     expect(response.text).toEqual(expectedArray); // Expect the response text to be the expected text

//     loadMock.mockRestore(); // Restore the original cheerio.load function after the test
//   });

//   // --------------------- Test 2 ---------------------
//   test('should return 500 error if the URL is invalid', async () => {
//     const scrapecommand: string = "/scrapearray"; // The scrape command to test
    
//     const url = 'http://invalidurl';

//     // Mock the axios.get error
//     mockedAxios.get.mockRejectedValue(new Error('Error occurred while scraping the website'));

//     const response = await request(app).get(`${scrapecommand}?url=${encodeURIComponent(url)}`);
//     expect(response.status).toBe(500);
//     expect(response.text).toEqual('Error occurred while scraping the website');

//     // Reset the axios.get mock
//     mockedAxios.get.mockReset();
//   });

// });

// // describe("GET /scrapescreenshot", () => {
// //   test("should return a scraped screenshot from a valid URL", async () => {
// //   });

// //   test('should return 500 error if the URL is invalid', async () => {
// //   });


// // });

// // describe("GET /scrapepdf", () => {
// //   test("should return a scraped pdf from a valid URL", async () => {
// //   });

// //   test('should return 500 error if the URL is invalid', async () => {
// //   });
// // });

// // describe("GET /scrapejson", () => {
// //   test("should return a scraped json file from a valid URL", async () => {
// //   });

// //   test('should return 500 error if the URL is invalid', async () => {
// //   });


// // });

// //  ------------ Server close ------------    
// afterAll((done) => {
//   // Closing the server
//   server.close(() => {
//     console.log('Server closed');
//     done();
//   });
// });