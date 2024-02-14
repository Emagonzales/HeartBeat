// Accessing the microphone using getUserMedia API
navigator.mediaDevices.getUserMedia({
    audio: true
}).then(function (stream){

    // Creating an AudioContext to handle audio processing
    const audioContext = new AudioContext();
    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    // Setting FFT (Fast Fourier Transform) size for frequency analysis
    // Setting the FFT size to 4096 enhances the accuracy of frequency analysis
    analyser.fftSize = 4096;
    const bufferLength = analyser.frequencyBinCount;

    // Creating a Uint8Array to store frequency data
    const dataArray = new Uint8Array(bufferLength);

    // Connecting the microphone source to the analyser node
    microphone.connect(analyser);
    
    const heart = document.querySelector('.heart');

    // Smoothing the frequency data to make it less jagged
    const smoothingTimeConstant = 0.15;
    analyser.smoothingTimeConstant = smoothingTimeConstant;

    function animateHeart(){
        requestAnimationFrame(animateHeart);

        analyser.getByteFrequencyData(dataArray);

         // Dividing frequency data into bass and high pitch arrays
        const bassArray = dataArray.slice(0, bufferLength / 4); 
        const highPitchArray = dataArray.slice(bufferLength / 100);

        // Calculating average values for bass and high pitch arrays
        const bassAverage = bassArray.reduce((a, b) => a + b, 0) / bassArray.length;
        const highPitchAverage = highPitchArray.reduce((a, b) => a + b, 0) / highPitchArray.length;
        
        // Scaling the heart based on average frequency values
        let bassScale = 1 + bassAverage / 256 * 1.5;
        let highPitchScale = 1 + highPitchAverage / 256 * 1.5;

        // Calculating overall scale based on bass and high pitch scales
        let scale = (bassScale + highPitchScale) / 2;
        scale = Math.min(scale, 1.6); // Limiting the maximum scale

        heart.style.transform = `scale(${scale})`;
    }

    animateHeart();

}).catch(function (err) {
    console.error('Error accessing microphone:', err);
});