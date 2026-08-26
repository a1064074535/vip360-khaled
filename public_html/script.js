// Script for fetching jokes from JokeAPI

async function fetchJoke() {
    try {
        const response = await fetch('https://v2.jokeapi.dev/joke/Any');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const jokeData = await response.json();
        if (jokeData.type === 'single') {
            console.log(jokeData.joke);
        } else {
            console.log(`${jokeData.setup} - ${jokeData.delivery}`);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Example usage
fetchJoke();