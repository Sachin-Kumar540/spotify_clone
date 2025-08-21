console.log('Lets write javasript ');
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
   if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";

   }
   const minutes = Math.floor(seconds / 60);
   const remainingSeconds = Math.floor(seconds % 60);

   const formattedMinutes = String(minutes).padStart(2, '0');
   const formattedSeconds = String(remainingSeconds).padStart(2, '0');


   return `${formattedMinutes}:${formattedSeconds}`;



}


async function getSongs(folder) {
   currFolder=folder;
   let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
   let response = await a.text();
   console.log(response)
   let div = document.createElement("div")
   div.innerHTML = response;
   let as = div.getElementsByTagName("a")

   console.log(as)
   songs = []
   for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
         songs.push(element.href.split(`/${folder}/`)[1])
      }
   }
  //show all the songs in the playlist
   let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
   songUL.innerHTML= ""
   for (const song of songs) {
      songUL.innerHTML = songUL.innerHTML + `<li>
      
                            <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Dhruv </div>
                            </div>
                            <div class="playnow">
                                <span>Playnow</span>
                                <img  class="invert" src="play.svg" alt="">
                            </div>
                        
      </li>`;

   }

   //attach an event listener to each song  
   Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", element => {
         console.log(e.querySelector(".info").firstElementChild.innerHTML)
         playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      })



   })



}
const playMusic = (track, pause=false) => {
   // let audio=new Audio("/songs/"+ track)
   currentSong.src = `/${currFolder}/` + track
   currentSong.play()
   play.src = "pause.svg"
   document.querySelector(".songinfo").innerHTML = track
   document.querySelector(".songtime").innerHTML = "00:00 /00:00"
}


async function main() {
   let currentSongs;
   // get the list of the all the songs 
   await getSongs("songs/ncs")
   playMusic(songs[0],true)
  

   //attach an event listener to play ,next and previous
   play.addEventListener("click", () => {
      if (currentSong.paused) {
         currentSong.play()
         play.src = "pause.svg"
      }
      else {
         currentSong.pause()
         play.src = "play.svg"

      }

   })

   //listen for the timeupdate event
   currentSong.addEventListener("timeupdate", () => {
      console.log(currentSong.currentTime, currentSong.duration);
      document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)
         }/${secondsToMinutesSeconds(currentSong.duration)}`
         document.querySelector(".circle").style.left =(currentSong.currentTime/currentSong.duration) *100 +"%";
   })
   //Add an event listener to seekbar
   document.querySelector(".seekbar").addEventListener("click",e=>{
      let percent =(e.offsetX/e.target.getBoundingClientRect().width)* 100;
      document.querySelector(".circle").style.left=percent +"%";
      currentSong.currentTime=((currentSong.duration) * percent)/100;

   })
   //add an event listner to previous
   previous.addEventListener("click",()=>{
      console.log("previous clicked")
      console.log(currentSong)
      let index=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
      if((index-1)>=0){
         playMusic(songs[index-1])
      }
   })
   //add an event listner to next
   next.addEventListener("click",()=>{
      console.log("Next clicked")
      
      let index=songs.indexOf(currentSong.src.split("/").slice(-1) [0])
      if((index+1)<songs.length){
         playMusic(songs[index+1])
      }
   })
    //add an event to volumn
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",
      (e)=>{
         console.log(e,e.target.value)
         currentSong.volume=parseInt(e.target.value)/100
      }
    )

    //load the playlist whenever card is clicked
    document.getElementsByClassName(".card").forEach(e=>{
      e.addEventListener("click",item=>{
         item.dataset.folder
      })
    })
}

main()

