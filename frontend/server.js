const express = require('express');

const app = express();

// simple express server for delivering the content of the public folder
app.use(function (req, res, next) {
    if (req.url.startsWith('/health')) {
        next();
        return;
    }

    res.set('Cache-control', 'public, max-age=300');

    if (
        req.url.startsWith('/assets') ||
        req.url.startsWith('/css') ||
        req.url.startsWith('/fonts') ||
        req.url.startsWith('/img') ||
        req.url.startsWith('/js') ||
        req.url.startsWith('/favicon.ico')
    ) {
        //Do nothing
    } else {
        req.url = '/';
    }

    next();
});

app.use(express.static('./dist/'));

app.get('/', (req, res) => {
    res.set('Cache-control', 'public, max-age=300');
    res.sendFile(__dirname + '/dist/index.html');
});

app.get('/health', (req, res) => {
    res.set('Cache-control', 'public, max-age=0');
    res.status(200).send();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
