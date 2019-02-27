'use strict';
const Hapi = require('hapi'),
    Parser = require('rss-parser'),
    parser = new Parser(),
    server = Hapi.server({
        port: 3000,
        host: 'localhost'
    }),
    sw = require('remove-stopwords'),
    // url = "http://feeds.reuters.com/Reuters/PoliticsNews";
    url = "https://www.wired.com/feed/category/business/latest/rss";

(async () => {
    await server.start();
    console.log(`Server running at ${server.info.uri}`)

    server.route({
        method: 'GET',
        path: '/rssString',
        handler: (request, h) => {
            return run();
        }
    })

}) ();

async function run () {
    let feed = await parser.parseURL(url),
        ret = {};
    console.log(feed.title);
    console.log("+=============+")
    let categories = [],
        words = "";
    
    feed.items.forEach( item => {
        addCategory(item)
        addWords(item)
        console.log(item.title + "  --  " + item.categories + "\n");
    })

    console.log(categories)
    console.log(words)

    ret = {
        categories: categories,
        words: words,
        feed: feed
    }

    return ret;

    function addCategory (item) {
        let c = item.categories;
        for (let i=0;i<c.length;i++) {
            if (categories.indexOf(c[i]) < 0) {
                categories.push(c[i]);
            }
        }
    }

    function addWords (item) {
        words += " " + cleanTitle(item.title)
    }

    function cleanTitle (title) {
        return sw.removeStopwords(title.split(" ")).join(" ");
    }
    
}

process.on('unhandledRejection', (err) => {
    console.log(err);
})