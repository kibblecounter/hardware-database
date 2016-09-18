var Firebase = require("firebase");
// require("firebase/auth");
// require("firebase/database");
// var config = {
//   apiKey: "AIzaSyB5uxlLVnCeHOh3SFUKFORb_A6FRKMquig",
//   authDomain: "kibblecounter.firebaseapp.com",
//   databaseURL: "https://kibblecounter.firebaseio.com",
//   storageBucket: "kibblecounter.appspot.com",
// };
// Firebase.initializeApp(config);

var five = require("johnny-five"),led, fsrFood, fsrWater;
board = new five.Board();

// Food
var firebaseFood = new Firebase("https://kibblecounter.firebaseio.com/currentLevelFood");

// Water
var firebaseWater = new Firebase("https://kibblecounter.firebaseio.com/currentLevelWater");

board.on("ready", function() {
  led = new five.Led(9);

  // Create a new `fsr` hardware instance for food measurements.
  fsrFood = new five.Sensor({
    pin: "A0",
    freq: 500
  });

  //Create a new `fsr` hardware instance for water measurements.

  fsrWater = new five.Sensor({
    pin: "A1",
    freq: 550
  });


  // Scale the sensor's value to the LED's brightness range
  fsrFood.scale([0, 255]).on("data", function() {
    console.log("fsr1: " + this.scaled);
    // set the led's brightness based on force
    // applied to force sensitive resistor

    led.brightness(this.scaled);
  });
  fsrWater.scale([0, 255]).on("data", function() {
    console.log("fsr2: " + this.scaled);
    // set the led's brightness based on force
    // applied to force sensitive resistor

    led.brightness(this.scaled);
  });

  // Update Firebase Food level
  // fsrFood.on("change", function(){
  //   Firebase.database().ref('currentLevelFood').set({
  //     'food': this.scaled
  //   })
  // });
  fsrFood.on("change", function(){
    firebaseFood.set({'food': this.scaled})
  })

// Update Firebase Water level
  // fsrWater.on("change", function(){
  //   Firebase.database().ref('currentLevelWater').set({
  //     'water': this.scaled
  //   })
  // })

  fsrWater.on("change", function(){
    firebaseWater.set({'water': this.scaled})
  })
});
