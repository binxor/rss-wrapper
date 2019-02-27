# rss-wrapper
_author: binxor_
_date: 02/2019_
_STATUS: In Development_

A Node.js server that pulls from any live RSS feed and concatenates the feed titles into a single string.  This server is used in conjunction with its frontend, rss-visual (in development). rss-visual displays statistics for the most common words in the given RSS feed in an aesthetically pleasing web app.

This project integrates ```chai``` and ```mock``` for unit testing and API mockery.

## Output:
```sh
    {
        "categories": [""],   // Generated Array of unique feed.items.item[0:n].category values in RSS Feed
        "words": "",        // Generated String of concatenated titles of feed.items
        "feed": {}          // Original Contents of RSS Feed HTTP Response
    }
```

## Commands:
| COMMAND | RESULT |
| ------ | ------ |
| ``` $ npm start ``` | _Starts the Node.js server_ |
| ``` $ npm test ``` | _Starts the chai-nock test runner_ |