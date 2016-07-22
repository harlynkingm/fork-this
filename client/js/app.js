import $ from 'jquery'

const API_BASE_PATH = 'http://interndev1-uswest1adevc'
const API_URL = 'api/v1/'
let ANIMATING = false
let LOAD_COUNT = 0;
let SESSION_DONE = false

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
    return new Promise((resolve, reject) => {
        if (!data.session_done) {
            //$('#img1').css('backgroundImage', `url(${data.photos.1.uri})`).show()
            //$('#img2').css('backgroundImage', `url(${data.photos.2.uri})`).show()
            $('#img1').css('transform', 'translateX(-300px)');
            $('#img2').css('transform', 'translateX(300px)');
            $('#img1').css('backgroundImage', 'url(https://s3-media1.fl.yelpcdn.com/bphoto/CYaDabytn5SDvxXLoK3aYQ/o.jpg)')
            $('#img2').css('backgroundImage', 'url(https://s3-media4.fl.yelpcdn.com/bphoto/F7ido-iqXCw-R0-XhkeHiA/o.jpg)')
            resizeImages()
            resolve()
        } else {
            reject(data)
        }
    })
}

const bindClickHandlers = ({session_id}) => {
    $('#img1').on('click', makeChoice.bind(null, session_id, 1))
    $('#img2').on('click', makeChoice.bind(null, session_id, 2))
}

const makeChoice = (sessionId, choice, event) => {
    ANIMATING = true
    LOAD_COUNT++
    if (LOAD_COUNT == 2){
        $("#instructions").css('opacity', 0);
        setTimeout(() => {
            $('#instructions').html("After a few selections, we'll recommend a restaurant for you.")
            $('#instructions').css({'opacity': 1})
        }, 400)
    }
    if (LOAD_COUNT == 3){
        SESSION_DONE = true
    }
    $('#img1').css({'transform':'translateX(-300px)', 'opacity': '0', 'box-shadow': ''});
    $('#img2').css({'transform':'translateX(300px)', 'opacity': '0', 'box-shadow': ''});
//    $.get(API_URL + 'get_pictures/' + sessionId + '/' + choice)
//        .then(renderImages)
//        .then(slideIn, showEndPage)
    setTimeout(()=>renderImages({session_done: SESSION_DONE}).then(slideIn, showEndPage), 1000)
}

const showEndPage = () => {
    $('#select-picture').toggleClass('hidden');
    $('#ending-page').toggleClass('hidden');
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
        slideIn();
    })
    $(".subhead").fadeOut(200)
    $("#start-button").fadeOut(200)
    $('.img-dish').css('opacity', '1');
})

const slideIn = () => {
    $("#img1").css({'transform':'translateX(0px)'});
    $("#img2").css({'transform':'translateX(0px)'});
    $(".select-img").css({'opacity':1});
    setTimeout(() => ANIMATING = false, 500)
}

const twist = (obj, degs) => {
    if (!ANIMATING){
        $(obj).css({
            'transform': `rotateZ(${degs}deg)`,
            'box-shadow': 'inset 0px 0px 0px 20px #fff'
        })
    }
}

$('#img1').on('mouseover', function(){
    twist(this, -2);
})

$('#img1').on('mousemove', function(){
    twist(this, -2);
})

$('#img2').on('mouseover', function(){
    twist(this, 2);
})

$('#img2').on('mousemove', function(){
    twist(this, 2);
})

$('.select-img').on('mouseout', function(){
    if (!ANIMATING){
        $(this).css({
            'transform': 'rotateZ(0deg)',
            'box-shadow': ''
        });
    }
})

renderImages({session_done: false})
bindClickHandlers({session_id: 123})

getUserPosition()
    .then(startSession)
    .then(renderImages)
    .then(bindClickHandlers)

$(window).on('resize', resizeImages)

