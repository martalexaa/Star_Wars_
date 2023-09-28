let starWarsfilmRepo = (function () {

    const apiUrl = "https://swapi.dev/api/films/?format=json";
    const filmList = [];

    // Function to show loading message
    function showLoading() {
        const spinnerElements = document.getElementsByClassName('lds-spinner');
        for (let i = 0; i < spinnerElements.length; i++) {
            spinnerElements[i].style.visibility = 'visible';
        }
    }

    // Function to hide loading message
    function hideLoading() {
        const spinnerElements = document.getElementsByClassName('lds-spinner');
        for (let i = 0; i < spinnerElements.length; i++) {
            spinnerElements[i].style.visibility = 'hidden';
        }
    }

    // Fetching the film data from URL
    function loadList() {
        showLoading()
        return fetch(apiUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                json.results.forEach(function (item) {
                    let film = {
                        title: item.title,
                        episode: item.episode_id,
                        opening: item.opening_crawl,
                        director: item.director,
                        producer: item.producer,
                        planets: item.planets
                    };
                    filmList.push(film);
                    hideLoading()
                });
            })
            .catch(function (e) {
                console.error(e);
                hideLoading()
            });
    }

    // Return the list of films
    function getAll() {
        return filmList;
    }

    // Add film titles to the list
    function addListItem(film) {
        let ulList = document.querySelector('#filmList');
        let li = document.createElement('li');
        li.textContent = film.title;
        li.classList.add('film-title');
        ulList.appendChild(li);

        li.addEventListener("click", function () {
            displayEpisodeData(film);
        });
    }

    // Fetch information about the planets
    function fetchPlanetInfo(planetURL) {
        return fetch(planetURL)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(function (error) {
                console.error('Fetch error:', error);
            });
    }

    // Display episode information in a div
    function displayEpisodeData(film) {
        showLoading();
        let planets = film.planets.map(function (planetURL) {
            return fetchPlanetInfo(planetURL).then(function (planetData) {
                return planetData.name;
            });
        });

        Promise.all(planets).then(function (planetNames) {
            const planetList = planetNames.join(", ");
            document.getElementById("card").innerHTML = `<h2>${film.title}</h2>
        <h3>Episode: ${film.episode}</h3>
        <h3>Director: ${film.director}</h3>
        <p>${film.opening}</p>
        <p>Planets: ${planetList}</p>`;
            hideLoading();
        });
    }

    // Sort the movies by the episode number
    function sortByEpisode() {
        const sortedFilmList = [...filmList].sort((a, b) => {
            return a.episode - b.episode;
        });
        return sortedFilmList;
    }

    return {
        loadList,
        getAll,
        addListItem,
        sortByEpisode
    }

})();


document.addEventListener("DOMContentLoaded", function () {
    starWarsfilmRepo.loadList().then(function () {
        const sortedFilmList = starWarsfilmRepo.sortByEpisode(); // Sort the list first
        sortedFilmList.forEach(function (film) {
            starWarsfilmRepo.addListItem(film);  // Add each movie title to the list, sorted by episode number
        });
    });
});
