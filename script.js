const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

search.addEventListener('click', () => {
    const APIKey = '0bd3e06a3350e488de0972f797d18282';
    const city = document.querySelector('.search-box input').value.trim();

    if (city === '') return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            console.log("API Response:", json); // Debug log
            
            if (json.cod === '404') {
                container.style.height = '600px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active');
                return;
            }

            error404.classList.remove('active');
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            // Improved weather image selection
            const weatherMain = json.weather[0].main.toLowerCase();
            const weatherDesc = json.weather[0].description.toLowerCase();

            if (weatherMain.includes('clear')) {
                image.src = 'images/clear.png';
            } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
                image.src = 'images/rain.png';
            } else if (weatherMain.includes('snow')) {
                image.src = 'images/snow.png';
            } else if (weatherMain.includes('mist') || weatherMain.includes('haze') || 
                       weatherMain.includes('fog') || weatherMain.includes('smoke')) {
                image.src = 'images/mist.png';
            } else if (weatherMain.includes('cloud') || 
                       weatherDesc.includes('overcast') || 
                       weatherDesc.includes('scattered') || 
                       weatherDesc.includes('broken')) {
                image.src = 'images/cloud.png';
            } else {
                image.src = 'images/cloudy.png';
            }

            // Add error handling for images
            image.onerror = function() {
                console.error("Failed to load image:", this.src);
                this.src = 'images/cloudy.png';
                this.onerror = null;
            };

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = json.weather[0].description;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)} km/h`;

            container.style.height = '600px';
        })
        .catch(error => {
            console.error("Fetch error:", error);
            alert("Failed to fetch weather data. Please check your connection.");
        });
});

// Allow search on Enter key
document.querySelector('.search-box input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        search.click();
    }
});