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
let baseURLUserAdminDashboard = "http://localhost:3000/users";
const adminUsernameP = document.querySelector(".adminUsername");
let adminUsername = sessionStorage.getItem("username");
if (adminUsername) {
    adminUsernameP.textContent = adminUsername;
}
class GetAdminDetails {
    getAdmin(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${baseURLUserAdminDashboard}?username=${username}`);
                const users = yield response.json();
                const admin = users.find(user => user.username === username);
                return admin || null;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    setAdminDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const emailAdmin = document.querySelector(".adminEmail");
            if (!adminUsername) {
                console.error('Admin username is not set in session storage');
                return;
            }
            const admin = yield this.getAdmin(adminUsername);
            if (!admin) {
                console.error('Admin details could not be retrieved');
                return;
            }
            emailAdmin.textContent = admin.email;
        });
    }
}
const adminDetails = new GetAdminDetails();
adminDetails.setAdminDetails();
//div for admin dashboard
const homeAdminDiv = document.querySelector(".home");
const toursAdminDiv = document.querySelector(".toursAdminDiv");
const hotelsAdminDiv = document.querySelector(".hotelsAdminDiv");
const userAdminDiv = document.querySelector('.userAdminDiv');
const bookingsAdminDiv = document.querySelector('.bookingsAdminDiv');
//buttons to open specific divs
const homeAdminOpen = document.getElementById("homeAdmin");
const toursAdminOpen = document.getElementById("toursAdmin");
const hotelsAdminOpen = document.getElementById("hotelsAdmin");
const usersAdminOpen = document.getElementById("usersAdmin");
const bookingsAdminOpen = document.getElementById("bookingsAdmin");
//Logout Button
const logoutAdmin = document.getElementById("logoutAdmin");
class ManipulateDashboard {
    eventListeners() {
        //Home
        homeAdminOpen.addEventListener('click', () => this.openHomeDiv());
        //Tours
        toursAdminOpen.addEventListener('click', () => this.openToursDiv());
        //Hotels
        hotelsAdminOpen.addEventListener('click', () => this.openHotelsDiv());
        //Tours
        usersAdminOpen.addEventListener('click', () => this.openUsersDiv());
        //Bookings
        bookingsAdminOpen.addEventListener('click', () => this.openBookingsDiv());
        //Logout
        logoutAdmin.addEventListener('click', () => {
            sessionStorage.removeItem("username");
            window.location.href = "index.html";
        });
    }
    openHomeDiv() {
        homeAdminDiv.style.display = "block";
        toursAdminDiv.style.display = "block";
        hotelsAdminDiv.style.display = "block";
        userAdminDiv.style.display = "block";
        bookingsAdminDiv.style.display = "block";
    }
    openToursDiv() {
        toursAdminDiv.style.display = "block";
        homeAdminDiv.style.display = "none";
        hotelsAdminDiv.style.display = "none";
        userAdminDiv.style.display = "none";
        bookingsAdminDiv.style.display = "none";
    }
    openHotelsDiv() {
        hotelsAdminDiv.style.display = "block";
        homeAdminDiv.style.display = "none";
        toursAdminDiv.style.display = "none";
        userAdminDiv.style.display = "none";
        bookingsAdminDiv.style.display = "none";
    }
    openUsersDiv() {
        userAdminDiv.style.display = "block";
        homeAdminDiv.style.display = "none";
        bookingsAdminDiv.style.display = "none";
        hotelsAdminDiv.style.display = "none";
        toursAdminDiv.style.display = "none";
    }
    openBookingsDiv() {
        bookingsAdminDiv.style.display = "block";
        homeAdminDiv.style.display = "none";
        userAdminDiv.style.display = "none";
        hotelsAdminDiv.style.display = "none";
        toursAdminDiv.style.display = "none";
    }
}
let manipulateDashboard = new ManipulateDashboard();
manipulateDashboard.eventListeners();
//Users Service
class Users {
    //Constructor
    constructor() {
        this.displayUsers();
    }
    static getInstance() {
        if (!Users._instanceUsers) {
            Users._instanceUsers = new Users;
        }
        return Users._instanceUsers;
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLUserAdminDashboard);
                const users = yield response.json();
                return users;
            }
            catch (error) {
                return [];
            }
        });
    }
    displayUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.getUsers();
            const tbody = document.querySelector(".display-users");
            tbody.innerHTML = '';
            if (!users.length) {
                console.error('No users found');
            }
            else {
                users.forEach(user => {
                    const tr = document.createElement('tr');
                    const userIdColumn = document.createElement('td');
                    userIdColumn.textContent = user.id;
                    const userNameColumn = document.createElement('td');
                    userNameColumn.textContent = user.username;
                    const userEmailColumn = document.createElement('td');
                    userEmailColumn.textContent = user.email;
                    const userRoleColumn = document.createElement('td');
                    // userRoleColumn.textContent = 'Customer'
                    const roleSelect = document.createElement('select');
                    const customerOption = document.createElement('option');
                    const adminOption = document.createElement('option');
                    customerOption.value = 'customer';
                    customerOption.textContent = 'Customer';
                    adminOption.value = 'admin';
                    adminOption.textContent = 'Admin';
                    roleSelect.appendChild(customerOption);
                    roleSelect.appendChild(adminOption);
                    roleSelect.value = user.role;
                    roleSelect.addEventListener('change', () => this.updateUserRole(user.id, user.username, user.email, user.password, roleSelect.value));
                    userRoleColumn.appendChild(roleSelect);
                    const userDeleteColumn = document.createElement('td');
                    const deleteUserBin = document.createElement('ion-icon');
                    deleteUserBin.setAttribute('name', 'trash-outline');
                    deleteUserBin.classList.add('deleteUserBin');
                    deleteUserBin.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.deleteUser(user.id);
                    });
                    userDeleteColumn.appendChild(deleteUserBin);
                    tr.appendChild(userIdColumn);
                    tr.appendChild(userNameColumn);
                    tr.appendChild(userEmailColumn);
                    tr.appendChild(userRoleColumn);
                    tr.appendChild(userDeleteColumn);
                    tbody.appendChild(tr);
                });
            }
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetch(`${baseURLUserAdminDashboard}/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' }
                });
                this.displayUsers();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    updateUserRole(id, username, email, password, newRole) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedUser = {
                id,
                username,
                email,
                password,
                role: newRole
            };
            try {
                yield fetch(`${baseURLUserAdminDashboard}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(updatedUser)
                });
                this.displayUsers();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
const usersInstance = Users.getInstance();
usersInstance.displayUsers();
//Tours Service
let baseURLToursAdmin = "http://localhost:3000/tours";
const errorMessageTours = document.querySelector(".edit-user-error-message");
const successMessageTours = document.querySelector(".edit-user-success-message");
const tourNameInput = document.getElementById("tourInput");
const tourImageURLInput = document.getElementById("imageInput");
const destinationInput = document.getElementById("destinationInput");
const descriptionInput = document.getElementById("descriptionInput");
const priceInput = document.getElementById("priceInput");
const addTourButton = document.getElementById("addTour-btn");
const hotels = [];
class Tours {
    addTours() {
        return __awaiter(this, void 0, void 0, function* () {
            document.getElementById("addTourHotels").addEventListener('click', (e) => {
                e.preventDefault();
                const hotelName = prompt("Input name of hotel");
                if (hotelName) {
                    hotels.push(hotelName);
                }
            });
            addTourButton.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const tour = yield this.getTours();
                const tourDetails = {
                    id: tour.id,
                    name: tourNameInput.value,
                    image: tourImageURLInput.value,
                    destination: destinationInput.value,
                    description: descriptionInput.value,
                    price: priceInput.value,
                    hotels
                };
                if (addTourButton.textContent === "Add Tour") {
                    try {
                        yield fetch(baseURLToursAdmin, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(tourDetails)
                        });
                        successMessageTours.textContent = 'Tour successfully added';
                        successMessageTours.style.display = 'block';
                        errorMessageTours.style.display = 'none';
                        this.displayTours();
                    }
                    catch (error) {
                        errorMessageTours.textContent = 'Failed to add tour';
                        errorMessageTours.style.display = 'block';
                        successMessageTours.style.display = 'none';
                        console.error(error);
                    }
                }
                else if (addTourButton.textContent === 'Edit Tour') {
                    yield this.updateTour();
                }
                this.displayTours();
                tourNameInput.value = '';
                destinationInput.value = '';
                descriptionInput.value = ' ';
                priceInput.value = '';
                tourImageURLInput.value = ' ';
            }));
        });
    }
    getTours() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLToursAdmin);
                const tours = yield response.json();
                return tours;
            }
            catch (error) {
                return [];
            }
        });
    }
    displayTours() {
        return __awaiter(this, void 0, void 0, function* () {
            const tours = yield this.getTours();
            const tbody = document.querySelector(".display-tours");
            tbody.innerHTML = '';
            if (!tours.length) {
                console.error('No Tours found');
            }
            else {
                tours.forEach(tour => {
                    const tr = document.createElement('tr');
                    const tourIdColumn = document.createElement('td');
                    tourIdColumn.textContent = tour.id;
                    const tourNameColumn = document.createElement('td');
                    tourNameColumn.textContent = tour.name;
                    const tourHotelsColumn = document.createElement('td');
                    const hotelSelect = document.createElement('select');
                    tour.hotels.forEach(hotel => {
                        const option = document.createElement('option');
                        option.value = hotel;
                        option.textContent = hotel;
                        hotelSelect.appendChild(option);
                    });
                    hotelSelect.value = tour.hotels[0];
                    tourHotelsColumn.appendChild(hotelSelect);
                    const tourDestColumn = document.createElement('td');
                    tourDestColumn.textContent = tour.destination;
                    const tourDescColumn = document.createElement('td');
                    tourDescColumn.textContent = tour.description;
                    const tourPriceColumn = document.createElement('td');
                    tourPriceColumn.textContent = tour.price;
                    const tourDeleteColumn = document.createElement('td');
                    // const updateTour = document.createAttribute('ion-icon')
                    // updateTour.setAttribute('name', 'pencil')
                    // updateTour.classList.add('updateTour')
                    const updateTour = document.createElement('ion-icon');
                    updateTour.setAttribute('name', 'pencil');
                    updateTour.classList.add('updateTour');
                    updateTour.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        yield this.prepopulate(tour.id, tour.name, tour.description, tour.destination, tour.image, tour.price, tour.hotels);
                    }));
                    const deleteTourBin = document.createElement('ion-icon');
                    deleteTourBin.setAttribute('name', 'trash-outline');
                    deleteTourBin.classList.add('deleteToursBin');
                    deleteTourBin.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        yield this.deleteTour(tour.id);
                    }));
                    tourDeleteColumn.appendChild(deleteTourBin);
                    tourDeleteColumn.appendChild(updateTour);
                    tr.appendChild(tourIdColumn);
                    tr.appendChild(tourNameColumn);
                    tr.appendChild(tourHotelsColumn);
                    tr.appendChild(tourDestColumn);
                    tr.appendChild(tourDescColumn);
                    tr.appendChild(tourPriceColumn);
                    tr.appendChild(tourDeleteColumn);
                    tbody.appendChild(tr);
                });
            }
        });
    }
    deleteTour(tourId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetch(`${baseURLToursAdmin}/${tourId}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' }
                });
                this.displayTours();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    prepopulate(id, name, description, destination, image, price, hotels) {
        return __awaiter(this, void 0, void 0, function* () {
            tourNameInput.value = name;
            tourImageURLInput.value = image;
            descriptionInput.value = description;
            destinationInput.value = destination;
            priceInput.value = price;
            addTourButton.textContent = 'Edit Tour';
            const hotelSelect = document.getElementById("hotelSelect");
            hotelSelect.innerHTML = "";
            hotels.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel;
                option.textContent = hotel;
                hotelSelect.appendChild(option);
            });
            hotelSelect.value = hotels[0];
        });
    }
    updateTour() {
        return __awaiter(this, void 0, void 0, function* () {
            const tourId = addTourButton.getAttribute("data-id");
            if (!tourId) {
                console.error("Tour ID is missing");
                return;
            }
            const updateTour = {
                id: tourId,
                name: tourNameInput.value,
                image: tourImageURLInput.value,
                destination: destinationInput.value,
                description: descriptionInput.value,
                price: priceInput.value,
                hotels: Array.from(document.getElementById("hotelSelect").selectedOptions).map(option => option.value)
            };
            try {
                yield fetch(`${baseURLToursAdmin}/${tourId}`, {
                    method: 'PUT',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(updateTour)
                });
                addTourButton.textContent = 'Add Tour';
                addTourButton.removeAttribute("data-id");
                this.displayTours();
            }
            catch (error) {
                console.error("Failed to update tour", error);
            }
        });
    }
}
let tours = new Tours();
tours.addTours();
tours.displayTours();
let baseURLHotelsAdmin = "http://localhost:3000/hotels";
const errorMessageHotels = document.querySelector(".edit-hotel-error-message");
const successMessageHotels = document.querySelector(".edit-hotel-success-message");
const hotelNameInput = document.getElementById("hotelInput");
const hotelImageURLInput = document.getElementById("hotelImageInput");
const hotelLocationInput = document.getElementById("hotelLocationInput");
const hotelRatingInput = document.getElementById("RatingInput");
const addHotelButton = document.getElementById("addHotel-btn");
class Hotels {
    addHotels() {
        return __awaiter(this, void 0, void 0, function* () {
            addHotelButton.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const hotelDetails = {
                    name: hotelNameInput.value,
                    image: hotelImageURLInput.value,
                    location: hotelLocationInput.value,
                    rating: hotelRatingInput.value
                };
                if (addHotelButton.textContent === "Add Hotel") {
                    try {
                        yield fetch(baseURLHotelsAdmin, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(hotelDetails)
                        });
                        successMessageHotels.textContent = 'Hotel successfully added';
                        successMessageHotels.style.display = 'block';
                        errorMessageHotels.style.display = 'none';
                        this.displayHotels();
                    }
                    catch (error) {
                        errorMessageHotels.textContent = 'Failed to add hotel';
                        errorMessageHotels.style.display = 'block';
                        successMessageHotels.style.display = 'none';
                        console.error(error);
                    }
                }
                else if (addHotelButton.textContent === 'Edit Hotel') {
                    yield this.updateHotel();
                }
                this.clearForm();
            }));
        });
    }
    getHotels() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLHotelsAdmin);
                const hotels = yield response.json();
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
            const tbody = document.querySelector(".display-hotels");
            tbody.innerHTML = '';
            if (!hotels.length) {
                console.error('No Hotels found');
            }
            else {
                hotels.forEach(hotel => {
                    const tr = document.createElement('tr');
                    const hotelIdColumn = document.createElement('td');
                    hotelIdColumn.textContent = hotel.id || "";
                    const hotelNameColumn = document.createElement('td');
                    hotelNameColumn.textContent = hotel.name;
                    const hotelLocationColumn = document.createElement('td');
                    hotelLocationColumn.textContent = hotel.location;
                    const hotelRatingColumn = document.createElement('td');
                    hotelRatingColumn.textContent = hotel.rating;
                    const hotelDeleteColumn = document.createElement('td');
                    const updateHotel = document.createElement('ion-icon');
                    updateHotel.setAttribute('name', 'pencil');
                    updateHotel.classList.add('updateHotel');
                    updateHotel.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        this.prepopulate(hotel.id, hotel.name, hotel.location, hotel.rating, hotel.image);
                    }));
                    const deleteHotelBin = document.createElement('ion-icon');
                    deleteHotelBin.setAttribute('name', 'trash-outline');
                    deleteHotelBin.classList.add('deleteHotelsBin');
                    deleteHotelBin.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        yield this.deleteHotel(hotel.id);
                    }));
                    hotelDeleteColumn.appendChild(deleteHotelBin);
                    hotelDeleteColumn.appendChild(updateHotel);
                    tr.appendChild(hotelIdColumn);
                    tr.appendChild(hotelNameColumn);
                    tr.appendChild(hotelLocationColumn);
                    tr.appendChild(hotelRatingColumn);
                    tr.appendChild(hotelDeleteColumn);
                    tbody.appendChild(tr);
                });
            }
        });
    }
    deleteHotel(hotelId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetch(`${baseURLHotelsAdmin}/${hotelId}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' }
                });
                this.displayHotels();
            }
            catch (error) {
                console.error('Failed to delete hotel', error);
            }
        });
    }
    prepopulate(id, name, location, rating, image) {
        return __awaiter(this, void 0, void 0, function* () {
            hotelNameInput.value = name;
            hotelImageURLInput.value = image;
            hotelLocationInput.value = location;
            hotelRatingInput.value = rating;
            addHotelButton.textContent = 'Edit Hotel';
            addHotelButton.setAttribute("data-id", id);
        });
    }
    updateHotel() {
        return __awaiter(this, void 0, void 0, function* () {
            const hotelId = addHotelButton.getAttribute("data-id");
            if (!hotelId) {
                console.error("Hotel ID is missing");
                return;
            }
            const updateHotel = {
                id: hotelId,
                name: hotelNameInput.value,
                image: hotelImageURLInput.value,
                location: hotelLocationInput.value,
                rating: hotelRatingInput.value
            };
            try {
                yield fetch(`${baseURLHotelsAdmin}/${hotelId}`, {
                    method: 'PUT',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(updateHotel)
                });
                addHotelButton.textContent = 'Add Hotel';
                addHotelButton.removeAttribute("data-id");
                this.displayHotels();
            }
            catch (error) {
                console.error("Failed to update hotel", error);
            }
        });
    }
    clearForm() {
        hotelNameInput.value = '';
        hotelImageURLInput.value = '';
        hotelLocationInput.value = '';
        hotelRatingInput.value = '';
    }
}
let hotelsInstance = new Hotels();
hotelsInstance.addHotels();
hotelsInstance.displayHotels();
let baseURLBookingsAdmin = "http://localhost:3000/bookings";
class Bookings {
    getBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLBookingsAdmin);
                const bookings = yield response.json();
                console.log(bookings);
                return bookings;
            }
            catch (error) {
                console.error(error);
                return [];
            }
        });
    }
    displayBookings() {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield this.getBookings();
            const tbody = document.querySelector(".display-bookings");
            tbody.innerHTML = '';
            if (!bookings.length) {
                console.error('No Bookings found');
            }
            else {
                bookings.forEach(booking => {
                    const tr = document.createElement('tr');
                    const bookingIdColumn = document.createElement('td');
                    bookingIdColumn.textContent = booking.id;
                    const usernameColumn = document.createElement('td');
                    usernameColumn.textContent = booking.username;
                    const tourColumn = document.createElement('td');
                    tourColumn.textContent = booking.tour;
                    const hotelColumn = document.createElement('td');
                    hotelColumn.textContent = booking.hotel;
                    const startDateColumn = document.createElement('td');
                    startDateColumn.textContent = booking.startDate;
                    const endDateColumn = document.createElement('td');
                    endDateColumn.textContent = booking.endDate;
                    const priceColumn = document.createElement('td');
                    priceColumn.textContent = booking.price;
                    const bookingDeleteColumn = document.createElement('td');
                    const deleteBookingBin = document.createElement('ion-icon');
                    deleteBookingBin.setAttribute('name', 'trash-outline');
                    deleteBookingBin.classList.add('deleteBookingBin');
                    deleteBookingBin.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                        e.preventDefault();
                        yield this.deleteBooking(booking.id);
                    }));
                    bookingDeleteColumn.appendChild(deleteBookingBin);
                    tr.appendChild(bookingIdColumn);
                    tr.appendChild(usernameColumn);
                    tr.appendChild(tourColumn);
                    tr.appendChild(hotelColumn);
                    tr.appendChild(startDateColumn);
                    tr.appendChild(endDateColumn);
                    tr.appendChild(priceColumn);
                    tr.appendChild(bookingDeleteColumn);
                    tbody.appendChild(tr);
                });
            }
        });
    }
    deleteBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield fetch(`${baseURLBookingsAdmin}/${bookingId}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/json' }
                });
                this.displayBookings();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
let displayBookingsAdmin = new Bookings();
displayBookingsAdmin.displayBookings();
