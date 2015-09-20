'use strict';

var request=require("request");

var options = {
    url: "http://geek-and-poke.com",
    headers: {
        "User-Agent": "request"
    }
};

request.get(options, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log(response.body);
    }
});