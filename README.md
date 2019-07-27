Express API that will use Puppteer to create a PDF for a given URL

* Clone the repo
* Rename `.env.example` to `.env` and add in API user & key
* run `npm install`

## Running the server
`npm run dev-server` which will start nodemon


## Using the API


POST to:
`/api/pdf`

Format of POST:
```
{
	"renderer": "puppeteer",
	"htmlURL": "https://www.google.co.uk",
	"height": 400,
	"width": 200
}
```

You'll need to provide HTTP Digest auth details
