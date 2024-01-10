
const searchInput = document.getElementById('searchInput');
    const selectedCities = document.getElementById('selectedCities');
    const searchButton = document.getElementById('searchButton');

    let lastRequestTime = 0;
    const RATE_LIMIT_INTERVAL = 1000; // 1 request per second
    const uniqueCities = new Set();

    searchInput.addEventListener('input', async () => {
      await searchCities();
    });

    searchButton.addEventListener('click', async () => {
      await searchCities();
    });

    async function searchCities() {
      const searchInputValue = searchInput.value.trim();
      if (!searchInputValue) {
        // Clear the dropdown when the input is empty
        selectedCities.innerHTML = '';
        return;
      }

      const currentTime = Date.now();
      const timeSinceLastRequest = currentTime - lastRequestTime;

      if (timeSinceLastRequest < RATE_LIMIT_INTERVAL) {
        console.log(`Rate limit exceeded. Please wait before making the next request.`);
        return;
      }

      const url = `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${encodeURIComponent(searchInputValue)}&minPopulation=1000000&limit=10`;

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '727bf2a82fmshefe63c31b6e70d3p1bee3djsnb96f9b215838',
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (result.data && result.data.length > 0) {
          selectedCities.innerHTML = ''; // Clear previous results
          uniqueCities.clear();

          result.data.forEach(city => {
            const cityName = `${city.city}, ${city.country?.countryCode || ''}`;
            
            if (!uniqueCities.has(cityName)) {
              uniqueCities.add(cityName);

              const listItem = document.createElement('li');
              listItem.textContent = cityName;

              listItem.addEventListener('click', () => {
                searchInput.value = cityName;
                selectedCities.innerHTML = ''; // Clear the dropdown after selection
              });

              selectedCities.appendChild(listItem);
            }
          });

          // Show the dropdown
          selectedCities.style.display = 'block';
        } else {
          selectedCities.innerHTML = `<li>No results found for ${searchInputValue}</li>`;
        }

        lastRequestTime = Date.now();
      } catch (error) {
        console.error(error);
      }
    }

    // Hide the dropdown when clicking outside of it
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.dropdown-container')) {
        selectedCities.style.display = 'none';
      }
    });

// Build URL to query sunrisesunset API 
var lat = '';
var lng = '';
var sunriseSunsetURL = 'https://api.sunrisesunset.io/json?lat=38.907192&lng=-77.036873'

// Create fetch call for the search query
fetch(sunriseSunsetURL)
.then(function(response) {
    return response.json();
})
.then(function(data) {
    // console.log(data);

    // Assign data from the object to variables
    var sunrise = data.results.sunrise;
    console.log('Sunrise: ' + sunrise);

    var sunset = data.results.sunset;
    console.log('Sunset: ' + sunset);
    
    var goldenHour = data.results.golden_hour;
    console.log('Golden Hour: ' + goldenHour);

    var timezone = data.results.timezone;
    console.log('Timezone: ' + timezone);
});
