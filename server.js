var express = require('express');
var path = require('path');
var ecstatic = require('ecstatic');
var app = express();

app.use(ecstatic({
    root: path.join(__dirname, 'frontend'),
    handleError: false
}));

app.use(function(req, res, next) {
    return res.redirect('/?redirect='+req.path);
});

app.listen(4000, function(){
    console.log('bundly listening on port: 4000');
});