// Selecting all required tags and elements
const wrapper = document.querySelector(".wrapper"),
musicimage = wrapper.querySelector(".photoarea img"),
musicname = wrapper.querySelector(".songdetailsarea .name"),
musicartist = wrapper.querySelector(".songdetailsarea .artist"),
musicaudio = wrapper.querySelector("#main-audio"),
playPausebtn = wrapper.querySelector(".playandpause"),
prevbtn = wrapper.querySelector("#previous"),
nextbtn = wrapper.querySelector("#nextone"),
progressbar = wrapper.querySelector(".progressbar"),
progressarea = wrapper.querySelector(".progressarea"),
musiclist = wrapper.querySelector(".musiclist"),
showmusic = wrapper.querySelector("#queue"),
hidemusic = musiclist.querySelector("#closebutton");

let musicindex = 0;

/*
Begin loading music as soon as window launches
*/
window.addEventListener("load", ()=>{  
    loadingmusic(musicindex);
})

function loadingmusic(index){
    /* 
    Loads all the necessary information regarding the track

    Arguments:
        index (integer): specifies the relevant track

    Returns:
        None
    */
    musicname.innerText = allMusic[index].name;  // loads the title of the track
    musicartist.innerText = allMusic[index].artist; // loads the artist of the track
    musicimage.src = `Song_Images/${allMusic[index].img}.jpg`; // loads the image of the corresponding track
    musicaudio.src = `Songs/${allMusic[index].src}.mp3`; // loads the audio of the corresponding track
}
// play music
function playmusic(){
    wrapper.classList.add("paused");
    playPausebtn.querySelector("i").innerText = "pause";
    musicaudio.play();

}

// pause music
function pausemusic(){
    wrapper.classList.remove("paused");
    playPausebtn.querySelector("i").innerText = "play_arrow";
    musicaudio.pause();

}

// next music
function nextMusic(){
    // increment index by 1 and start playing next track
    musicindex++;
    // if we are trying to skip the last song then it will go back to the first song 
    if(musicindex > allMusic.length-1){
        musicindex = 0;
    }
    loadingmusic(musicindex);
    playmusic();
}

// previous music
function prevMusic(){
    // decrement index by 1 and start playing previous track
    musicindex--;
    // if we are at the first song and try to play the previous song then start playing the last song
    if(musicindex < 0){
        musicindex = allMusic.length - 1;
    }
    loadingmusic(musicindex);
    playmusic();
}


// music button event
playPausebtn.addEventListener("click", ()=>{
    const ismusicpaused = wrapper.classList.contains("paused");
    // If ismusicpaused is true, invoke pausemusic otherwise invoke playmusic
    ismusicpaused ? pausemusic() : playmusic();
});

// next button event
nextbtn.addEventListener("click", ()=>{
    nextMusic(); 
});

// previous button event
prevbtn.addEventListener("click", ()=>{
    prevMusic(); 
});

// progress bar width based on current music time
musicaudio.addEventListener("timeupdate", (e)=>{
    const currenttime = e.target.currentTime;  // get current time of song
    const songduration = e.target.duration; // get total duration of song
    let progbarwidth = (currenttime / songduration) * 100;
    progressbar.style.width = `${progbarwidth}%`;
    let musiccurrenttime = wrapper.querySelector(".currenttime"),
    musicduration = wrapper.querySelector(".duration");
    musicaudio.addEventListener("loadeddata", ()=>{
        // update song duration
        let audiolength = musicaudio.duration;
        let totalmin = Math.floor(audiolength / 60);
        let totalsec = Math.floor(audiolength % 60);
        if(totalsec < 10){  // adding 0 if seconds is less than 10
            totalsec = `0${totalsec}`;
        }
        musicduration.innerText = `${totalmin}:${totalsec}`;
    });
    // update playing song current time 
    let currentmin = Math.floor(currenttime / 60);
    let currentsec = Math.floor(currenttime % 60);
    if(currentsec < 10){  // adding 0 if seconds is less than 10
        currentsec = `0${currentsec}`;
    }
    musiccurrenttime.innerText = `${currentmin}:${currentsec}`;
});

// updating current song time according to the width of the progress bar
progressarea.addEventListener("click", (e)=>{
    let progresswidthvalue = progressarea.clientWidth;  // get progress bar width
    let clicked = e.offsetX;  // get the offset value
    let songdur = musicaudio.duration;  

    musicaudio.currentTime = (clicked / progresswidthvalue) * songdur;
    playmusic(); // ensures that if song is paused but progress bar is clicked then music will play at that time

});

// change the repeat/shuffle icon when clicked
const repeatbutton = wrapper.querySelector("#repeatlist");
repeatbutton.addEventListener("click", ()=>{
    // get innerText of repeat button and adjust according to scenario
    let text = repeatbutton.innerText; 
    switch(text) {
        case "repeat":  // if we have the repeat icon then change it to repeat once icon
            repeatbutton.innerText= "repeat_one";
            repeatbutton.setAttribute("title","Song looped")
            break;
        case "repeat_one": // if we have the repeat once icon then change it to the shuffle icon
            repeatbutton.innerText= "shuffle";
            repeatbutton.setAttribute("title","Playlist shuffle")
            break;
        case "shuffle": // if we have the shuffle icon then change it to repeat
            repeatbutton.innerText= "repeat";
            repeatbutton.setAttribute("title","Playlist looped")
            break;

    }
});

// after song ends, what to do based on repeat/shuffle icon?
musicaudio.addEventListener("ended", ()=>{
    
    let text = repeatbutton.innerText; 
    switch(text) {
        case "repeat":  // if we have the repeat icon then play next song
            nextMusic();
            break;
        case "repeat_one": // if we have the repeat once icon then we'll change the time of the current song so current song plays again
            musicaudio.currentTime = 0;
            loadingmusic(musicindex);
            playmusic();
            break;
        case "shuffle": // if we have the shuffle icon then need to play a random song
            let randomindex = Math.floor(Math.random()*(allMusic.length)); // generates random index between 0 and allMusic.length - 1
            do{
                randomindex = Math.floor(Math.random()*(allMusic.length));
            }while(musicindex==randomindex)  // this ensures that we don't shuffle and get the same song
            musicindex = randomindex;
            loadingmusic(musicindex); // loading the random song
            playmusic();
            break;

    }
});

// when you click the playlist button it should show the next songs to be played
showmusic.addEventListener("click", ()=> {
    musiclist.classList.toggle("show");
});

// when you click the close button, the songs to be played shall be closed and return to old screen
hidemusic.addEventListener("click", ()=> {
    showmusic.click();
});

const ulTag = wrapper.querySelector("ul");
// creating music list (not working)
for(let i=0; i< ((allMusic.length)-1); i++) {
    // pass the song's name, artist from allMusic to li
    let liTag = `<li>
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src ="Songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audiodur">4:16</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liaudioduration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liaudiotag = ulTag.querySelector(`.${allMusic[i].src}`);

    liaudiotag.addEventListener("loadeddata", ()=> {
        let audiolength = liaudiotag.duration;
        let totalmin = Math.floor(audiolength / 60);
        let totalsec = Math.floor(audiolength % 60);
        if(totalsec < 10){  // adding 0 if seconds is less than 10
            totalsec = `0${totalsec}`;
        }
        liaudioduration.innerText = `${totalmin}:${totalsec}`;
    });
}