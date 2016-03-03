var videoStream = null;
var video = document.getElementById('video');

// Test browser support
window.navigator = window.navigator || {};
navigator.getUserMedia = navigator.getUserMedia       ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia    ||
                         null;

if (navigator.getUserMedia === null) {
    document.getElementById('gum-unsupported').classList.remove('hidden');
    document.getElementById('button-play-gum').setAttribute('disabled', 'disabled');
    document.getElementById('button-stop-gum').setAttribute('disabled', 'disabled');
} else {
    var createSrc = window.URL ? window.URL.createObjectURL : function(stream) {return stream;};

    // Opera <= 12.16 supports video only.
    var audioContext = window.AudioContext       ||
                       window.webkitAudioContext ||
                       null;

    if (audioContext === null) {
        document.getElementById('gum-partially-supported').classList.remove('hidden');
    }

    document.getElementById('button-play-gum').addEventListener('click', function() {
        // Capture user's audio and video source
        navigator.getUserMedia({
            video: true,
            audio: true
        },

        function(stream) {
            videoStream = stream;
            
            // Stream the data
            video.src = createSrc(stream);
            video.play();
        },
    
        function(error) {console.log('Video capture error: ' + error.code);});
    });

    document.getElementById('button-stop-gum').addEventListener('click', function() {
        // Pause the video
        video.pause();
        // Stop the stream
        videoStream.stop();
    });
}
