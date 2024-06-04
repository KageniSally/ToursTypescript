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
document.addEventListener("DOMContentLoaded", () => {
    // Display logged in username
    const usernameUser = sessionStorage.getItem("username");
    const usernameUserP = document.querySelector(".userUsername");
    if (usernameUserP) {
        usernameUserP.textContent = usernameUser || '';
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
});
// Tours
let baseURLToursUsers = "http://localhost:3000/tours";
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
                console.error('Failed to fetch hotels', error);
                return [];
            }
        });
    }
    displayTours() {
        return __awaiter(this, void 0, void 0, function* () {
            const tours = yield this.getTours();
            const toursDisplay = document.querySelector(".tours-display-all");
            let html = '';
            if (!tours.length) {
                html = `<p>No Tours Found</p>`;
            }
            else {
                tours.forEach(tour => {
                    html += `
                <div class="tour-all-container">
                <div class="image-tours"><img src="${tour.image}" alt="hotel"></div>
                <div class="each-tour-details">
                    <h4>${tour.name}</h4>
                    <p class="destination">${tour.destination}</p>
                    <p>${tour.description}</p>
                    <div class="last-thing-tour">
                        <p>${tour.price}</p><button>Book Now</button>
                    </div>
                </div>
            </div>
                `;
                });
            }
            toursDisplay.innerHTML = html;
        });
    }
}
let displayToursUser = new ToursUsers();
displayToursUser.displayTours();
