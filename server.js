var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

var http = require('http').createServer(app);
var bodyParser = require('body-parser');
    // parse application/json
    app.use(bodyParser.json());                        

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));
var compName;


app.get('/', function(req, res) {
    res.send("<html><head><title>Coupon Aggregator</title></head><body><h1>Coupon Aggregator</h1><br/><form action='/scrape' method='POST'><input type='text' value='' name='user[name]'><input type='submit' value='Enter'></form></body></html>")

});
app.post('/scrape', function(req, res){
    console.log(req.body.user.name);
    compName = req.body.user.name;

url = 'http://www.grabon.in/'+compName.trim()+'-coupons/';

request(url, function(error, response, html){
    if(!error){
        var $ = cheerio.load(html);

    var title, release, rating;
    var arr = [];
    // var json = { title : "", release : "", rating : ""};

    $('.coupon-list-item').each(function() {
       // console.log(this);
       var data = $(this).find('.h3_click').text();
       
       var coupon = $(this).find('small').text();
       var det = $(this).find('.coupon-description').text();
     //  console.log(det);
       var time = $(this).find('.list-inline.coupon-extras')
       .children()
       .first()
       .text();
       //console.log(time);
       // json.title = data;
       // json.rating = coupon;
       var json = {
        title : data,
        details : det,
        code : coupon,
        time : time.trim()
       }
       if(coupon.trim() !== "")
        arr.push(json);
    })

    // $('.title_wrapper').filter(function(){
    //     var data = $(this);
    //     title = data.children().first().text().trim(); 
    //     release = title.substr(title.indexOf("("));           
    //     //release = data.children().first().children().first().children()
    //     //.first().text();

    //     json.title = title;
    //     json.release = release;
    // })

    // $('.ratingValue').filter(function(){
    //     var data = $(this);
    //     rating = data.children().first().children().text();

    //     json.rating = rating;
    // })
}

// To write to the system we will use the built in 'fs' library.
// In this example we will pass 3 parameters to the writeFile function
// Parameter 1 :  output.json - this is what the created filename will be called
// Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
// Parameter 3 :  callback function - a callback function to let us know the status of our function


fs.writeFile('output/'+compName+'.json', JSON.stringify(arr, null, 4), function(err){

    console.log('File successfully written! - Check your output directory for the '+compName+'.json file');
    res.download(__dirname+'\\output/'+compName+'.json');

})

// Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
//res.send("Check output folder...<a href='/'>Go Back</a>", function() {
  
//});



    }) ;
})


var port = process.env.OPENSHIFT_NODEJS_PORT || 3000// set the port
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
http.listen(port, ip_address);
//listen('8080')

console.log('Magic happens on port 8080');


exports = module.exports = app; 
