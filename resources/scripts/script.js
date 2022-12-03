import { getEndpoint, getGenreData, getResponse, addToDropdownTV, addToDropdownMovie} from './helpers.js';

let dataMovie;
let dataTV;
const radioElement = document.getElementsByName('type');

const tvGenreSection = document.getElementsByClassName('tvGenre')[0];
const MovieGenreSection = document.getElementsByClassName('movieGenre')[0];

const submitRadioOption = document.getElementsByClassName('submit-radio')[0];

const tvDropdownMenu = document.getElementsByClassName('genretv-dropdown')[0];
const generateTVButton = document.getElementsByClassName('submit-button-dropdown-tv')[0];
generateTVButton.addEventListener('click', getDetails)

const MovieDropdownMenu = document.getElementsByClassName('genreMovie-dropdown')[0];
const generateMovieButton = document.getElementsByClassName('submit-button-dropdown-movie')[0];
generateMovieButton.addEventListener('click', getDetails)

const likeButton = document.getElementsByClassName('likeButton')[0];
const dislikeButton = document.getElementsByClassName('dislikeButton')[0];

likeButton.addEventListener('click', likeDislike)
dislikeButton.addEventListener('click', likeDislike)

// console.log(generateTVButton)

submitRadioOption.addEventListener('click', displayGenre);

let clicked;
let displayElement = document.querySelector('.display');


function checkifShowClicked() {
    radioElement.forEach(index => index.addEventListener('click', checkifShowClicked));
    if (radioElement[1].value !== clicked) {
        tvGenreSection.style.display = 'none';
    }
    else if (radioElement[0].value !== clicked) {
        MovieGenreSection.style.display = 'none';
    }
    displayElement.style.display = 'none';
}

function displayGenre() {
    checkifShowClicked()
    if (radioElement[0].checked) {
        tvGenreSection.style.display = 'block';
        clicked = radioElement[0].value;
    }
    else if (radioElement[1].checked) {
        MovieGenreSection.style.display = 'block';
        clicked = radioElement[1].value;
    }
}


// get genres
async function getGeneres() {
    let genreListTV = [];
    const genresTvEndpointRequest = '/genre/tv/list'
    const requestParamsTvMovie = `?api_key=${'9886b241ded8e3bf3d964a6422abab97'}&language=en-US`
    const genresTVendpoint = getEndpoint(genresTvEndpointRequest, requestParamsTvMovie)
    const responseTv = await getResponse(genresTVendpoint);
    dataTV = await getGenreData(responseTv)

    for (let i = 0; i < dataTV.length; i++) {
        genreListTV.push(dataTV[i].name)
    }

    const genresMovieEndpointRequest = '/genre/movie/list'
    const genresMovieEndpoint = getEndpoint(genresMovieEndpointRequest, requestParamsTvMovie)
    const responseMovie = await getResponse(genresMovieEndpoint);
    dataMovie = await getGenreData(responseMovie)
    let genreListMovie = [];

    for (let i = 0; i < dataMovie.length; i++) {
        genreListMovie.push(dataMovie[i].name)
    }

    addToDropdownTV(genreListTV)
    addToDropdownMovie(genreListMovie)
}

getGeneres()


async function getShow(event) {
    let selected_genre;
    let genreID;
    let data;
    let randomDiscoverEndpoint;
    let showResponse;

    if (event === 'film') {
        data = dataMovie;
        selected_genre = MovieDropdownMenu.value;
    }

    else if (event === 'tvShow') {
        data = dataTV;
        selected_genre = tvDropdownMenu.value;
    }

    for (let i = 0; i < data.length; i++) {
        if (data[i].name === selected_genre) {
            genreID = data[i].id;
        }
    }
    if (genreID === undefined) {
        return;
    }

    if (event === 'film') {
        randomDiscoverEndpoint = getEndpoint('/discover/movie', `?api_key=${'9886b241ded8e3bf3d964a6422abab97'}&language=en-US&with_genres=${genreID}`)
        showResponse = await getResponse(randomDiscoverEndpoint);
    }

    else if (event === 'tvShow') {
        randomDiscoverEndpoint = getEndpoint('/discover/tv', `?api_key=${'9886b241ded8e3bf3d964a6422abab97'}&language=en-US&with_genres=${genreID}`)
        showResponse = await getResponse(randomDiscoverEndpoint)
    }

    try {
        if (showResponse.ok) {
            const jsonResponse = await showResponse.json();
            const shows = jsonResponse.results;
            let randomShow = Math.floor(Math.random() * shows.length)
            return shows[randomShow].id;
        }
    }
    catch(error) {
        console.log(error)
    }
}

let lastTarget = 'test';
// get random movies
async function getDetails(event) {
    // console.log(event)
    document.querySelector('.display').style.display = 'grid';
    let target;

    if (event !== lastTarget) {
        if (event === 'tvShow') {
            target = 'submit-button-dropdown-tv';
        } 
        else if (event === 'film') {
            target = 'submit-button-dropdown-movie'
        }
        else {
            target = event.target.classList[0];
        }
    }
    else {
        target = lastTarget;
    }
    lastTarget = target;
    // console.log(target);
    let detailEnpoint;

    document.querySelector('.titleText').style.fontSize = '80px';
    if (target === 'submit-button-dropdown-tv') {
        let id = await getShow('tvShow')
        if (id === undefined) {
            return;
        }
        detailEnpoint = getEndpoint(`/tv/${id}`, `?api_key=${'9886b241ded8e3bf3d964a6422abab97'}&language=en-US`)
    }
    else {
        let id = await getShow('film')
        console.log(id)
        if (id === undefined) {
            return;
        }
        detailEnpoint = getEndpoint(`/movie/${id}`, `?api_key=${'9886b241ded8e3bf3d964a6422abab97'}&language=en-US`)
    }
    try {
        let detailResponse; 

        if (target === 'submit-button-dropdown-movie') {
            detailResponse = await getResponse(detailEnpoint);
        }
        else {
            detailResponse = await getResponse(detailEnpoint);
        }
        
        if (detailResponse.ok) {
            const jsonResponse = await detailResponse.json();
            // get image 
            let posterPath;
            try {
                let image = document.querySelector('#posterImg')
                image.parentNode.removeChild(image);
            } catch {
                console.log('')
            }
            
            try {
                posterPath = jsonResponse.poster_path;
                const image = document.createElement('img');
                if (posterPath !== null) {
                    image.src = `https://image.tmdb.org/t/p/original${posterPath}`
                    image.id = 'posterImg'
                    document.querySelector('.image-container').appendChild(image);
                }
                else {
                    getDetails(lastTarget)
                    return;
                }
            }
            catch(error) {
                console.log('heeeeeee')
            }
            
            // change title 
            const titleElement = document.querySelector('.titleText')
            let title;
            if (target === 'submit-button-dropdown-tv') {
                title = jsonResponse.name;
            }

            else if (target === 'submit-button-dropdown-movie'){
                title = jsonResponse.original_title;
            }

            if (title.length > 35) {
                titleElement.style.fontSize = '60px';
            }


            titleElement.innerHTML = title;

            // change description
            const descriptionElement = document.querySelector('.descriptionText')
            const description = jsonResponse.overview;

            if (description.length > 75) {
                descriptionElement.style.fontSize = '25px';
            }
            
            if (description.length > 1200) {
                descriptionElement.style.fontSize = '17px';
            }

            if (description !== '') { 
                descriptionElement.innerHTML = description; 
            }
            else {
                getDetails(lastTarget)
                return;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
}


function likeDislike() {
    getDetails(clicked)
}


export {tvDropdownMenu}




