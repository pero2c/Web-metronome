//create audio context

let context = new AudioContext();

//object that will hold the audio samples once they are loaded

let mySounds = {
  "beep": null,
  "accent": null
};

//assign relevant html elements to variables

let btn = document.getElementById("playbutton");

let tempoInput = document.getElementById("temposelector");

let beatInput = document.getElementById("beats");

let noteValueInput = document.getElementById("notevalue");

let volumeSlider = document.getElementById("volumeslider");

let speedCheckbox = document.getElementById("speedcheckbox");

let iterationsInput = document.getElementById("iterations");

let destinationSpeedInput = document.getElementById("speedstop");

let speedTrainerStepInput = document.getElementById("step");

let tempoDisplay = document.getElementById("tempodisplay")

//declare variables

let tempo;

let beats;

let noteValue;

let iterations;

let myIterations = 0;

let destinationSpeed;

let speedTrainerStep;

let schedulerFrequency = 25; //milliseconds

let overlap = 1.5 * schedulerFrequency / 1000; //seconds

let playing = false;

let nextNoteTime = 0.0;

//event listeners so that the program responds to changes in input

tempoInput.addEventListener("change", function() {
  tempo = tempoInput.value;
});

beatInput.addEventListener("change", function() {
  beats = beatInput.value;
});

noteValueInput.addEventListener("change", function() {
  noteValue = noteValueInput.value;
});

//plays the specified sound at the scheduled time, also checks the volume slider's value to adjust gain

function playSound(buffer, time){
  let source = context.createBufferSource();
  let gainNode = context.createGain();
  gainNode.gain.value = volumeSlider.value;
  source.buffer = buffer;
  source.connect(gainNode);
  gainNode.connect(context.destination);
  source.start(time);
};

//metronome functions

function calculateMultiplier() {
  if(noteValue % 4 === 0){
    return noteValue / 4;
  }
  return 1;
};

function nextNote() {
  //calculate the time at which to schedule the next note
  nextNoteTime += 1 / (tempo / 60) / calculateMultiplier();
  //this lets us know whether to play the accent sound or normal sound
  currentNote++;
  if(currentNote == beats) { 
    currentNote = 0;
  //speed trainer stuff
    if(speedCheckbox.checked){
      myIterations++;
      if(myIterations == iterations){
        myIterations = 0;
        //if tempo + step is bigger than destination tempo, set tempo to the destination tempo
        parseInt(tempo, 10) + parseInt(speedTrainerStep,10) > parseInt(destinationSpeed, 10) ? tempo = parseInt(destinationSpeed) : tempo = parseInt(tempo, 10) + parseInt(speedTrainerStep,10);
        tempoDisplay.textContent = `Current tempo: ${tempo}`
      }
    }
    }
  }

function scheduleNote(time) {
if(currentNote == 0) {
  playSound(mySounds.accent, time);
} else {
  playSound(mySounds.beep, time);
  }
}

function scheduler() {
  while(nextNoteTime < context.currentTime + overlap) {
    scheduleNote(nextNoteTime);
    nextNote();
  }
  timerID = window.setTimeout(scheduler, schedulerFrequency);
}

function play() {
  playing = !playing;
  if(playing) {
    init();
    myIterations = 0;
    currentNote = 0;
    nextNoteTime = context.currentTime;
    scheduler();
  } else {
    window.clearTimeout(timerID);
    init();
  }
}

//loads samples, name must match a property of the mySounds object

function loadSound(url, name) {
  let request = new XMLHttpRequest();
  request.open("get", url, true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      mySounds[name] = buffer; 
    });
  }
  request.send();
}

function unlockSpeedInputs () {
  iterationsInput.disabled = false;
  destinationSpeedInput.disabled = false;
  speedTrainerStepInput.disabled = false;
}

function lockSpeedInputs () {
  iterationsInput.disabled = true;
  destinationSpeedInput.disabled = true;
  speedTrainerStepInput.disabled = true;
}

function init(){
  iterations = parseInt(iterationsInput.value, 10);
  tempo = parseInt(tempoInput.value, 10);
  beats = parseInt(beatInput.value, 10);
  noteValue = parseInt(noteValueInput.value, 10);
  destinationSpeed = parseInt(destinationSpeedInput.value, 10);
  speedTrainerStep = parseInt(speedTrainerStepInput.value, 10);
  tempoDisplay.textContent = `Current tempo:`
}

btn.addEventListener("click", () => {
  console.log(speedCheckbox.checked);
  play();
});

speedCheckbox.addEventListener("change", () => {
  console.log("checkbox changed")
  if(speedCheckbox.checked){
    unlockSpeedInputs();
  } else {
    lockSpeedInputs();
  }
  });

//stop and play metronome with spacebar

window.onkeydown = function(event){
  if(event.keyCode === 32) {
      event.preventDefault();
      btn.click();
  }
}

loadSound("/Web-metronome/mybeep.wav", "beep");

loadSound("/Web-metronome/mainbeep.wav", "accent");

init();
