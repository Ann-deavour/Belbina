$(document).ready(function(){

    //populateValues();
    populateValuesOffline();


var allText;
var volt,curr,temp;

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.setRequestHeader('Cache-Control', 'no-cache');
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                console.log(allText);
            }
        }
    }
    rawFile.send(null);
}

var timerID = setInterval(function() {
populateValues();
//populateValuesOffline();
}, 5 * 1000);

//clearInterval(timerID);

function populateValues(){

readTextFile("./post/values.txt");
var values = allText.split("|");
var v = values[1];
var c = values[2];
var t = values[3];
console.log(v);
console.log(c);
console.log(t);
var voltageArr = v.split("=");
volt = voltageArr[1];
var currentArr = c.split("=");
curr = currentArr[1];
var temperatureArr = t.split("=");
temp = temperatureArr[1];


var v_thrshld=15,C_thrshld=1,T_thrshld=50;
if(volt>v_thrshld||curr>C_thrshld||temp>T_thrshld )
{
  savevalues(volt,curr,temp);
}

console.log(volt);
console.log(curr);
console.log(temp);

//document.getElementById("voltage").innerHTML = voltage;
//document.getElementById("current").innerHTML = current;
//document.getElementById("temperature").innerHTML = temperature;

}


function populateValuesOffline(){
  volt = "13.56";
  curr = "-0.45";
  temp = "32.98";
}





function savevalues(voltage,current,temperature){

  var firebaseConfig = {
   apiKey: "AIzaSyAmuSBs6E4VTH1lYj7qTptiRZr98433xhs",
   authDomain: "b2v2-6cab7.firebaseapp.com",
   databaseURL: "https://b2v2-6cab7-default-rtdb.firebaseio.com",
   projectId: "b2v2-6cab7",
   storageBucket: "b2v2-6cab7.appspot.com",
   messagingSenderId: "295423585757",
   appId: "1:295423585757:web:1d6398fe1865086c295a34",
   measurementId: "G-660CQ1MCR9"
 };
    console.log("Initializing firebase");
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    // Getting a reference to the database service
    var database = firebase.database();



var timestamp=Date().substr(0,25);
         var db = firebase.firestore();
         var WirelessMonitor = db.collection('WirelessMonitor');


db.collection("WirelessMonitor").doc("Monitor").set({

  Current: temperature,
 Temperature: voltage,
 TimeStamp:timestamp,
 Voltage: current
})
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
});

}

    // Cache some selectors

    var voltage = $('#voltage'),
        alarm = voltage.find('.alarm'),
        ampm = voltage.find('.ampm');

        var current = $('#current'),
            alarm1 = current.find('.alarm'),
            ampm1 = current.find('.ampm');

            var temperature = $('#temperature'),
                alarm2 = temperature.find('.alarm'),
                ampm2 = temperature.find('.ampm');

    // Map digits to their names (this will be an array)
    var digit_to_name = 'zero one two three four five six seven eight nine'.split(' ');

    // This object will hold the digit elements
    var digits = {};
    var digits1 = {};
    var digits2 = {};

    // Positions for the hours, minutes, and seconds
    var positions = [
        'h1', 'h2', ':', 'm1', 'm2'
    ];

    // Generate the digits with the needed markup,
    // and add them to the voltage

    var digit_holder = voltage.find('.digits');
    var digit_holder1 = current.find('.digits');
    var digit_holder2 = temperature.find('.digits');

    $.each(positions, function(){

        if(this == ':'){
            digit_holder.append('<div class="dots">');
        }
        else{

            var pos = $('<div>');

            for(var i=1; i<8; i++){
                pos.append('<span class="d' + i + '">');
            }

            // Set the digits as key:value pairs in the digits object
            digits[this] = pos;

            // Add the digit elements to the page
            digit_holder.append(pos);
        }

    });

    $.each(positions, function(){

    if(this == ':'){
        digit_holder1.append('<div class="dots">');
    }
    else{

        var pos1 = $('<div>');

        for(var i=1; i<8; i++){
            pos1.append('<span class="d' + i + '">');
        }

        // Set the digits as key:value pairs in the digits object
        digits1[this] = pos1;

        // Add the digit elements to the page
        digit_holder1.append(pos1);
    }

    });


    $.each(positions, function(){

    if(this == ':'){
        digit_holder2.append('<div class="dots">');
    }
    else{

        var pos2 = $('<div>');

        for(var i=1; i<8; i++){
            pos2.append('<span class="d' + i + '">');
        }

        // Set the digits as key:value pairs in the digits object
        digits2[this] = pos2;

        // Add the digit elements to the page
        digit_holder2.append(pos2);
    }

    });


    // Add the weekday names

    // var weekday_names = 'MON TUE WED THU FRI SAT SUN'.split(' '),
    //     weekday_holder = voltage.find('.weekdays');
    //
    // $.each(weekday_names, function(){
    //     weekday_holder.append('<span>' + this + '</span>');
    // });
    //
    // var weekdays = voltage.find('.weekdays span');

    weekday_holder = voltage.find('.weekdays');
    weekday_holder.append('<span>' + "Voltage" + '</span>');
    weekday_holder1 = current.find('.weekdays');
    weekday_holder1.append('<span>' + "Current" + '</span>');
    weekday_holder2 = temperature.find('.weekdays');
    weekday_holder2.append('<span>' + "Temperature" + '</span>');


    // Run a timer every second and update the voltage

    (function update_time(){

        // Use moment.js to output the current time as a string
        // hh is for the hours in 12-hour format,
        // mm - minutes, ss-seconds (all with leading zeroes),
        // d is for day of week and A is for AM/PM

        //var now = moment().format("hhmmssdA");
        var vol = volt.split("");
        var cur = curr.split("");
        var tem = temp.split("");
	console.log("Voltage Length = "+vol.length);
        if(vol.length < 5){
        digits.h1.attr('class', digit_to_name[0]);
        digits.h2.attr('class', digit_to_name[vol[0]]);
        digits.m1.attr('class', digit_to_name[vol[1]]);
        digits.m2.attr('class', digit_to_name[vol[3]]);
        }else{
        digits.h1.attr('class', digit_to_name[vol[0]]);
        digits.h2.attr('class', digit_to_name[vol[1]]);
        digits.m1.attr('class', digit_to_name[vol[3]]);
        digits.m2.attr('class', digit_to_name[vol[4]]);
        }


      if(cur.length < 5){
        if(cur[0] == '-'){
        digits1.h1.attr('class', "minus");
        digits1.h2.attr('class', digit_to_name[cur[1]]);
        digits1.m1.attr('class', digit_to_name[cur[3]]);
        }else{
	  digits1.h1.attr('class', '');
          digits1.h2.attr('class', digit_to_name[cur[0]]);
          digits1.m1.attr('class', digit_to_name[cur[2]]);
          digits1.m2.attr('class', digit_to_name[cur[3]]);
        }
      }else{
        if(cur[0] == '-'){
        digits1.h1.attr('class', "minus");
        digits1.h2.attr('class', digit_to_name[cur[1]]);
        digits1.m1.attr('class', digit_to_name[cur[3]]);
        digits1.m2.attr('class', digit_to_name[cur[4]]);
        }else{
          digits1.h1.attr('class', digit_to_name[cur[0]]);
          digits1.h2.attr('class', digit_to_name[cur[1]]);
          digits1.m1.attr('class', digit_to_name[cur[3]]);
          digits1.m2.attr('class', digit_to_name[cur[4]]);
        }
      }



        digits2.h1.attr('class', digit_to_name[tem[0]]);
        digits2.h2.attr('class', digit_to_name[tem[1]]);
        digits2.m1.attr('class', digit_to_name[tem[3]]);
        digits2.m2.attr('class', digit_to_name[tem[4]]);
        // digits2.s1.attr('class', digit_to_name[now[4]]);
        // digits2.s2.attr('class', digit_to_name[now[5]]);


        // The library returns Sunday as the first day of the week.
        // Stupid, I know. Lets shift all the days one position down,
        // and make Sunday last

        // var dow = now[6];
        // dow--;
        //
        // // Sunday!
        // if(dow < 0){
        //     // Make it last
        //     dow = 6;
        // }
        //
        // // Mark the active day of the week
        // weekdays.removeClass('active').eq(dow).addClass('active');

        // Set the am/pm text:
        ampm.text("V");
        ampm1.text("A");
        ampm2.text("°C");

        // Schedule this function to be run again in 1 sec
        setTimeout(update_time, 1000);

    })();

    // Switch the theme

    $('.oval-lg').click(function(){
        voltage.toggleClass('light dark');
        current.toggleClass('light dark');
        temperature.toggleClass('light dark');
    });

});
