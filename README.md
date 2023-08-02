# Building a website with Node.js and Express

## How to run E2E tests

1. For simplicity, we are using only Chrome to make E2E tests, so please make sure you have the latest Chrome version installed on your machine
2. Then run `npm run update` just in case to update Selenium drivers. (Tool that needed for our automated tests).
3. Run `npm run start:selenium` and wait for the following message in the console "Selenium Server is up and running on port 4444"
   Don't close this window, we need it running.
4. Open another console/terminal and run `npm run test:e2e` this will run automated tests. Make sure that you run it
   on "clean" application. Our test expects that your application will have no data on test start.
