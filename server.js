'use strict';
const Hapi = require('hapi'),
    Parser = require('rss-parser'),
    parser = new Parser(),
    server = Hapi.server({
        port: 3000,
        host: 'localhost'
    }),
    sw = require('remove-stopwords'),
    url = "http://feeds.reuters.com/Reuters/PoliticsNews",
    watson = require('./scripts/classes/Watson.js');

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
        path: '/sentimentAWS',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: (request, h) => {
            return getSentiment(request, "aws")
        }
    })
    server.route({
        method: 'POST',
        path: '/sentimentWatson',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: (request, h) => {
            return getSentiment(request, "watson")
        }
    })
})();

async function getSentiment(r, src) {
    let ret;
    // return await watson.analyzeTone(r.payload.text); // for real watson tone analyzer response data only
    // return await getSentiment0(r); // for dummy aws comprehend response data only
    // return [await watson.analyzeTone(r.payload.text), await getSentiment0(r)]; // for both: real watson and fake aws comprehend responses
    switch (src) {
        case "aws":
            ret = await getSentiment0(r);
            break;
        case "watson":
            ret = await watson.analyzeTone(r.payload.text);
            break;
        default:
            ret = [{"document_tone":{"tones":[]},"sentences_tone":[{"sentence_id":0,"text":"Vulnerable House Democrats, mindful of President Donald Trump's continued strength among Republican voters, are using caution in how they respond to the special counsel's report, which detailed Trump's efforts to thwart the investigation into Russian efforts to help him win the White House.,Former","tones":[]},{"sentence_id":1,"text":"Republican presidential candidate Mitt Romney said on Friday he was \"sickened\" by the dishonesty of U.S. President Donald Trump and people around him as portrayed in a report on Russia's attempts to influence the 2016 election.,The","tones":[]},{"sentence_id":2,"text":"number of Americans who approve of President Donald Trump dropped by 3 percentage points to the lowest level of the year following the release of a special counsel report detailing Russian interference in the last U.S. presidential election, according to an exclusive Reuters/Ipsos public opinion poll.,After","tones":[]},{"sentence_id":3,"text":"months as volunteer activists demanding that U.S. President Donald Trump be impeached, Eileen and Michael O'Brien sat on their couch on Thursday, cracked open a laptop and began to read the 448-page special counsel report that liberals have dreamed would make impeachment a reality.,Top","tones":[]},{"sentence_id":4,"text":"Democrats in the U.S. House of Representatives and Senate on Friday rejected Attorney General William Barr's proposal to allow them access to a less-redacted version of Special Counsel Robert Mueller's Russia investigation report.,Congressional","tones":[]},{"sentence_id":5,"text":"Democrats on Friday took legal action to get hold of all of U.S. Special Counsel Robert Mueller's evidence from his inquiry into Russian meddling in the 2016 election, as the probe's findings hit President Donald Trump's poll ratings.,U.S.","tones":[]},{"sentence_id":6,"text":"President Donald Trump's personal lawyers spent at least 10 hours reviewing Special Counsel Robert Mueller's report on Russian meddling in the 2016 election before it was made public, two of the lawyers told Reuters on Friday.,Attorney","tones":[]},{"sentence_id":7,"text":"General William Barr could have buried Special Counsel Robert Mueller's Russia report deep in the recesses of the U.S. Justice Department and simply told the public that President Donald Trump would not face criminal prosecution.,Former","tones":[]},{"sentence_id":8,"text":"U.S. Vice President Joe Biden plans to make a widely expected announcement of his candidacy for the presidency in a video on Wednesday, the Atlantic reported on Friday, citing sources close to Biden's top aides.,Sitting","tones":[]},{"sentence_id":9,"text":"on a working-class commercial strip in the shadows of an above-ground rail line, a group called Make the Road New York's busy street-level offices are easy to miss.","tones":[]},{"sentence_id":10,"text":"But its mission to support and advocate for immigrants is front and center.,U.S. House Judiciary Committee Chairman Jerrold Nadler issued a  subpoena on Friday to obtain the full Russia investigation report by Special Counsel Robert Mueller, saying he cannot accept a redacted version that \"leaves most of Congress in the dark.\",The","tones":[]},{"sentence_id":11,"text":"Kremlin said on Friday that U.S. Special Counsel Robert Mueller's long-awaited report did not contain any evidence the Russian state had meddled in the 2016 U.S. presidential election.,U.S. House of Representatives Judiciary Committee Chairman Jerrold Nadler is expected to issue a subpoena on Friday for Special Counsel Robert Mueller's full Russia investigation report and underlying evidence, a source familiar with the matter said.,Russia's","tones":[]},{"sentence_id":12,"text":"foreign ministry on Friday dismissed the findings of the long-awaited report by U.S. Special Counsel Robert Mueller and said it had failed to present any evidence of Russian meddling in U.S. elections, Russian news agencies reported.,U.S. House of Representatives Speaker Nancy Pelosi on Friday declined to comment on whether Congress might launch impeachment proceedings against President Donald Trump, saying it was not appropriate to criticize him while abroad.,The","tones":[{"score":0.624276,"tone_id":"fear","tone_name":"Fear"}]},{"sentence_id":13,"text":"American Civil Liberties Union of New Mexico on Thursday called for state authorities to investigate a small group of armed U.S. citizens who they alleged are illegally detaining migrants entering the United States.,Erik","tones":[]},{"sentence_id":14,"text":"Prince, founder of the now defunct Blackwater security firm and a supporter of Donald Trump's 2016 presidential run, appears to have misled the U.S. Congress on details of contact he had with a Russian banker in January 2017, Special Counsel Robert Mueller's report released on Thursday shows.,(Advisory:","tones":[]},{"sentence_id":15,"text":"Story includes language that might offend some readers.),Democrats","tones":[{"score":0.976993,"tone_id":"tentative","tone_name":"Tentative"}]},{"sentence_id":16,"text":"clamored for the speedy release of U.S. Special Counsel Robert Mueller’s findings of his probe into whether President Donald Trump's 2016 campaign colluded with Russia.","tones":[]},{"sentence_id":17,"text":"Now   they finally have them, they are confronted with a choice - stay on the attack or move on.,The","tones":[{"score":0.550375,"tone_id":"joy","tone_name":"Joy"},{"score":0.525007,"tone_id":"tentative","tone_name":"Tentative"},{"score":0.599421,"tone_id":"analytical","tone_name":"Analytical"}]},{"sentence_id":18,"text":"U.S. Attorney General decided that President Donald Trump did not obstruct a probe into whether his campaign colluded with Russia, but some legal experts said prosecutors laid out a wealth of evidence to the contrary and that they intended to leave that determination to Congress.","tones":[{"score":0.736294,"tone_id":"analytical","tone_name":"Analytical"}]}]},{"SentimentScore":{"Mixed":0.013253570534288883,"Positive":0.011843704618513584,"Neutral":0.8014019727706909,"Negative":0.17350070178508759},"Sentiment":"NEUTRAL"}];
            break;
    }
    return ret;
    
}

// DUMMY DATA
async function getSentiment0(r) { //dummy aws comprehend response data
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

async function getFeed(params) {
    let categories = [],
        contentSnippets = [],
        feed = await parser.parseURL(urlFactory(params.source)),
        ret = {},
        words = "";

    feed.items.forEach(item => {
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

    function addCategory(item) {
        let c = item.categories;
        for (let i = 0; i < c.length; i++) {
            if (categories.indexOf(c[i]) < 0) {
                categories.push(c[i]);
            }
        }
    }

    function addSnippet(item) {
        let s = item.contentSnippet;
        if (s) {
            contentSnippets.push(s);
        }
    }

    function addWords(item) {
        words += " " + cleanTitle(item.title)
    }

    function cleanTitle(title) {
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