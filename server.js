let xpath = require("xpath");
const { DOMParser } = require('@xmldom/xmldom')

const http = require('http');
const url = require('url');
const port = 3000;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let { feedURL } = parsedUrl.query;
    if (!feedURL) {
        res.statusCode = 400;
        res.statusMessage = "Bad Request";
        return;
    }
    
    let response = await fetch(feedURL, {
        headers: {
            'User-Agent': 'latest-episode-bot'
        }
    });

    let xml = await response.text();
    let doc = new DOMParser().parseFromString(xml);
    let latestEpisode = xpath.select1("//item/enclosure/@url", doc).value;

    res.writeHead(302, {
        'Location': latestEpisode
    });
    res.end();
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
