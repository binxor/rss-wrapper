let Parser = require('rss-parser'),
    sw = require('remove-stopwords'),
    url = "http://feeds.reuters.com/Reuters/PoliticsNews";
let parser = new Parser();

(async () => {
    let feed = await parser.parseURL(url);
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
    
})();