$(document).ready(function(){
    console.log('loaded');
    var _chromeExtensionSourceId = null;
    var _localScreenStream = null;
    var _remoteVideoElement = document.querySelector('#screenview');


    $('#getscreen').click(function(){


        getChromeExtensionStatus('ookldbkfcaeghplpagmdfnfnkkkafjki', function (status) {
            if (status == 'installed-enabled') {
                console.log('installed-enabled');
            }

            if (status == 'installed-disabled') {
                console.log('installed-disabled');
            }

            if (status == 'not-installed') {
                console.log('not-installed');
            }

            if (status == 'not-chrome') {
                console.log('not-chrome');
            }
        });


        getSourceId(function (sourceId) {
            if (sourceId != 'PermissionDeniedError') {
                _chromeExtensionSourceId = sourceId;

                getChromeScreenStream();
            }
        });


    });


    $('#stopscreen').click(function(){
        _localScreenStream.getTracks().forEach(function (track) {
            track.stop();
        });
        _remoteVideoElement.src = "";
    });


    getChromeScreenStream = function () {
        var aChromeScreenConstrains = {
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                    maxWidth: 1920,
                    maxHeight: 1080,
                    chromeMediaSourceId: _chromeExtensionSourceId

                },
                optional: [{
                    googTemporalLayeredScreencast: true
                }]
            }
        };

        console.log('aChromeScreenConstrains', aChromeScreenConstrains);
        navigator.getUserMedia(
            aChromeScreenConstrains,
            function (stream) {
                _localScreenStream = stream;
                _remoteVideoElement.src = URL.createObjectURL(stream);
                _remoteVideoElement.autoplay = true;

                stream.getVideoTracks()[0].onended = function (track) {
                    console.log('track ended');
                };
            },
            function (error) {
                console.log('getUserMedia Screen', error);
            }
        );
    };
});