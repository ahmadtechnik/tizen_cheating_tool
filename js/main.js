 var linearAccelerationSensor;
 var sens_interval;
 var scrolled = false;
 var acceleration_s;
 var delay = 100;
 var lastPostion;
 $(document).ready(function() {

     $("#hide-data").on("click", function() {
         $("#s-text-container").hide();
         $(window).scrollTo(0);
     });
     $("#show-data").on("click", function() {
         $("#s-text-container").show();
         if (lastPostion) {
             $(window).scrollTo(lastPostion);
         }
     });
     $("#refresh-page").on("click", function() {
         window.location.reload();
     });

     // get data from server
     ajaxGet();

     // add eventListener for tizenhwkey
     document.addEventListener('tizenhwkey', function(e) {
         if (e.keyName == "back")
             try {
                 tizen.application.getCurrentApplication().exit();
             } catch (ignore) {}
     });

     // Sample code
     var textbox = document.querySelector('.contents');
     textbox.addEventListener("click", function() {

     });

     // Sets the screen state change listener.
     tizen.power.setScreenStateChangeListener(onScreenStateChanged);
     var accelerationCapability = tizen.systeminfo.getCapability('http://tizen.org/feature/sensor.accelerometer');

     if (accelerationCapability === true) {
         /* Device supports the acceleration sensor */
         /* Do whatever you need to do with acceleration sensor */
         /* Device supports the proximity sensor */
         acceleration_s = tizen.sensorservice.getDefaultSensor('ACCELERATION');

         // after start the sennsor it should get the data from it
         acceleration_s.start(startSenssor);
     }

     //var sensors = tizen.sensorservice.getAvailableSensors();

 })

 function action() {
     acceleration_s.getAccelerationSensorData(function(data) {
         var scrolled_value = checkOfsetOfBody();
         var x = Math.floor(data.x * 100);
         var z = Math.floor(data.z * 100);
         var y = Math.floor(data.y * 100);
         //
         if (scrolled_value) {
             console.log("X : " + x, "Y : " + y, "Z : " + z);
             if (between(z, -200, 200) && between(x, 800, 1000)) {
                 navigator.vibrate(1000);
                 $('body').scrollTo(0);
                 delay = 5000;
                 sens_interval = setTimeout(action, delay);
                 $("#s-text-container").hide();
             } else {
                 navigator.vibrate(0);
                 delay = 100;
                 sens_interval = setTimeout(action, delay);
             }

             lastPostion = scrolled_value;
            
         } 
         //
         else {
             delay = 1000;
             //console.log("delay : " , delay);
             sens_interval = setTimeout(action, delay);
         }
         //
         if (y > 200 && between(x, -300, 300)) {
             scrollTopPlus();
         } 
         //
         else if (y < -200 && between(x, -300, 300)) {
             scrollTopMinus();
         }
     });

 }

 function scrollTopPlus() {
     var scrolled = $('body').scrollTop();
     $('body').scrollTop(scrolled + 10);
 }

 function scrollTopMinus() {
         var scrolled = $('body').scrollTop();
         $('body').scrollTop(scrolled - 10);
     }
     /***
      *
      */
 function startSenssor() {
         sens_interval = setTimeout(action, delay);
     }
     /**
      * in case the display goes off, the programm will turn it on again
      * @param previousState
      * @param changedState
      */

 function checkOfsetOfBody() {
     var offset = $(window).scrollTop();
     if (offset > 0) {
         return offset;
     }
     return false;
 }

 function onScreenStateChanged(previousState, changedState) {
         //box.innerHTML = "Screen state changed from " + previousState + " to " + changedState;
         setStatus("Screen state changed from " + previousState + " to " + changedState);

         //
         try {
             if (changedState === "SCREEN_DIM") {
                 setStatus("Screen DIM state change from " + previousState + " to " + changedState);
                 //screen flickers when using this: tizen.power.turnScreenOn();
                 if (!tizen.power.isScreenOn()) {
                     tizen.power.turnScreenOn();
                     tizen.power.request("SCREEN", "SCREEN_NORMAL");

                 }
             } else if (changedState === "SCREEN_OFF") {
                 setStatus("Screen OFF state and changing from " + previousState + " to " + changedState);
                 //screen flickers when using this: tizen.power.turnScreenOn();
                 if (!tizen.power.isScreenOn()) {
                     tizen.power.turnScreenOn();
                     tizen.power.request("SCREEN", "SCREEN_NORMAL");;
                 }
             }
         } catch (e) {
             // TODO: handle exception
         }

     }
     /***
      *
      * @param stat
      */
 function setStatus(stat) {
         // document.getElementById("dislpay-status").innerText = stat;
     }
     /***
      *
      */
 var length = 0;

 function ajaxGet() {
     $("#content").load("https://ah-t.de/sc", function(response) {
         length = response.length;
         timeHandler();
     })
 }

 var interval;

 function timeHandler() {
     clearInterval(interval);
     interval = null;
     interval = setInterval(function() {
         var dateObject = new Date();
         var y = dateObject.getFullYear().toString();
         var M = dateObject.getMonth().toString();
         var d = dateObject.getDate().toString();
         var h = dateObject.getHours().toString();
         var m = dateObject.getMinutes().toString();
         var s = dateObject.getSeconds().toString();
         var time = pad(h, 2) + ":" + pad(m, 2) + ":" + pad(s, 2);
         var date = y + "." + pad(M, 2) + "." + pad(d, 2);
         document.getElementById("time-text").innerText = time;
         document.getElementById("date-text").innerText = date;
         if (s % 5 === 0) {

         }
     }, 1000)
 }

 function pad(n, len) {
     return (new Array(len + 1).join('0') + n).slice(-len);
 }

 function between(x, min, max) {
     return x >= min && x <= max;
 }