// Nav: add border on scroll + mobile toggle
const navbar = document.getElementById('navbar');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinkItems = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinkItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '0px 0px -80% 0px' });

sections.forEach(s => activeObserver.observe(s));

// Fade-in sections on scroll
const observer = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('section, .project-card, .skill-group').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Weather / time widget
(function initWeatherWidget() {
  const widget   = document.getElementById('weather-widget');
  const timeEl   = widget.querySelector('.weather-time');
  const iconEl   = widget.querySelector('.weather-icon');
  const tempEl   = widget.querySelector('.weather-temp');
  const descEl   = widget.querySelector('.weather-desc');
  const cityEl   = widget.querySelector('.weather-city');

  // Live clock
  function tick() {
    timeEl.textContent = new Date().toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit'
    });
  }
  tick();
  setInterval(tick, 1000);

  // WMO weather code → emoji + label
  function decodeWeather(code) {
    if (code === 0)   return { emoji: '☀️',  desc: 'Clear' };
    if (code <= 3)    return { emoji: '⛅',  desc: 'Partly cloudy' };
    if (code <= 48)   return { emoji: '🌫️', desc: 'Foggy' };
    if (code <= 55)   return { emoji: '🌦️', desc: 'Drizzle' };
    if (code <= 65)   return { emoji: '🌧️', desc: 'Rainy' };
    if (code <= 77)   return { emoji: '🌨️', desc: 'Snowy' };
    if (code <= 82)   return { emoji: '🌦️', desc: 'Showers' };
    if (code <= 99)   return { emoji: '⛈️',  desc: 'Thunderstorm' };
    return { emoji: '🌡️', desc: 'Unknown' };
  }

  const useFahrenheit = navigator.language === 'en-US';
  const tempUnit   = useFahrenheit ? 'fahrenheit' : 'celsius';
  const tempSymbol = useFahrenheit ? '°F' : '°C';

  if (!navigator.geolocation) {
    descEl.textContent = 'Geolocation unavailable';
    return;
  }

  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    const { latitude: lat, longitude: lon } = coords;
    try {
      const [weatherRes, geoRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=${tempUnit}`),
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
      ]);
      const { current_weather } = await weatherRes.json();
      const geo = await geoRes.json();

      const { emoji, desc } = decodeWeather(current_weather.weathercode);
      const city = geo.address?.city || geo.address?.town || geo.address?.village || '';

      iconEl.textContent = emoji;
      tempEl.textContent = `${Math.round(current_weather.temperature)}${tempSymbol}`;
      descEl.textContent = desc;
      cityEl.textContent = city;
    } catch {
      descEl.textContent = 'Weather unavailable';
    }
  }, () => {
    iconEl.textContent = '📍';
    descEl.textContent = 'Location denied';
  });
}());
