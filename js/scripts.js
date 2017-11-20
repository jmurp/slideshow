console.log("scripts are running...");


var imageFolder = "../images/";
var imageSources = [];
var currentImage = {
    index: 0,
    source: ""
};
var thumbnails = document.getElementById("thumbnails");
var imageInView = document.getElementById("imageInView");
var rightArrow = document.getElementById("right");
var leftArrow = document.getElementById("left");
var playPause = document.getElementById("playPause");
var playingID;
var slideInterval = 30000;//30s
var intervalInput = document.getElementById("intervalInput");
var intervalSubmit = document.getElementById("intervalSubmit");

$.ajax({
    url : imageFolder,
    success: function (data) {
        $(data).find("a").attr("href",function (i,val) {
            if (val.match(/\.(jpe?g|png)$/)) {
                console.log(val);
                if (!val.includes("/images/")) {
                    val = "/images/"+val;
                }
                imageSources.push(val);
            }
        });
    }
}).done(loadSite);

function loadSite() {
    if (imageSources.length == 0) {
        console.log("...no images...");
        return;
    }
    for (i = 0; i < imageSources.length; i++) {
        addThumb(imageSources[i]);
    }
    setImageInView(imageSources[0]);
    rightArrow.addEventListener("click",rightArrowClick);
    leftArrow.addEventListener("click",leftArrowClick);
    document.addEventListener("keydown",function(e) {
        if (e.keyCode == 37) {
            leftArrowClick();
        }else if (e.keyCode == 39) {
            rightArrowClick();
        }else if (e.keyCode == 32) {
            playPauseClick();
        }
    });
    playPause.addEventListener("click",playPauseClick);
    playPauseClick();
    intervalSubmit.addEventListener("click",setIntervalValue);
}
function addThumb(imageSource) {
    var thumb = document.createElement("div");
    thumb.classList.add("thumbnail");
    thumb.style.backgroundImage = "url('"+imageSource+"')";
    thumb.addEventListener("click",thumbClick.bind(thumb,imageSource));
    thumbnails.appendChild(thumb);
}
function setImageInView(imageSource) {
    var indexOfThisImage = imageSources.indexOf(imageSource);
    currentImage.index = indexOfThisImage;
    currentImage.source = imageSource;
    updateImageView();
}
function updateImageView() {
    imageInView.setAttribute("src",currentImage.source);
}
function thumbClick(imageSource) {
    setImageInView(imageSource);
}
function rightArrowClick() {
    var nextIndex = currentImage.index + 1;
    if (nextIndex >= imageSources.length) { nextIndex = 0; }
    currentImage.index = nextIndex;
    currentImage.source = imageSources[nextIndex];
    updateImageView();
}
function leftArrowClick() {
    var nextIndex = currentImage.index - 1;
    if (nextIndex <= 0) { nextIndex = imageSources.length - 1; }
    currentImage.index = nextIndex;
    currentImage.source = imageSources[nextIndex];
    updateImageView();
}
function playPauseClick() {
    if (playPause.classList.contains("playing")) {
        playPause.classList.remove("playing");
        clearInterval(playingID);
    }else {
        playPause.classList.add("playing");
        playingID = setInterval(rightArrowClick,slideInterval);
    }
}
function setIntervalValue() {
    var newInterval = parseInt(intervalInput.value);
    if (isNaN(newInterval)) {
        return;
    }else {
        if (newInterval < 1) { newInterval = 1; }
        slideInterval = newInterval * 1000;
        clearInterval(playingID);
        playingID = setInterval(rightArrowClick,slideInterval);
    }
}


console.log("scripts are done running");