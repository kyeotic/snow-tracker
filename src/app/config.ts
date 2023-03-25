export default {
  timberline: {
    conditionsUrl: 'http://www.timberlinelodge.com/conditions',
    noaaUrl:
      'https://forecast.weather.gov/MapClick.php?lat=45.33284041773058&lon=-121.70877456665039&site=all',
  },
  skiBowl: {
    conditionsUrl: 'http://www.skibowl.com/winter/mt-hood-weather-conditions',
    noaaUrl: 'https://forecast.weather.gov/MapClick.php?lat=45.302189&lon=-121.750504&site=all',
  },
  meadows: {
    conditionsUrl: 'https://www.skihood.com/the-mountain/conditions',
    noaaUrl: 'https://forecast.weather.gov/MapClick.php?lat=45.3282&lon=-121.6623',
  },
} as const
