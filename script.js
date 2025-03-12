// Function to fetch weather data from the Open-Meteo API
function fetchWeatherData(latitude, longitude) {
  // Construct the API URL with provided coordinates
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_hours,wind_speed_10m_max,rain_sum&current_weather=true&timezone=auto`;
  
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Weather Data:', data);
      // Update the chart using hourly data
      updateWeatherChart(data.hourly.temperature_2m, data.hourly.time);
      // Display some of the API data on the page
      displayWeatherData(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
      const container = document.getElementById("weatherData");
      container.innerHTML = `<p>Error fetching weather data: ${error.message}</p>`;
    });
}

// Function to update the Chart.js chart with new temperature data and labels
function updateWeatherChart(temperatures, labels) {
  if (window.weatherChart) {
    weatherChart.data.labels = labels;
    weatherChart.data.datasets[0].data = temperatures;
    weatherChart.update();
  }
}

// Function to display current weather data in a dedicated container
function displayWeatherData(data) {
  const container = document.getElementById("weatherData");
  if (data.current_weather) {
    container.innerHTML = `
      <h2>Current Weather:</h2>
      <p><strong>Temperature:</strong> ${data.current_weather.temperature_2m}°C</p>
      <p><strong>Wind Speed:</strong> ${data.current_weather.wind_speed_10m} km/h</p>
      <p><strong>Daytime:</strong> ${data.current_weather.is_day ? "Yes" : "No"}</p>
    `;
  } else {
    container.innerHTML = `<p>No current weather data available.</p>`;
  }
}

// DOMContentLoaded ensures the DOM is ready before we run the code
document.addEventListener("DOMContentLoaded", function () {
  // Create the weather chart with dummy initial data
  const ctx = document.getElementById('weatherChart').getContext('2d');
  window.weatherChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Loading...'],
      datasets: [{
        label: 'Temperature (°C)',
        data: [],
        borderColor: '#0077cc',
        backgroundColor: 'rgba(0,119,204,0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
  
  // Example: Use fixed coordinates (New York City) for fetching weather data.
  // Replace with dynamic coordinates or user input as needed.
  const latitude = 40.7128;
  const longitude = -74.0060;
  fetchWeatherData(latitude, longitude);
});

// Navigation: Show the corresponding page when a nav link is clicked.
const navLinks = document.querySelectorAll('nav ul li a');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetPage = e.target.getAttribute('data-page');
    pages.forEach(page => {
      if (page.id === targetPage) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });
  });
});

// (Additional JavaScript for other pages or features can be added here)
