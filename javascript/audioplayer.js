// Hide listen to story button and display default audio tag
const displayAudio = () => {
  document.querySelector("#playButton").style.display = "none";
  document.querySelector("audio").style.display = "block";
  document.querySelector("audio").play();
};

// Hide default audio tag and display listen to story button
const hideAudio = () => {
  document.querySelector("audio").style.display = "none";
  document.querySelector("#playButton").style.display = "flex";
};

// on click listen to story event listener
document.getElementById("playButton").onclick = displayAudio;

// when audio ends hide default audio tag
document.querySelector("audio").addEventListener("ended", hideAudio);
