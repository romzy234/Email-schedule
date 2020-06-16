const nodemailer = require('nodemailer');
const express = require('express');
const Datastore = require('nedb');
const cron = require('node-cron');
const fs = require('fs');
require('dotenv').config;

  ////// Server health  a cron job 
cron.schedule(" 5 * * * *", function() { 
  
    // Data to write on file 
    let data = `${new Date().toUTCString()}  
                : Server is working\n`; 
      
    // Appending data to logs.txt file 
    fs.appendFile("logs.txt", data, function(err) { 
          
        if (err) throw err; 
          
        console.log("Status Logged!"); 
    }); 
}); 

//// Express & Routing
const app = express();
app.listen(3000, () => console.log('Am running on port 3000 🙃'))
app.use(express.static('public'))
app.use(express.json({limit : '10mb'}))

/////Nedb
const database = new Datastore('email.db');
const errorr = new Datastore('Errors.db');
const complains = new Datastore('complains.db');
complains.loadDatabase();
database.loadDatabase();
errorr.loadDatabase();

////// Nodemailer Transporter 
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'cyrilogoh@gmail.com',
        pass: 'Ogohmoro'
    }
});

/////Public Api & Its handle Welcome mail & push To The DB And Error handler (Receiving)
app.post('/api', async (request, response) => {
    const user = request.body;
    const timestamp = Date.now();
    user.timestamp = timestamp;
    console.log(user);
    const mailOptions = {
        from: 'cyrilogoh@gmail.com',
        to: await user.email,
        subject: 'Guess All I Can Say Is Welcome',
        html:`
        ${user.name} welcome to the club but expect bugs alot of bugs gee
        `
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
         const type = 'Error From Welcome mail';
         const who = {name: user.name, email: user.email};
         const timestamp = Date.now();
          error.type = type;
          error.who = who;
          error.timestamp = timestamp;
          errorr.insert(error)
          console.log(error);
          response.json({
              status: 'Error',
              Name : user.name,
              Email : user.email
          });
        } else {
            database.insert(user);
            response.json({
                status: 'Success',
                Name : user.name,
                Email : user.email
            });
        }
      });

});

//// PUBLIC API TO HANDLE GET FROM DATABASE IN JSON FORMATE (Send)
app.get('/api', (request,response) =>{
    database.find({}, (err, data) =>{
        if(err){
            response.end();
            return ;
        }
        response.json(data)
    });
});

//// PUBLIC API TO HANDLE GET FROM DATABASE IN JSON FORMATE (Send)
app.get('/error', (request,response) =>{
    errorr.find({}, (err, data) =>{
        if(err){
            response.end();
            return ;
        }
        response.json(data)
    });
});

//// PUBLIC API TO HANDLE GET FROM DATABASE IN JSON FORMATE (Send)
app.post('/complain', async (request,response) =>{
        const complain = await request.body;
        const timestamp = Date.now().toLocaleString();
        complain.timestamp = timestamp;
        const mailOptions ={
            from :'cyrilogoh@gmail.com',
            to : 'cyrilogoh@gmail.com',
            subject: 'Someone has a complain or a bug is needed to be fixed',
            html:`
            <p>Hey Cyril You got a Complain </p>
            <p> user: ${complain.Name}
            <p>complain : <b>${complain.Complain}</b> </p>
            <p> Email to reeply : <a href="">${complain.Email}</a> time sent was at ${timestamp} </p>
            `
        }; 
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
             const type = 'Error From Complain mail';
             const timestamp = Date.now();
              error.type = type;
              error.timestamp = timestamp;
              errorr.insert(error)
              console.error(error);
              response.json({
                  status: 'Error',
              });
            } else {
                
                complains.insert(complain);
                response.json({
                    status: 'Success',
                });
            }
          })
    });

//////////// Time Table

var task = cron.schedule('20 22 * * Thurday', async () => {
    console.log(' corn 1 line 153 Started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Guess All I Can Say Is Welcome',
                html:`
                ${element.name} welcome to the club but expect bugs alot of bugs gee
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    const tolu ='fail';
                    console.log(tolu);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});
/////// MATH102
var MATH102 = cron.schedule('45 9 * * Monday,Wednesday', async () => {
    console.log('Math is About To Run');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Get ready For Another Math108 Class   ' + element.name,
                html:`
                ${element.name} Math 108 is About Starting 
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});

/////MATH112
var MATH112 = cron.schedule('30 9 * * Sunday', async () => {
    console.log('Math112 started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Get ready For Another Math112 Class   ' + element.name,
                html:`
                ${element.name} get ready
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});

///// ENGLISH
var ENGLISH = cron.schedule('45 9 * * Tuesday', async () => {
    console.log('English Started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Get ready For Another English Class   ' + element.name,
                html:`
                ${element.name} welcome to the club but expect bugs alot of bugs gee
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});

/// CSC102
var CSC102 = cron.schedule('45 14 * * Monday', async () => {
    console.log('csc102 Started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Get ready For Another CSC102 Class   ' + element.name,
                html:`
                ${element.name} Csc102 is Just less than 15min away
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});

////CSC 104
var CSC104 = cron.schedule('40 14 * * Thurday', async () => {
    console.log('Csc104 Started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Get ready For Another Csc 104 Class   ' + element.name,
                html:`
                ${element.name} Class, Soon , less than 15 min . perpare
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});

////CSC112
var CSC112 = cron.schedule('1 45 14 * * Friday', async () => {
    console.log('Csc112 Started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Get ready For Another CSC112 Class   ' + element.name,
                html:`
                ${element.name} welcome to the club but expect bugs alot of bugs gee
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});

////PHY102
var PHY102 = cron.schedule('1 45 13 * * Wednesday', async () => {
    console.log(' Phy102 Started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Get ready For Another PHY102 Class   ' + element.name,
                html:`
                ${element.name} Get Ready for lecture
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});

///PHY 108
var PHY108 = cron.schedule(' 45 13 * * Tuesday', async () => {
    console.log(' Phy Started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Get ready For Another PHY108 Class   ' + element.name,
                html:`
                ${element.name} what the point of this Class
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});

////FRENCH 
var FRENCH = cron.schedule('* 13 * * Monday', async () => {
    console.log(' French Started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to:element.email,
                subject: 'Get ready For Another French Class   ' + element.name,
                html:`
                ${element.name} welcome to the club but expect bugs alot of bugs gee
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});

//////// GST 
var GST = cron.schedule('1 * 0 * * Friday', async () => {
    console.log('gst  Started');
    database.find({}, (err, data) =>{
        if(err){
            console.log(err);
            return ;
        }
       // console.log(data);
        data.forEach(element => {
           // console.log(element.name)
            ///mailing now
            const mailOptions = {
                from: 'cyril@gildfashion.com',
                to: element.email,
                subject: 'Get ready For Another Math108 Class   ' + element.name,
                html:`
                ${element.name} welcome to the club but expect bugs alot of bugs gee
                `
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response + value);
                }
              });
        });
    });
});
















///////end of time table 
/*
var cy = cron.schedule('10 * * * * *', () => {
	console.log('Printing this line every minute in the terminal 10sec');
});
/*
cron.schedule("/1 * * * *", function() { 
    sendMail(); 
    }); 
      
    // Send Mail function using Nodemailer 
    function sendMail() { 

        // Setting credentials 
        let mailDetails = { 
            from: "<your-email>@gmail.com", 
            to: "<user-email>@gmail.com", 
            subject: "Test mail using Cron job", 
            text: "Node.js cron job email"
               + " testing for GeeksforGeeks"
        }; 
          
          
        // Sending Email 
        mailTransporter.sendMail(mailDetails,  
                        function(err, data) { 
            if (err) { 
                console.log("Error Occurs", err); 
            } else { 
                console.log("Email sent successfully"); 
            } 
        }); 
    } */
  
////Code End 