const express = require("express");
const bodyParser = require("body-parser");
const cheerio = require('cheerio');
const request = require('request');
var unirest = require("unirest");
var yummy = require("./hello")


var req = unirest("POST", "https://microsoft-azure-text-analytics-v1.p.rapidapi.com/sentiment");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

req.headers(yummy);

req.type("json");
var total_final_sentiment = 0;
var counter = 0;


// MIDDLEWARE 
app.use(bodyParser.json());

// LOGIC
app.get("/", function (req, res) {
    res.render("index.ejs", {
        bg: "/logo1.png",
        status: ""
    });
});

app.post("/home", function (req_1, res) {
    console.log(req_1.body.userName, "*");
    request(req_1.body.userName, (err, resp, body) => {
        // console.log(object);
        const $ = cheerio.load(body);
        $('p.TweetTextSize').each((index, item) => {



            counter = counter + 1;


            if (typeof item.children[0].data !== "undefined") {
                console.log(item.children[0].data, "&");
            }
            req.send({
                "documents": [
                    {
                        "language": "en",
                        "id": "string",
                        "text": item.children[0].data
                    }
                ]
            });

            req.end(function (res) {
                if (res.error) throw new Error(res.error);

                if (typeof res.body.documents[0] !== "undefined") {
                    console.log(res.body.documents[0], "%");
                    console.log(res.body.documents[0].score);
                    total_final_sentiment = total_final_sentiment + res.body.documents[0].score;
                }
            });
        });

    }

    );

    setTimeout(() => {
        answer = total_final_sentiment / counter;
        console.log(total_final_sentiment, "$", answer);
        var string_ans = '';
        console.log(typeof answer);
        if (answer > 0.6 && 1 >= answer) {
            console.log("21312");
            string_ans = "POSITIVE"
        }
        else if (answer > 0.4 && 0.6 >= answer) {
            console.log("ashdjaskd");
            string_ans = "NEUTRAL"
        }
        else {
            console.log("1231asdas");
            string_ans = "NEGATIVE"
        }

        console.log(string_ans, ")()()");
        res.render("index.ejs", {
            bg: "/logo1.png",
            status: string_ans
        });
    }, 10000);
});



// LISTEN
const port = process.env.PORT || 5500;

app.listen(port, () => console.log(`server started on ${port}`));