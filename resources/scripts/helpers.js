function getEndpoint(genresEndpointRequest, requestParams) {
    
    const tmdbBaseUrl = 'https://api.themoviedb.org/3'
    const apiKey = '9886b241ded8e3bf3d964a6422abab97'

    const genresTVendpoint = tmdbBaseUrl+genresEndpointRequest+requestParams;
    return genresTVendpoint;

}


async function getResponse(genreEndpoint) {
    const response = await fetch(genreEndpoint);
    return response;
        
}


async function getGenreData(response) {
    try {
        if (response.ok) {
            const jsonResponse = await response.json();
            const genreObjects = await jsonResponse.genres;
            return genreObjects;
        }
    }
    catch(error) {
        console.log(error)
    }
}

async function getMovieData(response) {
    try {
        if (response.ok) {
            const jsonResponse = await response.json();
            const movies = jsonResponse.results;
            return movies
        }
    }
    catch(error) {
        console.log(error)
    }
}



function addToDropdownTV(dataTV) {
    let newOption;
    let optionText;
    let dropDownList;
    try {
        for (let i = 0; i < dataTV.length; i++) {
            newOption = document.createElement('option');
            optionText = document.createTextNode(dataTV[i]);
            dropDownList = document.querySelector('.genretv-dropdown');
            
            newOption.appendChild(optionText);
            newOption.setAttribute('value', dataTV[i]);
            dropDownList.appendChild(newOption);
        }
    
    } catch(error) {
        console.log(error)
    }
}

function addToDropdownMovie(dataMovie) {
    let newOption;
    let optionText;
    let dropDownList;
    try {
        //.replace(/\s/g, "")
        for (let i = 0; i < dataMovie.length; i++) {
            newOption = document.createElement('option');
            optionText = document.createTextNode(dataMovie[i]);
            dropDownList = document.querySelector('.genreMovie-dropdown');
            
            newOption.appendChild(optionText);
            newOption.setAttribute('value', dataMovie[i]);
            dropDownList.appendChild(newOption);
        }
    
    } catch(error) {
        console.log(error)
    }
}
 

export { getEndpoint, getGenreData, getResponse, addToDropdownTV, addToDropdownMovie, getMovieData};