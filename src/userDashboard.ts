document.addEventListener("DOMContentLoaded", () => {
    // Display logged in username
    const usernameUser = sessionStorage.getItem("username");
    const usernameUserP = document.querySelector(".userUsername")! as HTMLParagraphElement;
    if (usernameUserP) {
        usernameUserP.textContent = usernameUser || '';
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
                console.log(hotels)
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
});

// Tours
let baseURLToursUsers = "http://localhost:3000/tours"
interface toursInterface {
    id: string;
    name: string;
    image: string;
    destination: string;
    description: string;
    price: string;
    hotels: string[]
}
class ToursUsers {
    private async getTours(): Promise<toursInterface[]> {
        try {
            const response = await fetch(baseURLToursUsers);
            const tours = await response.json();
            console.log(tours)
            return tours;
        } catch (error) {
            console.error('Failed to fetch hotels', error);
            return [];
        }
    }

    public async displayTours(): Promise<void> {
        const tours = await this.getTours();
        const toursDisplay = document.querySelector(".tours-display-all")! as HTMLDivElement;
        let html = '';

        if (!tours.length) {
            html = `<p>No Tours Found</p>`;
        } else {
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
    }
}

let displayToursUser = new ToursUsers();
displayToursUser.displayTours();

