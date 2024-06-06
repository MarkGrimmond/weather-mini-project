let cities = [
    { name: "New York, NY", latitude: 40.7128, longitude: -74.0060 },
    { name: "Los Angeles, CA", latitude: 34.0522, longitude: -118.2437 },
    { name: "Chicago, IL", latitude: 41.8781, longitude: -87.6298 },
    { name: "Houston, TX", latitude: 29.7604, longitude: -95.3698 },
    { name: "Phoenix, AZ", latitude: 33.4484, longitude: -112.0740 },
    { name: "Philadelphia, PA", latitude: 39.9526, longitude: -75.1652 },
    { name: "San Antonio, TX", latitude: 29.4241, longitude: -98.4936 },
    { name: "San Diego, CA", latitude: 32.7157, longitude: -117.1611 },
    { name: "Dallas, TX", latitude: 32.7767, longitude: -96.7970 },
    { name: "San Jose, CA", latitude: 37.3382, longitude: -121.8863 }
];

let dropdown = document.getElementById('city-dropdown');

cities.forEach(city => {
    let option = document.createElement('option');
    option.value = city.name;
    option.textContent = city.name;
    dropdown.appendChild(option);
});

let map = L.map('map').setView([39.8283, -98.5795], 4); // Default center of the US
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

let marker;

function displayCityInfo() {
    let selectedCity = dropdown.value;
    let cityInfo = cities.find(city => city.name === selectedCity);

    if (cityInfo) {
        document.getElementById('city-name').textContent = cityInfo.name;
        document.getElementById('city-latitude').textContent = cityInfo.latitude;
        document.getElementById('city-longitude').textContent = cityInfo.longitude;

        fetchWeatherData(cityInfo.latitude, cityInfo.longitude).then(weatherData => {
            document.getElementById('city-temperature').textContent = `${weatherData.temperature} °C`;
            document.getElementById('city-wind-speed').textContent = `${weatherData.wind_speed} km/h`;
            document.getElementById('city-wind-direction').textContent = `${weatherData.wind_dir}`;
            document.getElementById('city-table').style.display = 'table';
        });

        if (marker) {
            map.removeLayer(marker);
        }

        marker = L.marker([cityInfo.latitude, cityInfo.longitude]).addTo(map);
        map.setView([cityInfo.latitude, cityInfo.longitude], 10);
    } else {
        document.getElementById('city-table').style.display = 'none';

        if (marker) {
            map.removeLayer(marker);
        }

        map.setView([39.8283, -98.5795], 4); // Reset to default center
    }
}

async function fetchWeatherData(lat, lon) {
    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your Weatherstack API key
    const response = await fetch(`http://api.weatherstack.com/current?access_key=${apiKey}&query=${lat},${lon}`);
    const data = await response.json();
    return {
        temperature: data.current.temperature,
        wind_speed: data.current.wind_speed,
        wind_dir: data.current.wind_dir
    };
}
