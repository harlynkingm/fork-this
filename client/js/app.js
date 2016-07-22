import $ from 'jquery'

const API_BASE_PATH = 'http://interndev1-uswest1adevc'
const API_URL = 'api/v1/'

let ANIMATING = false
let LOAD_COUNT = 0;
let SESSION_DONE = false

let IMAGES = [
    'https://s3-media3.fl.yelpcdn.com/bphoto/kODDC-4FivgtRxMh2uFvDw/o.jpg',
    'https://s3-media2.fl.yelpcdn.com/bphoto/4hOJukkFqaqWqdR_vjKIcQ/o.jpg',
    'https://s3-media1.fl.yelpcdn.com/bphoto/1iqea4LGXF9OYSgPqTm6Mw/o.jpg',
    'https://s3-media1.fl.yelpcdn.com/bphoto/r7t8jrlxDjxhCkGdABGOCA/o.jpg',
    'https://s3-media3.fl.yelpcdn.com/bphoto/Z_ANEY9h7JEGqAF3quvmFA/o.jpg',
    'https://s3-media3.fl.yelpcdn.com/bphoto/N8FzOV5JiNArdVWP0APsEA/o.jpg',
    'https://s3-media3.fl.yelpcdn.com/bphoto/YF3HmR4hChuXo-YggILkzQ/o.jpg',
    'https://s3-media2.fl.yelpcdn.com/bphoto/H83_28FYrUCHFCio_SIioQ/o.jpg',
    'https://s3-media1.fl.yelpcdn.com/bphoto/5CzBk137CIubKSF5uu4rzQ/o.jpg',
    'https://s3-media3.fl.yelpcdn.com/bphoto/5sRw-gG5p9C0j8zhfsHwIA/o.jpg',
    'https://s3-media3.fl.yelpcdn.com/bphoto/0sv_o29riplN34HQSJEyLQ/o.jpg'
]

let IMAGE_LABELS = [
    ['thai', 'pasta', 'asian'],
    ['curry', 'indian', 'rice'],
    ['dessert'],
    ['salad', 'thai', 'asian'],
    ['sandwiches', 'american'],
    ['asian'],
    ['sandwiches', 'american'],
    ['pasta', 'italian'],
    ['salad', 'american'],
    ['salad', 'asian'],
    ['pizza', 'italian'],
]

let IMG_INDEX_1 = 0;
let IMG_INDEX_2 = 0;

let USER_TAGS = {}


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


const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const renderImages = (data) => {
    return new Promise((resolve, reject) => {
        if (!data.session_done) {
            //$('#img1').css('backgroundImage', `url(${data.photos.1.uri})`).show()
            //$('#img2').css('backgroundImage', `url(${data.photos.2.uri})`).show()
            let rand1 = getRandomInt(0, IMAGES.length - 1);
            let rand2 = getRandomInt(0, IMAGES.length - 1);
            while (rand1 == rand2){
                rand2 = getRandomInt(0, IMAGES.length - 1);
            }
            [IMG_INDEX_1, IMG_INDEX_2] = [rand1, rand2];
            $('#img1').css('transform', 'translateX(-300px)');
            $('#img2').css('transform', 'translateX(300px)');
            $('#img1').css('backgroundImage', `url(${IMAGES[rand1]})`)
            $('#img2').css('backgroundImage', `url(${IMAGES[rand2]})`)
            resizeImages()
            resolve()
        } else {
            let most = 0;
            let cat = '';
            for (var key in USER_TAGS) {
                if (USER_TAGS[key] > most){
                    most = USER_TAGS[key];
                    cat = key;
                }
            }
            const data = data || { result: { search_result: { category: cat } } };
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
    if (LOAD_COUNT == 8){
        SESSION_DONE = true
    }
    if (choice == 1){
        for (const label of IMAGE_LABELS[IMG_INDEX_1]){
            if (label in USER_TAGS){
                USER_TAGS[label]++;
            } else {
                USER_TAGS[label] = 1
            }
        }
    } else {
        for (const label of IMAGE_LABELS[IMG_INDEX_2]){
            if (label in USER_TAGS){
                USER_TAGS[label]++;
            } else {
                USER_TAGS[label] = 1
            }
        }
    }
    $('#img1').css({'transform':'translateX(-300px)', 'opacity': '0', 'box-shadow': ''});
    $('#img2').css({'transform':'translateX(300px)', 'opacity': '0', 'box-shadow': ''});
//    $.get(API_URL + 'get_pictures/' + sessionId + '/' + choice)
//        .then(renderImages)
//        .then(slideIn, showEndPage)
    setTimeout(()=>renderImages({session_done: SESSION_DONE}).then(slideIn, showEndPage), 1000)
}

const showEndPage = ({result}) => {
    const category = result.search_result.category
    console.log(result)
    $('#select-picture').toggleClass('hidden');
    $('#ending-page').toggleClass('hidden');
    $('#recommendation').html(`<a href="https://www.yelp.com/search?find_desc=${category}&find_loc=140+New+Montgomery+St" target="_blank">${category}</a>`)
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

