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
    });
    server.route({
        method: 'POST',
        path: '/sentimentAnalysis',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: (request, h) => {
            return getSentiment(request)
        }
    })
})();

 function getSentiment(r) {
    // TODO - retrieve sentiment analysis 
    return {
        "SentimentScore": {
        "Mixed": 0.013253570534288883, 
        "Positive": 0.011843704618513584, 
        "Neutral": 0.8014019727706909, 
        "Negative": 0.17350070178508759
        }, 
        "Sentiment": "NEUTRAL"
    };
}


async function getFeed (params) {
    let categories = [],
        contentSnippets = [],
        feed = await parser.parseURL(urlFactory(params.source)),
        ret = {},
        words = "";
    
    feed.items.forEach( item => {
        addCategory(item)
        addWords(item)
        addSnippet(item)
    })

    ret = {
        categories: categories,
        words: words,
        feed: feed,
        snippets: contentSnippets
    }

    return ret;

    function urlFactory(source) {
        let url = "";
        switch (source) {
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
            case "politics":
                url = "http://feeds.reuters.com/Reuters/PoliticsNews";
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

    function addSnippet (item) {
        let s = item.contentSnippet;
        if (s) {
            contentSnippets.push(s);
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
    getFeed: getFeed,
    getSentiment: getSentiment
}