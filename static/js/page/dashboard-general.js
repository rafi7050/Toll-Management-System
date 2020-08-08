"use strict";

var statistics_chart = document.getElementById("myChart").getContext('2d');

var myChart = new Chart(statistics_chart, {
  type: 'line',
  data: {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [{
      label: 'Statistics',
      data: [640, 387, 530, 302, 430, 270, 488],
      borderWidth: 5,
      borderColor: '#009FE2',
      backgroundColor: 'transparent',
      pointBackgroundColor: '#fff',
      pointBorderColor: '#009FE2',
      pointRadius: 4
    }]
  },
  options: {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          stepSize: 150
        }
      }],
      xAxes: [{
        gridLines: {
          color: '#fbfbfb',
          lineWidth: 2
        }
      }]
    },
  }
});

// weather
getWeather();
setInterval(getWeather, 600000);

function getWeather() {
  $.simpleWeather({
  location: 'Bogor, Indonesia',
  unit: 'c',
  success: function(weather) {
    var html = '';
    html += '<div class="weather">';
    html += '<div class="weather-icon text-primary"><span class="wi wi-yahoo-' + weather.code + '"></span></div>';
    html += '<div class="weather-desc">';
    html += '<h4>' + weather.temp + '&deg;' + weather.units.temp + '</h4>';
    html += '<div class="weather-text">' + weather.currently + '</div>';
    html += '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
    html += '<li> <i class="wi wi-strong-wind"></i> ' + weather.wind.speed+' '+weather.units.speed + '</li></ul>';
    html += '</div>';
    html += '</div>';

    $("#myWeather").html(html);
  },
  error: function(error) {
    $("#myWeather").html('<div class="alert alert-danger">'+error+'</div>');
  }
  });
}
