// polyfill
var AudioContextDTMF = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

function Tone(contextDTMF, freq1, freq2) {
    this.contextDTMF = contextDTMF;
    this.status = 0;
    this.freq1 = freq1;
    this.freq2 = freq2;
}

Tone.prototype.setup = function(){
    this.osc1 = contextDTMF.createOscillator();
    this.osc2 = contextDTMF.createOscillator();
    this.osc1.frequency.value = this.freq1;
    this.osc2.frequency.value = this.freq2;

    this.gainNode = this.contextDTMF.createGain();
    this.gainNode.gain.value = 0.25;

    this.filter = this.contextDTMF.createBiquadFilter();
    this.filter.type = "lowpass";
    this.filter.frequency = 8000;

    this.osc1.connect(this.gainNode);
    this.osc2.connect(this.gainNode);

    this.gainNode.connect(this.filter);
    this.filter.connect(contextDTMF.destination);
}

Tone.prototype.start = function(){
    this.setup();
    this.osc1.start(0);
    this.osc2.start(0);
    this.status = 1;
}

Tone.prototype.stop = function(){
    this.osc1.stop(0);
    this.osc2.stop(0);
    this.status = 0;
}

var dtmfFrequencies = {
    "num1": {f1: 697, f2: 1209},
    "num2": {f1: 697, f2: 1336},
    "num3": {f1: 697, f2: 1477},
    "num4": {f1: 770, f2: 1209},
    "num5": {f1: 770, f2: 1336},
    "num6": {f1: 770, f2: 1477},
    "num7": {f1: 852, f2: 1209},
    "num8": {f1: 852, f2: 1336},
    "num9": {f1: 852, f2: 1477},
    "asterisco": {f1: 941, f2: 1209},
    "num0": {f1: 941, f2: 1336},
    "numeral": {f1: 941, f2: 1477},
	"clear": {f1: 0, f2: 0}
	
}

var contextDTMF = new AudioContextDTMF();

// Create a new Tone instace. (We've initialised it with 
// frequencies of 350 and 440 but it doesn't really matter
// what we choose because we will be changing them in the 
// function below)
var dtmf = new Tone(contextDTMF, 350, 440);
 