require("dotenv").config();
var axios = require('axios');
var Spotify = require('node-spotify-api');
var keys = require("./keys");
var fs = require('fs');
var inquirer = require("inquirer");
var spotify = new Spotify(keys.spotify);


inquirer
    .prompt([
        {
            type: "list",
            message: "What info would you like to view?",
            choices: ["Song", "Movie", "Random"],
            name: "answers"
        } /* Pass your questions in here */
    ])
    .then(data => {
        // Use user feedback for... whatever!!
        var userResponse = data.answers;
        if (userResponse === "Random") {
            fs.readFile('./random.txt', 'utf8', function (err, data) {
                if (err) return console.error(err);
        
                var randtxt = data.split(',');
        
                var answer = randtxt[1];
        
                if (randtxt[0] === 'movie-this') {
        
                    axios.get('http://www.omdbapi.com/?t=' + answer + '&apikey=1de8dab0')
                        .then(function (OMDBres) {
                            var movie = OMDBres.data;
                            console.log(`${movie.Title}\n${movie.Released}\n${movie.imdbRating}\n${movie.Country}\n${movie.Language}\n${movie.Plot}\n${movie.Actors}\n`);
                        })
                        .catch(function (error) {
                            if (error.response) {
                                // The request was made and the server responded with a status code
                                // that falls out of the range of 2xx
                                console.log("---------------Data---------------");
                                console.log(error.response.data);
                                console.log("---------------Status---------------");
                                console.log(error.response.status);
                                console.log("---------------Status---------------");
                                console.log(error.response.headers);
                            } else if (error.request) {
                                // The request was made but no response was received
                                // `error.request` is an object that comes back with details pertaining to the error that occurred.
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log("Error", error.message);
                            }
                            console.log(error.config);
        
                        })
                } else {
        
                    spotify.search({ type: 'track', query: answer, limit: 1 })
                        .then(function (spotifyRes) {
                            var song = spotifyRes.tracks.items[0];
        
                            console.log(`Artist: ${song.album.artists[0].name}\nSong: ${song.name}\nOpen in Spotify: ${song.album.external_urls.spotify}\nAlbum: ${song.album.name}\n`);
                        })
                        .catch(function (err) {
                            if (err) throw err;
                        });
                }
            })
        
        } else if (userResponse === "Movie") {
            inquirer.prompt([{
                message: "Enter a movie.",
                name: "answers"
            }])
                .then(function (answers2) {
                    var movie = answers2.answers;
                    if (movie === "") {
                        movie = "Air Bud";
                    }
                    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

                    axios.get(url).then(function (response) {
                        var movie1 = response.data;

                        // console.log(movie1.Title, movie1.Year, movie1.imdbRating, movie1.Ratings[1]);
                        console.log("Title: " + movie1.Title);
                        console.log("Year it released: " + movie1.Year);
                        console.log("imdb Rating: " + movie1.imdbRating);
                        console.log("Rotten Tomatoes Rating: " + movie1.Ratings[1].Value);
                        console.log("Produced in: " + movie1.Country);
                        console.log("Plot summary: " + movie1.Plot);
                        console.log("Language: " + movie1.Language);
                        console.log("Actors: " + movie1.Actors);

                    })
                })

        } else if (userResponse === "Song") {
            inquirer.prompt([{
                message: "Enter a song.",
                name: "answers"
            }])
                .then(function (answers) {
                    var song = answers.answers;
                    if (song === "") {
                        song = "Gangnam Style";
                    }

                    spotify
                        .search({ type: 'track', query: song, limit: 1 })
                        .then(function (response) {
                            var track = response.tracks.items[0];
                            var track2 = track.name;
                            var track3 = track.external_urls.spotify;
                            var track4 = track.album.album_type;
                            console.log("Artist: " + track.artists[0].name);
                            console.log("Song Name: " + track2);
                            console.log("Link to the song: " + track3);
                            console.log("Album Name: " + track4);
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                })
        } else {

        }
    });

