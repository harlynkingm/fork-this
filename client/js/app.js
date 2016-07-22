import $ from 'jquery'

const API_BASE_PATH = 'http://interndev1-uswest1adevc'
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
        //$('#1').css('backgroundImage', `url(${data.photos.1.uri})`).show()
        //$('#2').css('backgroundImage', `url(${data.photos.2.uri})`).show()
        $('#1').css('backgroundImage', 'url(https://s3-media1.fl.yelpcdn.com/bphoto/CYaDabytn5SDvxXLoK3aYQ/o.jpg)')
        $('#2').css('backgroundImage', 'url(https://s3-media4.fl.yelpcdn.com/bphoto/F7ido-iqXCw-R0-XhkeHiA/o.jpg)')
        resizeImages()
    }
}

const bindClickHandlers = ({session_id}) => {
    $('#1').on('click', makeChoice.bind(session_id, 1))
    $('#2').on('click', makeChoice.bind(session_id, 2))
}

const makeChoice = (sessionId, choice) => {
    console.log(sessionId, choice)
    $.get(API_URL + 'get_pictures/' + sessionId + '/' + choice)
        .then(renderImages)
}

const resizeImages = () => {
    $('.select-img').height($('.select-img').width())
}

$('#start-button').on('click', function(){
    const top = $('.logo').position().top + "px"
    $('.flex-container').css('justify-content', 'flex-start')
    $('.logo').css({'margin-top': top})
    $('.logo').animate({'margin-top': '15px', 'max-width': '25%'}, function(){
        $("#instructions").toggleClass('hidden');
        $('#select-picture').toggleClass('hidden'); 
    })
    $(".subhead").fadeOut(200)
    $("#start-button").fadeOut(200)
})

renderImages({session_done: false})
bindClickHandlers({session_id: 123})

getUserPosition()
    .then(startSession)
    .then(renderImages)
    .then(bindClickHandlers)

$(window).on('resize', resizeImages)

