// Display logged in username
const usernameUser = sessionStorage.getItem("username");
const usernameUserP = document.querySelector(".userUsername")! as HTMLParagraphElement;
if (usernameUserP) {
    usernameUserP.textContent = usernameUser;
}

// Divs for user dashboard
const toursUserDiv = document.querySelector(".toursUserDiv")! as HTMLDivElement;
const hotelsUserDiv = document.querySelector(".hotelsUserDiv")! as HTMLDivElement;
const bookingsUserDiv = document.querySelector('.bookingsUserDiv')! as HTMLDivElement;

// Buttons to open specific divs
const toursUserOpen = document.getElementById("toursUser")! as HTMLHeadElement;
const hotelsUserOpen = document.getElementById("hotelsUser")! as HTMLHeadElement;
const bookingsUserOpen = document.getElementById("bookingsUser")! as HTMLHeadElement;
// Logout Button
const logoutUser = document.getElementById("logoutUser")! as HTMLHeadElement;

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

interface HotelInterface {
    id?: string;
    name: string;
    image: string;
    location: string;
    rating: string;
}

class HotelsUsers {
    private async getHotels(): Promise<HotelInterface[]> {
        try {
            const response = await fetch(baseURLHotelsUsers);
            const hotels = await response.json();
            console.log(hotels);
            return hotels;
        } catch (error) {
            console.error('Failed to fetch hotels', error);
            return [];
        }
    }

    public async displayHotels(): Promise<void> {
        const hotels = await this.getHotels();
        const hotelsDisplay = document.querySelector(".hotels-all-display")! as HTMLDivElement;
        let html = '';

        if (!hotels.length) {
            html = `<p>No Hotels Found</p>`;
        } else {
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
    }
}

let displayHotelsUser = new HotelsUsers();
displayHotelsUser.displayHotels();

// Tours
let baseURLToursUsers = "http://localhost:3000/tours";
interface toursInterface {
    id?: string;
    name: string;
    image: string;
    destination: string;
    description: string;
    price: string;
    hotels: string[];
}

// Form For Booking
const makeBooking = document.querySelector('.make-booking')! as HTMLDivElement;
const closeBookingFormButton = document.getElementById('closeBookTourButton')! as HTMLElement;

class ToursUsers {
    private async getTours(): Promise<toursInterface[]> {
        try {
            const response = await fetch(baseURLToursUsers);
            const tours = await response.json();
            console.log(tours);
            return tours;
        } catch (error) {
            console.error('Failed to fetch tours', error);
            return [];
        }
    }

    public async displayTours(): Promise<void> {
        const tours = await this.getTours();
        const toursDisplay = document.querySelector(".tours-display-all")! as HTMLDivElement;
        toursDisplay.innerHTML = '';

        if (!tours.length) {
            const notFound = document.createElement('p');
            notFound.textContent = 'No Tours Found';
            toursDisplay.appendChild(notFound);
        } else {
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
    }

    setTourDetails(name: string, price: string, destination: string, hotels: string[]) {
        const tourNameBooking = document.querySelector('.tour-name-booking')! as HTMLLabelElement;
        const tourPriceBooking = document.querySelector('.tour-price-booking')! as HTMLParagraphElement;
        const numberOfPeople = document.querySelector('.numberOfPeople')! as HTMLInputElement;
        const startingDateInput = document.querySelector('.startingDate')! as HTMLInputElement;
        const endingDateInput = document.querySelector('.endingDate')! as HTMLInputElement;
        const makeBookingBtn = document.getElementById('make-booking-btn')! as HTMLButtonElement;


        tourNameBooking.textContent = name;
        tourPriceBooking.textContent = price;
        numberOfPeople.value = '1';

        this.populateHotels(hotels);
        makeBookingBtn.onclick = async (e) => {
            e.preventDefault();
            const startingDate = startingDateInput.value;
            const endDate = endingDateInput.value;
            const numberOfPeopleValue = parseInt(numberOfPeople.value);
            const selectedHotel = (document.querySelector('.booking-hotel select')! as HTMLSelectElement).value;


            const booking = await this.getBookings()
            const bookingDetails: booking = {
                id: booking.id,
                username: usernameUser,
                tour: name,
                hotel: selectedHotel,
                startDate: startingDate,
                endDate: endDate,
                people: numberOfPeopleValue,
                price: price
            }
            this.addBooking(bookingDetails)

        };
    }

    private populateHotels(hotels: string[]): void {
        const hotelSelect = document.querySelector('.booking-hotel select')! as HTMLSelectElement;
        hotelSelect.innerHTML = '';

        if (!hotels.length) {
            const noOption = document.createElement('option');
            noOption.textContent = 'No Hotels Available';
            hotelSelect.appendChild(noOption);
        } else {
            hotels.forEach(hotel => {
                const option = document.createElement('option');
                option.value = hotel;
                option.textContent = hotel;
                hotelSelect.appendChild(option);
            });
        }
    }

    private async getBookings(): Promise<booking[]> {
        try {
            const response = await fetch(baseURLBookingsUser);
            const bookings = await response.json();
            return bookings;
        } catch (error) {
            console.error('Failed to fetch bookings', error);
            return [];
        }
    }

    private async addBooking(bookingDetails: object) {

        try {
            await fetch(baseURLBookingsUser, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingDetails)
            });
            makeBooking.classList.remove('open');
        } catch (error) {
            console.error('Failed to add booking', error);

        }
    }
}

let displayToursUser = new ToursUsers();
displayToursUser.displayTours();


closeBookingFormButton.addEventListener('click', (e) => {
    e.preventDefault();
    makeBooking.classList.remove('open');
});

let baseURLBookingsUser = 'http://localhost:3000/bookings'
// Bookings
interface booking {
    id: string;
    username: string;
    tour: string;
    hotel: string;
    startDate: string;
    endDate: string;
    people: number;
    price: string;
}

class BookingsUsers {
    private async getBookings(username: string): Promise<booking[]> {
        try {
            const response = await fetch(`${baseURLBookingsUser}?username=${username}`)

            const bookings = await response.json();
            console.log(bookings);
            return bookings;
        } catch (error) {
            console.error('Failed to fetch bookings', error);
            return [];
        }
    }

    public async displayBookings(): Promise<void> {
        const bookings = await this.getBookings(usernameUser || "");
        const bookingsDisplay = document.querySelector(".bookings-all-display")! as HTMLDivElement;
        bookingsDisplay.innerHTML = ' '

        if (!bookings.length) {
            const notFound = document.createElement('p')
            notFound.textContent = 'No Bookings Yet'
        } else {
            bookings.forEach(booking => {
                const eachBookingDiv = document.createElement('div')
                eachBookingDiv.className = 'each-booking'

                const tourNameBooking = document.createElement('h4')
                tourNameBooking.textContent = booking.tour

                const hotelNameBooking = document.createElement('h6')
                hotelNameBooking.textContent = booking.hotel

                const datesBookingDiv = document.createElement('div')
                datesBookingDiv.className = 'dates-booking'

                const bookingDatesStart = document.createElement('div')
                bookingDatesStart.className = 'date-booking'


                const bookingDatesEnd = document.createElement('div')
                bookingDatesEnd.className = 'date-booking'


                const startDateBooking = document.createElement('h5')
                startDateBooking.textContent = 'Start Date'

                const actualStartDate = document.createElement('p')
                actualStartDate.textContent = booking.startDate

                const endDateBooking = document.createElement('h5')
                endDateBooking.textContent = 'End Date'

                const actualEndDate = document.createElement('p')
                actualEndDate.textContent = booking.endDate

                const lastPartBookingDiv = document.createElement('div')
                lastPartBookingDiv.className = 'last-part-booking'

                const tourPriceBooking = document.createElement('p')
                tourPriceBooking.textContent = booking.price

                const editBookingBtn = document.createElement('button')
                editBookingBtn.textContent = 'Edit Tour'
                editBookingBtn.onclick = () => {
                    makeBooking.classList.add('open');
                }

                eachBookingDiv.appendChild(tourNameBooking)
                eachBookingDiv.appendChild(hotelNameBooking)
                eachBookingDiv.appendChild(datesBookingDiv)

                datesBookingDiv.appendChild(bookingDatesStart)
                datesBookingDiv.appendChild(bookingDatesEnd)

                bookingDatesStart.appendChild(startDateBooking)
                bookingDatesStart.appendChild(actualStartDate)

                bookingDatesEnd.appendChild(endDateBooking)
                bookingDatesEnd.appendChild(actualEndDate)

                eachBookingDiv.appendChild(lastPartBookingDiv)
                lastPartBookingDiv.appendChild(tourPriceBooking)
                lastPartBookingDiv.appendChild(editBookingBtn)


                bookingsDisplay.appendChild(eachBookingDiv)

            });
        }


    }
}

let displayBookingsUsers = new BookingsUsers();
displayBookingsUsers.displayBookings();