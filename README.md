Express API that will use Puppteer to create a PDF for a given URL

-   Clone the repo
-   Rename [.env.example](.env.example) to `.env` and add in API user & key
-   run `npm install`

## Running the server

`npm run dev-server` which will start nodemon

## Using the API

POST to:
`/api/v1/pdf`

Format of POST:

    {
        "renderer": "puppeteer",
        "htmlURL": "http://www.google.co.uk",
        "pdfOptions" : {
            "width": "595",
            "height": "842"
        }
    }

You'll need to provide HTTP basic auth details.

Example POSTMAN request can be found in the postman directory:
[POSTMAN file to import](postman/PDF.postman_collection.json)

## Testing

[![Build Status](https://travis-ci.org/lukehmu/node-puppeteer.svg?branch=master)](https://travis-ci.org/lukehmu/node-puppeteer)

Testing implemented using [supertest](https://github.com/visionmedia/supertest) & [mocha](https://github.com/mochajs/mocha), run using `npm test`

## DOCS

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [controllers/pdfController](#controllerspdfcontroller)
-   [generateTimeStampFileName](#generatetimestampfilename)
-   [puppeteerPDF](#puppeteerpdf)
    -   [Parameters](#parameters)
-   [phantomPDF](#phantompdf)
    -   [Parameters](#parameters-1)
-   [generatePDF](#generatepdf)
    -   [Parameters](#parameters-2)
-   [config/auth](#configauth)
-   [config/users](#configusers)
-   [findByUsername](#findbyusername)
    -   [Parameters](#parameters-3)
-   [schemas/requestSchema](#schemasrequestschema)
    -   [Examples](#examples)
-   [controllers/errorController](#controllerserrorcontroller)

### controllers/pdfController

PDF Controller handles generating PDFs

### generateTimeStampFileName

returns a string based on the current date/time

Returns **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** fileName

### puppeteerPDF

Creates a PDF for a given URL using Puppeteer and returns a binary file inside a buffer

#### Parameters

-   `htmlURL` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** a public URL to the HTML you wish to convert
-   `pdfOptions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** optional settings for PDF generation (optional, default `{width:595,height:842}`)
    -   `pdfOptions.width` **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** specify the width of the PDF in pixels
    -   `pdfOptions.height` **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** specify the height of the PDF pixels

Returns **[Buffer](https://nodejs.org/api/buffer.html)** buffer

### phantomPDF

This function shouldn't be used
No need for phantom PDF rendering

#### Parameters

-   `htmlURL` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**
-   `pdfFileName` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)**

**Meta**

-   **deprecated**: This is deprecated.


### generatePDF

picks up the JSON posted from the API and
triggers rendering the PDF via the specified renderer

#### Parameters

-   `req` **Express.Request**
-   `res` **Express.Response**

### config/auth

Auth module
Passport auth related functionality

### config/users

Users db module

### findByUsername

searches the users object to match the username sent via the http request

#### Parameters

-   `username`  the username sent from the http auth
-   `cb`  unsure what this does - the perils of copying code off the
    internet - assume this is a callback function?

### schemas/requestSchema

schemas/requestSchema.js
Example valid JSON for requestSchema

#### Examples

```javascript
{
 "renderer": "puppeteer",
 "htmlURL": "http://www.google.co.uk",
 "pdfOptions" : {
   "width": 100,
    "height": 100
  }
}
```

### controllers/errorController

Error Controller handles sending errors back to the client
