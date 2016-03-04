var wpid;
function $(id){
    return document.getElementById( id );
}

function renderRegionName( data ){
    var elem = $('region_box');
    elem.innerHTML = data.name1 + "|" + data.name2;
}

function getRegion ( position ){
    var scriptElem = document.createElement( 'script');
    scriptElem.type = 'text/javascript';
    scriptElem.charset = 'utf-8';
    var url = 'http://apis.daum.net/local/geo/coord2addr?apikey=f7af3967b96f2f6540ba7da6afb4895ec94c1fd5&longitude=' + position.coords.longitude + '&latitude=' + position.coords.latitude + '&format=simple&output=json&callback=renderRegionName&inputCoordSystem=WGS84'
    scriptElem.src = url;
    document.body.appendChild( scriptElem );
}

function showGeoPosition ( latitude, longitude ){
    var showbox = $( 'geo_box' );
    if ( showbox ){
        showbox.innerHTML = "latitude : " + latitude + ", longitude : " + longitude;    
    }
}

function showError( msg ){
    var showbox = $( 'geo_box' );
    if ( showbox ){
        showbox.innerHTML = msg; 
    }
}

function geo_success( position ) {
    showGeoPosition( position.coords.latitude, position.coords.longitude );
    getRegion ( position );
}

function geo_error (){
    showError( "We cannot get your geographic location!");
}

var geo_options = {
    enableHighAccuracy : true, 
    maximumAge  : 30000,
    timeout : 5000
}

window.addEventListener('load', function(e) {
    wpid = navigator.geolocation.watchPosition( geo_success, geo_error, geo_options );
});