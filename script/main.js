const API_KEY = 'aqtAqnt5YFVED7N4wU6ykQdlffCqP4tF';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/';

// Fetch events from Ticketmaster API
async function fetchEvents(city, category) {
    try {
        const url = `${BASE_URL}events.json?apikey=${API_KEY}&countryCode=TZ&city=${encodeURIComponent(city)}&classificationName=${encodeURIComponent(category)}&size=20`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch events from Ticketmaster');
        }
        const data = await response.json();
        return data._embedded?.events || [];
    } catch (error) {
        console.error('Fetch Error:', error);
        document.getElementById('eventList').innerHTML = `<p>${error.message}</p>`;
        return [];
    }
}

// Display events
function displayEvents(events) {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';
    if (events.length === 0) {
        eventList.innerHTML = '<p>No events found for this city and category in Tanzania.</p>';
        return;
    }
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <h3>${event.name}</h3>
            <p>Date: ${event.dates.start.localDate}</p>
            <p>Venue: ${event._embedded?.venues?.[0]?.name || 'Not specified'}</p>
            <p>Tickets: <a href="${event.url}" target="_blank">Buy Now</a></p>
            <button class="save-btn" onclick="saveEvent('${event.id}', '${event.name}', '${event.dates.start.localDate}', '${event._embedded?.venues?.[0]?.name || 'Not specified'}', '${event.url}')">Save</button>
        `;
        eventList.appendChild(card);
    });
}

// Save event to localStorage
function saveEvent(id, name, date, venue, url) {
    const savedEvents = JSON.parse(localStorage.getItem('savedEvents') || '[]');
    if (!savedEvents.some(e => e.id === id)) {
        savedEvents.push({ id, name, date, venue, ticketStatus: url });
        localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
        displaySavedEvents();
    }
}

// Display saved events
function displaySavedEvents() {
    const savedEvents = JSON.parse(localStorage.getItem('savedEvents') || '[]');
    const savedList = document.getElementById('savedEventsList');
    savedList.innerHTML = '';
    savedEvents.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <h3>${event.name}</h3>
            <p>Date: ${event.date}</p>
            <p>Venue: ${event.venue}</p>
            <p>Tickets: <a href="${event.ticketStatus}" target="_blank">Buy Now</a></p>
        `;
        savedList.appendChild(card);
    });
}

// Search button event listener
document.getElementById('searchButton').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value.trim();
    const category = document.getElementById('categorySelect').value;
    if (!city) {
        document.getElementById('eventList').innerHTML = '<p>Please enter a city.</p>';
        return;
    }
    const events = await fetchEvents(city, category);
    displayEvents(events);
});

// Load saved events on page load
window.onload = displaySavedEvents;