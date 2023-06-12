const express = require("express")
const bodyParser = require("body-parser")
const request = require('request') ;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
require('dotenv').config();
app.use(express.static('public'));
app.set("view engine","ejs");
app.get('/',(req,res)=>{
    const sendData = {location:"location",temp:"Temp",desc:"description",feel:"Feel"};
    res.render("index",{sendData:sendData});
});
app.post('/',async(req,res)=>{
    const location = await req.body.city ;
    const API = "25ab0178702542e8fce77647427e5786"
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+location+"&appid="+API+"&units=metric";
    console.log(url);
    request({ url: url }, (error, response) => {
        const data = JSON.parse(response.body)
        const temp = data.main.temp ;
        const disc = data.weather[0].description ;
        const icon = data.weather[0].icon;
        const imgURL = `https://openweathermap.org/img/wn/${icon}@2x.png`
        const sendData = {};
        sendData.temp = temp;
        sendData.disc = disc;
        sendData.location = location ;
        sendData.feel = data.main.feels_like;
        sendData.humidity = data.main.humidity;
        sendData.speed = data.wind.speed;
        res.render("index",{sendData:sendData});
    })
})

app.listen(3000,()=>{
    console.log("Server is running...")
})