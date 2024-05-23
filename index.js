// Define an array to store events
let events = [];

// Variables to store event input fields and reminder list
let eventDateInput = document.getElementById("eventDate");
let eventTitleInput = document.getElementById("eventTitle");
let eventDescriptionInput = document.getElementById("eventDescription");
let eventPriorityInput = document.getElementById("eventPriority");
let reminderList = document.getElementById("reminderList");

const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.getElementById('body');
const fullBody = document.getElementById('full-body');

darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    fullBody.classList.toggle('dark-mode');
});

// Counter to generate unique event IDs
let eventIdCounter = 1;

// Load events from local storage if available
if (localStorage.getItem("events")) {
    events = JSON.parse(localStorage.getItem("events"));
    eventIdCounter = events.length ? Math.max(events.map(e => e.id)) + 1 : 1; // Ensure unique IDs
}

// Function to save events to local storage
function saveEventsToLocalStorage() {
    localStorage.setItem("events", JSON.stringify(events));
}

// Function to add events
function addEvent() {
    let selectedDate = new Date(eventDateInput.value);
    let currentDate = new Date();

    // Check if the selected date is in the past
    if (selectedDate < currentDate) {
        alert('You cannot add events for past dates.');
        return;
    }

    let title = eventTitleInput.value;
    let description = eventDescriptionInput.value;
    let priority = eventPriorityInput.value;

    // Check if all fields are filled
    if (title.trim() === '' || description.trim() === '' || priority.trim() === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Create a unique event ID
    let eventId = eventIdCounter++;
    
    // Add the new event to the events array
    events.push({
        id: eventId,
        date: selectedDate.toISOString(),
        title: title,
        description: description,
        priority: priority
    });

    // Save events to local storage after adding a new event
    saveEventsToLocalStorage();
    showCalendar(currentMonth, currentYear);
    displayReminders();

    // Clear the input fields after adding the event
    eventDateInput.value = "";
    eventTitleInput.value = "";
    eventDescriptionInput.value = "";
    eventPriorityInput.value = "Medium"; // Reset to default
}

// Function to delete an event by ID
function deleteEvent(eventId) {
    // Find the index of the event with the given ID
    let eventIndex = events.findIndex(event => event.id === eventId);

    if (eventIndex !== -1) {
        // Remove the event from the events array
        events.splice(eventIndex, 1);
        showCalendar(currentMonth, currentYear);
        displayReminders();

        // Save events to local storage after deleting an event
        saveEventsToLocalStorage();
        alert('Task will be Deleted');
    }
}

// Function to display reminders
function displayReminders() {
    reminderList.innerHTML = "";
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let eventDate = new Date(event.date);
        if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
            let listItem = document.createElement("li");
            listItem.innerHTML = `
                <strong>${event.title}</strong> - ${event.description} on ${eventDate.toLocaleDateString()} <em>(${event.priority} Priority)</em>
                <div class="button-group">
                    <button class="edit-event" onclick="editEvent(${event.id})">Edit Task</button>
                    <button class="complete-event" onclick="markAsComplete(${event.id})">Mark as Complete</button>
                    <button class="delete-event" onclick="deleteEvent(${event.id})">Delete</button>
                </div>
            `;

            if (event.priority === 'Low') {
                listItem.className = 'on-task1';
            } else if (event.priority === 'Medium') {
                listItem.className = 'on-task2';
            } else if (event.priority === 'High') {
                listItem.className = 'on-task3';
            }

            reminderList.appendChild(listItem);
        }
    }
}

// Function to edit an event by ID
function editEvent(eventId) {
    let event = events.find(event => event.id === eventId);
    if (event) {
        eventDateInput.value = new Date(event.date).toISOString().slice(0, 10);
        eventTitleInput.value = event.title;
        eventDescriptionInput.value = event.description;
        eventPriorityInput.value = event.priority;
        deleteEvent(eventId); // Remove the old event before editing
    }
}

// Function to mark an event as complete by ID
function markAsComplete(eventId) {
    let event = events.find(event => event.id === eventId);
    if (event) {
        event.priority = "Completed";
        saveEventsToLocalStorage();
        displayReminders();
        alert('Task will be marked as completed');
        deleteEvent(eventId);
        showCalendar(currentMonth, currentYear);
    }
}


// Call the function to save events to local storage initially
saveEventsToLocalStorage();

// Function to generate a range of years for the year select input
function generate_year_range(start, end) {
    let years = "";
    for (let year = start; year <= end; year++) {
        years += "<option value='" + year + "'>" + year + "</option>";
    }
    return years;
}

// Initialize date-related variables
today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();
selectYear = document.getElementById("year");
selectMonth = document.getElementById("month");

createYear = generate_year_range(2024, 2050);

document.getElementById("year").innerHTML = createYear;

let calendar = document.getElementById("calendar");

let months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];
let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

$dataHead = "<tr>";
for (dhead in days) {
    $dataHead += "<th data-days='" + days[dhead] + "'>" + days[dhead] + "</th>";
}
$dataHead += "</tr>";

document.getElementById("thead-month").innerHTML = $dataHead;

monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);

// Function to navigate to the next month
function next() {
    currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

// Function to navigate to the previous month
function previous() {
    currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    showCalendar(currentMonth, currentYear);
}

// Function to jump to a specific month and year
function jump() {
    currentYear = parseInt(selectYear.value);
    currentMonth = parseInt(selectMonth.value);
    showCalendar(currentMonth, currentYear);
}

// Function to display the calendar
function showCalendar(month, year) {
    let firstDay = new Date(year, month, 1).getDay();
    tbl = document.getElementById("calendar-body");
    tbl.innerHTML = "";
    monthAndYear.innerHTML = months[month] + " " + year;
    selectYear.value = year;
    selectMonth.value = month;

    let date = 1;
    for (let i = 0; i < 6; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                cell = document.createElement("td");
                cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            } else if (date > daysInMonth(month, year)) {
                break;
            } else {
                cell = document.createElement("td");
                cell.setAttribute("data-date", date);
                cell.setAttribute("data-month", month + 1);
                cell.setAttribute("data-year", year);
                cell.setAttribute("data-month_name", months[month]);
                cell.className = "date-picker";
                cell.innerHTML = "<span>" + date + "</span>";

                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    cell.className = "date-picker selected";
                }

                // Check if there are events on this date
                if (hasEventOnDate(date, month, year)) {
                    cell.classList.add("event-marker");
                    cell.appendChild(createEventTooltip(date, month, year));
                }

                row.appendChild(cell);
                date++;
            }
        }
        tbl.appendChild(row);
    }
}

// Function to check if there are events on a specific date
function hasEventOnDate(date, month, year) {
    let eventDate = new Date(year, month, date);
    return events.some(event => {
        let eventDate = new Date(event.date);
        return eventDate.getDate() === date && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
}

// Function to create an event tooltip for a specific date
function createEventTooltip(date, month, year) {
    let tooltip = document.createElement("div");
    tooltip.className = "event-tooltip";
    let eventDate = new Date(year, month, date);
    let eventList = events.filter(event => {
        let eventDate = new Date(event.date);
        return eventDate.getDate() === date && eventDate.getMonth() === month && eventDate.getFullYear() === year;
    });
    eventList.forEach(event => {
        let eventElement = document.createElement("div");
        eventElement.className = "event-item";
        eventElement.innerHTML = `<strong>${event.title}</strong> - ${event.description} <em>(${event.priority} Priority)</em>`;
        tooltip.appendChild(eventElement);
    });
    return tooltip;
}

// Function to get the number of days in a month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

// Initial display of reminders
displayReminders();
document.getElementById('dark-mode-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});
