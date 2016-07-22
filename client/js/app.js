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
        //$('#img1').css('backgroundImage', `url(${data.photos.1.uri})`).show()
        //$('#img2').css('backgroundImage', `url(${data.photos.2.uri})`).show()
        $('#img1').css('backgroundImage', 'url(https://s3-media1.fl.yelpcdn.com/bphoto/CYaDabytn5SDvxXLoK3aYQ/o.jpg)')
        $('#img2').css('backgroundImage', 'url(https://s3-media4.fl.yelpcdn.com/bphoto/F7ido-iqXCw-R0-XhkeHiA/o.jpg)')
        resizeImages()
    }
}

const bindClickHandlers = ({session_id}) => {
    $('#img1').on('click', makeChoice.bind(null, session_id, 1))
    $('#img2').on('click', makeChoice.bind(null, session_id, 2))
}

const makeChoice = (sessionId, choice) => {
    $.get(API_URL + 'get_pictures/' + sessionId + '/' + choice)
        .then(renderImages)
}

const resizeImages = () => {
    $('.select-img').height($('.select-img').width())
}

$('#start-button').on('click', function(){
    const top = $('.logo').position().top + "px"
    const logoWidth = $(window).width() < 400 ? '40%' : '25%';
    if ($(window).width() < 400) {
        console.log('less 400')
        $('.flex-container').css('height', '100%')
    }
    $('.flex-container').css('justify-content', 'flex-start')
    $('.logo').css({'margin-top': top})
    $('.logo').animate({'margin-top': '15px', 'max-width': logoWidth}, function(){
        $("#instructions").toggleClass('hidden');
        $('#select-picture').toggleClass('hidden');
        $("#img1").css({'transform':'translateX(0px)'});
        $("#img2").css({'transform':'translateX(0px)'});
        $(".select-img").animate({'opacity':1});
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

