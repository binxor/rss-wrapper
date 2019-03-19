'use strict';
const Hapi = require('hapi'),
    Parser = require('rss-parser'),
    parser = new Parser(),
    server = Hapi.server({
        port: 3000,
        host: 'localhost'
    }),
    sw = require('remove-stopwords'),
    url = "http://feeds.reuters.com/Reuters/PoliticsNews";

(async () => {
    await server.start();
    console.log(`Server running at ${server.info.uri}`)
    server.route({
        method: 'GET',
        path: '/rssString/{source?}',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: (request, h) => {
            return getFeed(request.params);
        }
    })
})();


async function getFeed (params) {
    let categories = [],
        feed = await parser.parseURL(urlFactory(params.source)),
        ret = {},
        words = "";
    
    feed.items.forEach( item => {
        addCategory(item)
        addWords(item)
    })

    ret = {
        categories: categories,
        words: words,
        feed: feed
    }

    console.log(words)
    return ret;

    function urlFactory(source) {
        let url = "";
        switch (source) {
            case "politics":
                url = "http://feeds.reuters.com/Reuters/PoliticsNews";
                break;
            case "business":
                url = "http://feeds.reuters.com/Reuters/BusinessNews";
                break;
            case "company":
                url = "http://feeds.reuters.com/Reuters/CompanyNews";
                break;
            case "health":
                url = "http://feeds.reuters.com/Reuters/healthNews";
                break;
            case "lifestyle":
                url = "http://feeds.reuters.com/Reuters/lifestyle";
                break;
            case "odd":
                url = "http://feeds.reuters.com/Reuters/oddlyEnoughNews";
                break;
            case "science":
                url = "http://feeds.reuters.com/Reuters/scienceNews";
                break;
            case "security":
                url = "https://www.wired.com/feed/category/security/latest/rss";
                break;
            case "technology":
                url = "http://feeds.reuters.com/Reuters/technologyNews";
                break;
            case "top":
                url = "http://feeds.reuters.com/Reuters/topNews";
                break;
            case "world":
                url = "http://feeds.reuters.com/Reuters/worldNews";
                break;
            default: 
                url = "http://feeds.reuters.com/Reuters/PoliticsNews";
                break;
        }
        return url;
    }

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

module.exports = {
    getFeed: getFeed
}