(function(){
    
    var slideshow = {
        
        images: [],
        currentImageIndex: 0,
        currentInterval: 30,
        intervalID: 0,
        playing: false,
        next: function(){
            this.currentImageIndex++;
            if (this.currentImageIndex > this.images.length-1) {
                this.currentImageIndex = 0;
            }
            this.render();
        },
        previous: function(){
            this.currentImageIndex--;
            if (this.currentImageIndex < 0) {
                this.currentImageIndex = this.images.length-1;
            }
            this.render();
        },
        playPause: function() {
            if (this.playing) {
                this.stopSlideshow();
                this.playPauseButton.classList.remove("playing");
            }else {
                this.startSlideshow();
                this.playPauseButton.classList.add("playing");
            }
        },
        clickThumb: function(){
            slideshow.currentImageIndex = this.id.split("_")[1];
            slideshow.render();
        },
        startSlideshow: function(){
            this.intervalID = setInterval(function(){
                slideshow.next();
            },this.currentInterval * 1000);
            this.playing = true;
        },
        stopSlideshow: function(){
            clearInterval(this.intervalID);
            this.playing = false;
        },
        setIntervalValue: function(){
            
            let userInput = parseInt(this.intervalInput.value);
            if (isNaN(userInput)) {
                return;
            }else {
                if (userInput < 1) { userInput = 1; }
                this.currentInterval = userInput;
                if (this.playing) {
                    this.stopSlideshow();
                    this.startSlideshow();   
                }
            }
            
        },
        loadImages: function(callback){
            
            $.ajax({
                url: "../images/",
                success: function(data) {
                    $(data).find("a").attr("href",function(i,val){
                        if (val.match(/\.(jpe?g|png)$/)){
                            //console.log("found image: "+val);
                            if (!val.includes("images/")) {
                                val = "../images/"+val;
                                //console.log("setting to: "+val);
                            }else if (val.substr(0,2) != "..") {
                                val = ".."+val;
                                //console.log("setting to: "+val);
                            }
                            slideshow.images.push(val);
                        }
                    });
                },
                complete: function(){
                    callback.call(slideshow);
                }
            });
            
        },
        cacheDOM: function(){
            
            this.thumbnails = document.getElementById("thumbnails");
            this.imageView = document.getElementById("imageView");
            this.leftButton = document.getElementById("left");
            this.rightButton = document.getElementById("right");
            this.playPauseButton = document.getElementById("playPause");
            this.intervalSubmit = document.getElementById("intervalSubmit");
            this.intervalInput = document.getElementById("intervalInput");
            
        },
        render: function(){
            
            if (this.thumbnails.children.length == 0) {
                for (let i = 0; i < this.images.length; i++) {
                    let thumb = document.createElement("div");
                    thumb.classList.add("thumbnail");
                    thumb.id = "thumb_"+i;
                    thumb.style.backgroundImage = "url('"+this.images[i]+"')";
                    this.thumbnails.appendChild(thumb);
                }
            }
            
            let imageSource = this.images[this.currentImageIndex];
            this.imageView.style.backgroundImage = "url('"+imageSource+"')";
            
            
        },
        bindEvents: function(){

            this.leftButton.addEventListener("click",this.previous.bind(slideshow));
            this.rightButton.addEventListener("click",this.next.bind(slideshow));
            this.playPauseButton.addEventListener("click",this.playPause.bind(slideshow));
            document.addEventListener("keydown",function(e) {
               if (e.keyCode == 37) {
                   slideshow.previous();
               }else if (e.keyCode == 39) {
                   slideshow.next();
               }else if (e.keyCode == 32) {
                   slideshow.playPause();
               }
            });
            let next = this.thumbnails.firstChild;
            while (next != null) {
                next.addEventListener("click",this.clickThumb.bind(next));
                next = next.nextSibling;
            }
            this.intervalSubmit.addEventListener("click",this.setIntervalValue.bind(slideshow));
            
        },
        init: function(){
            
            let finish = function(){
                this.cacheDOM();
                this.render();
                this.bindEvents();
                this.startSlideshow();
            };
            this.loadImages(finish);
            
        }
        
        
    };
    
    slideshow.init();
    
})();