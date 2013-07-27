/* Author:
    PeterPeerdeman.nl, september 2011
*/

$(document).ready(function() {
    var tweetarray = [];
    var drawarray = [];
    var pause = false;
    var refreshScreenTimer;
    var refreshTweetsTimer;

    var canvas = document.getElementById('thecanvas');
    var context = canvas.getContext("2d");

    $(window).resize(  function () {
        canvas.width = window.innerWidth - 70;
        canvas.height = window.innerHeight - 100;
    });
    $(window).resize();
    
    context.font = "bold 18px helvetica";

    function update() {
       for(i=0;i<drawarray.length;i++) {
            drawarray[i].x += drawarray[i].speed;
            if(drawarray[i].x > canvas.width) {
                drawarray.splice(i,1);
            }
        }
    };

    function newTweet() {
        if(tweetarray.length>0) {
            drawarray.push(tweetarray.pop());
        }
    };

    function draw() {
        update();
        context.clearRect ( 0 , 0 , canvas.width , canvas.height );
        if(drawarray.length>0) {
            for(i=0;i<drawarray.length;i++) {
                current = drawarray[i];
                if(current.tweetimage && current.tweetimage.complete) {
                    context.drawImage(current.tweetimage,current.x,current.y);
                }
                context.fillStyle = current.fillstyle; 
                context.fillText(current.tweet.text,current.x+60, current.y+25);                    
            }
        }
    };

    function sleep(ms) {
        ms += new Date().getTime();
        while (new Date() < ms){}
    };

    function getTweets() {
        $.ajax({
            url: "../proxy/twitter/?option=user",
            success: function(json, status, xhr) { 
                /* handle success */ 
                json.forEach(function(tweet) {
                    x = Math.random()*canvas.width/2;
                    y = Math.random()*canvas.height;
                    fillstyle = '#'+Math.floor(Math.random()*16777215).toString(16);
                    speed = (Math.random()*2)+1;
                    var tweetimage = new Image();
                    tweetimage.src = tweet.user.profile_image_url;
                    tweetarray.push({x:x,y:y,speed:speed,tweetimage:tweetimage,fillstyle:fillstyle,tweet:tweet});
                });
            },
            cache: false
		});	

    };
    
    function init() {
        setTimers();
        getTweets();
        newTweet();
    }

    function setTimers (){
        refreshTweetsTimer = setInterval(function() {getTweets();}, 10000);
        newTweetTimer = setInterval(function() {newTweet();}, 500);
        refreshScreenTimer = setInterval(function() {draw();}, 10);
    }   

    function removeTimers () {
        clearInterval(refreshTweetsTimer);     
        clearInterval(newTweetTimer);     
        clearInterval(refreshScreenTimer);     
    }
    
	$('.pausebutton').bind('click', function(){
        if(pause==false) {
            removeTimers();
            pause=true;
        } else {
            setTimers();
            getTweets(); 
            pause=false;
        }
    });

    $('.stopbutton').bind('click', function() {
    });

    init();    

});
