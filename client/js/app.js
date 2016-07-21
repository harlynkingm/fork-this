import $ from 'jquery'

const API_BASE_PATH = 'interndev1-uswest1adevc'
const API_URL = 'api/v1/'

const getUserPosition = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

const startSession = (geolocation) => {
    const loc = geolocation.coords
    return $.ajax({
        method: 'GET',
        url: API_URL + 'start_session/' + loc.latitude + '/' + loc.longitude
    })
}

const renderImages = (data) => {
    if (!data.session_done) {
        // render photos
    }
}

const bindClickHandlers = () => {
    $('#1').on('click', makeChoice.bind(sessionId, 1))
    $('#2').on('click', makeChoice.bind(sessionId, 2))
}

const makeChoice = (session_id, e) => {
    $.get(API_URL + 'get_pictures/' + session_id + '/' + choice)
        .then(renderImages)
}

$('#start-button').on('click', function(){
    const top = $('.logo').position().top + "px"
    $('.flex-container').css('justify-content', 'flex-start')
    $('.logo').css({'margin-top': top})
    $('.logo').animate({'margin-top': '15px', 'max-width': '25%'}, function(){
        $("#instructions").toggleClass('hidden');
    })
    $(".subhead").fadeOut(200)
    $("#start-button").fadeOut(200)
})

getUserPosition()
    .then(startSession)
    .then(renderImages)
    .then(bindClickHandlers)