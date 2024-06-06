"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Display logged in username
const usernameUser = sessionStorage.getItem("username");
const usernameUserP = document.querySelector(".userUsername");
if (usernameUserP) {
    usernameUserP.textContent = usernameUser;
}
// Divs for user dashboard
const toursUserDiv = document.querySelector(".toursUserDiv");
const hotelsUserDiv = document.querySelector(".hotelsUserDiv");
const bookingsUserDiv = document.querySelector('.bookingsUserDiv');
// Buttons to open specific divs
const toursUserOpen = document.getElementById("toursUser");
const hotelsUserOpen = document.getElementById("hotelsUser");
const bookingsUserOpen = document.getElementById("bookingsUser");
// Logout Button
const logoutUser = document.getElementById("logoutUser");
class ManipulateUserDashboard {
    eventListeners() {
        // Tours
        toursUserOpen.addEventListener('click', () => this.openToursDiv());
        // Hotels
        hotelsUserOpen.addEventListener('click', () => this.openHotelsDiv());
        // Bookings
        bookingsUserOpen.addEventListener('click', () => this.openBookingsDiv());
        // Logout
        logoutUser.addEventListener('click', () => {
            sessionStorage.removeItem("username");
            window.location.href = "index.html";
        });
    }
    openToursDiv() {
        toursUserDiv.style.display = "flex";
        hotelsUserDiv.style.display = "none";
        bookingsUserDiv.style.display = "none";
    }
    openHotelsDiv() {
        hotelsUserDiv.style.display = "flex";
        toursUserDiv.style.display = "none";
        bookingsUserDiv.style.display = "none";
    }
    openBookingsDiv() {
        bookingsUserDiv.style.display = "flex";
        hotelsUserDiv.style.display = "none";
        toursUserDiv.style.display = "none";
    }
}
let manipulateUserDashboard = new ManipulateUserDashboard();
manipulateUserDashboard.eventListeners();
let baseURLHotelsUsers = "http://localhost:3000/hotels";
class HotelsUsers {
    getHotels() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLHotelsUsers);
                const hotels = yield response.json();
                console.log(hotels);
                return hotels;
            }
            catch (error) {
                console.error('Failed to fetch hotels', error);
                return [];
            }
        });
    }
    displayHotels() {
        return __awaiter(this, void 0, void 0, function* () {
            const hotels = yield this.getHotels();
            const hotelsDisplay = document.querySelector(".hotels-all-display");
            let html = '';
            if (!hotels.length) {
                html = `<p>No Hotels Found</p>`;
            }
            else {
                hotels.forEach(hotel => {
                    html += `
                        <div class="hotel-all-container">
                            <div class="image-hotels"><img src="${hotel.image}" alt="hotel"></div>
                            <div class="each-hotel-details">
                                <h4>${hotel.name}</h4>
                                <p class="rating">${hotel.rating}</p>
                                <div class="last-thing-hotel">
                                    <p>${hotel.location}</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
            hotelsDisplay.innerHTML = html;
        });
    }
}
let displayHotelsUser = new HotelsUsers();
displayHotelsUser.displayHotels();
// Tours
let baseURLToursUsers = "http://localhost:3000/tours";
// Form For Booking
const makeBooking = document.querySelector('.make-booking');
const closeBookingFormButton = document.getElementById('closeBookTourButton');
class ToursUsers {
    getTours() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLToursUsers);
                const tours = yield response.json();
                console.log(tours);
                return tours;
            }
            catch (error) {
                console.error('Failed to fetch tours', error);
                return [];
            }
        });
    }
    displayTours() {
        return __awaiter(this, void 0, void 0, function* () {
            const tours = yield this.getTours();
            const toursDisplay = document.querySelector(".tours-display-all");
            toursDisplay.innerHTML = '';
            if (!tours.length) {
                const notFound = document.createElement('p');
                notFound.textContent = 'No Tours Found';
                toursDisplay.appendChild(notFound);
            }
            else {
                tours.forEach(tour => {
                    console.log(tours);
                    const eachTourContainer = document.createElement('div');
                    eachTourContainer.className = 'tour-all-container';
                    const imageTourDiv = document.createElement('div');
                    imageTourDiv.className = 'image-tours';
                    const tourImage = document.createElement('img');
                    tourImage.src = tour.image;
                    const tourDetails = document.createElement('div');
                    tourDetails.className = 'each-tour-details';
                    const tourTitle = document.createElement('h4');
                    tourTitle.textContent = tour.name;
                    const destinationText = document.createElement('p');
                    destinationText.textContent = tour.destination;
                    const descriptionText = document.createElement('p');
                    descriptionText.textContent = tour.description;
                    const lastPartTourDiv = document.createElement('div');
                    lastPartTourDiv.className = 'last-thing-tour';
                    const priceText = document.createElement('p');
                    priceText.textContent = tour.price;
                    const bookingButton = document.createElement('button');
                    bookingButton.textContent = 'Book Now';
                    bookingButton.onclick = () => {
                        makeBooking.classList.add('open');
                        this.setTourDetails(tour.name, tour.price, tour.destination, tour.hotels);
                    };
                    toursDisplay.appendChild(eachTourContainer);
                    eachTourContainer.appendChild(imageTourDiv);
                    imageTourDiv.appendChild(tourImage);
                    eachTourContainer.appendChild(tourDetails);
                    tourDetails.appendChild(tourTitle);
                    tourDetails.appendChild(destinationText);
                    tourDetails.appendChild(descriptionText);
                    tourDetails.appendChild(lastPartTourDiv);
                    lastPartTourDiv.appendChild(priceText);
                    lastPartTourDiv.appendChild(bookingButton);
                });
            }
        });
    }
    setTourDetails(name, price, destination, hotels) {
        const tourNameBooking = document.querySelector('.tour-name-booking');
        const tourPriceBooking = document.querySelector('.tour-price-booking');
        const numberOfPeople = document.querySelector('.numberOfPeople');
        const startingDateInput = document.querySelector('.startingDate');
        const endingDateInput = document.querySelector('.endingDate');
        const makeBookingBtn = document.getElementById('make-booking-btn');
        tourNameBooking.textContent = name;
        tourPriceBooking.textContent = price;
        numberOfPeople.value = '1';
        this.populateHotels(hotels);
        makeBookingBtn.onclick = (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const startingDate = startingDateInput.value;
            const endDate = endingDateInput.value;
            const numberOfPeopleValue = parseInt(numberOfPeople.value);
            const selectedHotel = document.querySelector('.booking-hotel select').value;
            const booking = yield this.getBookings();
            const bookingDetails = {
                id: booking.id,
                username: usernameUser,
                tour: name,
                hotel: selectedHotel,
                startDate: startingDate,
                endDate: endDate,
                people: numberOfPeopleValue,
                price: price
            };
            this.addBooking(bookingDetails);
        });
    }
    populateHotels(hotels) {
        const hotelSelect = document.querySelector('.booking-hotel select');
        hotelSelect.innerHTML = '';
        if (!hotels.length) {
            const noOption = document.createElement('option');
            noOption.textContent = 'No Hotels Available';
            hotelSelect.appendChild(noOption);
        }
        else {
            hotels.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel;
                option.textContent = hotel;
                hotelSelect.appendChild(option);
            });
        }
    }
    getBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLBookingsUser);
                const bookings = yield response.json();
                return bookings;
            }
            catch (error) {
                console.error('Failed to fetch bookings', error);
                return [];
            }
        });
    }
    addBooking(bookingDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetch(baseURLBookingsUser, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingDetails)
                });
                makeBooking.classList.remove('open');
            }
            catch (error) {
                console.error('Failed to add booking', error);
            }
        });
    }
}
let displayToursUser = new ToursUsers();
displayToursUser.displayTours();
closeBookingFormButton.addEventListener('click', (e) => {
    e.preventDefault();
    makeBooking.classList.remove('open');
});
let baseURLBookingsUser = 'http://localhost:3000/bookings';
class BookingsUsers {
    getBookings(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${baseURLBookingsUser}?username=${username}`);
                const bookings = yield response.json();
                console.log(bookings);
                return bookings;
            }
            catch (error) {
                console.error('Failed to fetch bookings', error);
                return [];
            }
        });
    }
    displayBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield this.getBookings(usernameUser || "");
            const bookingsDisplay = document.querySelector(".bookings-all-display");
            bookingsDisplay.innerHTML = ' ';
            if (!bookings.length) {
                const notFound = document.createElement('p');
                notFound.textContent = 'No Bookings Yet';
            }
            else {
                bookings.forEach(booking => {
                    const eachBookingDiv = document.createElement('div');
                    eachBookingDiv.className = 'each-booking';
                    const tourNameBooking = document.createElement('h4');
                    tourNameBooking.textContent = booking.tour;
                    const hotelNameBooking = document.createElement('h6');
                    hotelNameBooking.textContent = booking.hotel;
                    const datesBookingDiv = document.createElement('div');
                    datesBookingDiv.className = 'dates-booking';
                    const bookingDatesStart = document.createElement('div');
                    bookingDatesStart.className = 'date-booking';
                    const bookingDatesEnd = document.createElement('div');
                    bookingDatesEnd.className = 'date-booking';
                    const startDateBooking = document.createElement('h5');
                    startDateBooking.textContent = 'Start Date';
                    const actualStartDate = document.createElement('p');
                    actualStartDate.textContent = booking.startDate;
                    const endDateBooking = document.createElement('h5');
                    endDateBooking.textContent = 'End Date';
                    const actualEndDate = document.createElement('p');
                    actualEndDate.textContent = booking.endDate;
                    const lastPartBookingDiv = document.createElement('div');
                    lastPartBookingDiv.className = 'last-part-booking';
                    const tourPriceBooking = document.createElement('p');
                    tourPriceBooking.textContent = booking.price;
                    const editBookingBtn = document.createElement('button');
                    editBookingBtn.textContent = 'Edit Tour';
                    editBookingBtn.onclick = () => {
                        makeBooking.classList.add('open');
                    };
                    eachBookingDiv.appendChild(tourNameBooking);
                    eachBookingDiv.appendChild(hotelNameBooking);
                    eachBookingDiv.appendChild(datesBookingDiv);
                    datesBookingDiv.appendChild(bookingDatesStart);
                    datesBookingDiv.appendChild(bookingDatesEnd);
                    bookingDatesStart.appendChild(startDateBooking);
                    bookingDatesStart.appendChild(actualStartDate);
                    bookingDatesEnd.appendChild(endDateBooking);
                    bookingDatesEnd.appendChild(actualEndDate);
                    eachBookingDiv.appendChild(lastPartBookingDiv);
                    lastPartBookingDiv.appendChild(tourPriceBooking);
                    lastPartBookingDiv.appendChild(editBookingBtn);
                    bookingsDisplay.appendChild(eachBookingDiv);
                });
            }
        });
    }
}
let displayBookingsUsers = new BookingsUsers();
displayBookingsUsers.displayBookings();
