let currentsong = new Audio();
let songs;
let crrFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    crrFolder=folder;


    let a = await fetch(`/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                            <div>${song.replaceAll("%20" , "").replaceAll("/","")}</div>
                        <div></div>
                    </div>
                    <div class="playnow">
                        <span>play now</span>
                        <img class="invert" src="img/play.svg" alt="">
                    </div>
                        </li>`;

    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs

}

getsongs()
function playmusic(gana, pause = false) {

    currentsong.src = `/${crrFolder}/` + gana
    if (!pause) {
        currentsong.play()
        play.src = ("img/pause.svg")
    }

    play.src = ("img/pause.svg")
    document.querySelector(".songinfo").innerHTML = decodeURI(gana)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayalbums() {
    let a = await fetch(`/songs2/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors=div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if(e.href.includes("/songs2") && !e.href.includes(".htaccess")){
            let folder=e.href.split("/").slice(-2)[0]
            let a = await fetch(`/songs2/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardcontainer.innerHTML=cardcontainer.innerHTML+`
             <div data-folder="${folder}" class="cards">
                        <div class="play">
                            <svg width="25" height="24" viewBox="0 0 24 24" fill="green"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="green" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs2/${folder}/cover.jpeg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
            `
        }
    }
    Array.from(document.getElementsByClassName("cards")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log(e)
            songs = await getsongs(`songs2/${item.currentTarget.dataset.folder}`)  
            playmusic(songs[0])

        })
    })
    
}
async function main() {
     await getsongs("songs2")
    playmusic(songs[0], true)
    console.log(songs)

    displayalbums()

 
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = ("img/pause.svg")
        }
        else {
            currentsong.pause()
            play.src = ("img/play.svg")
        }
    })

    currentsong.addEventListener("timeupdate", () => {
    
        document.querySelector(".songtime").innerHTML = `
        ${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)

            }`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-1020px"
    })




    
    previous.addEventListener("click", () => {
        console.log('previous clicked')
        let index = songs.indexOf((currentsong.src.split("/")).slice(-1)[0])
        if ((index - 1) >=0){
            playmusic(songs[index - 1])}

        
    })


    
    next.addEventListener("click", () => {
        
        console.log("Next clicked")
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
                playmusic(songs[index + 1])
            }
        console.log(songs)

        // let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        // if ((index + 1) < songs.length) {
        //     playmusic(songs[index + 1])
        // }
    })
  
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e.target.value)
        currentsong.volume=parseInt(e.target.value)/100
        if(currentsong.volume>0){
            document.querySelector(".volume img").src= document.querySelector(".volume img").src.replace("mute.svg","volume.svg")
        }
    })
    document.querySelector(".volume img").addEventListener("click",e=>{
        console.log(e.target.src)
        if(e.target.src.includes("volume.svg")){
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume=0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume=0.1
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
    })
    
}


main()

