let baseURLUserAdminDashboard = "http://localhost:3000/users";
const adminUsernameP = document.querySelector(".adminUsername")! as HTMLParagraphElement;
let adminUsername = sessionStorage.getItem("username");

if (adminUsername) {
    adminUsernameP.textContent = adminUsername;
}



interface UserInterface {
    id: string;
    username: string;
    email: string;
    password: string;
    role: string
}

class GetAdminDetails {
    async getAdmin(username: string): Promise<UserInterface | null> {
        try {
            const response = await fetch(`${baseURLUserAdminDashboard}?username=${username}`);
            const users: UserInterface[] = await response.json();
            const admin = users.find(user => user.username === username);
            return admin || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async setAdminDetails(): Promise<void> {
        const emailAdmin = document.querySelector(".adminEmail")! as HTMLParagraphElement;

        if (!adminUsername) {
            console.error('Admin username is not set in session storage');
            return;
        }

        const admin = await this.getAdmin(adminUsername);
        if (!admin) {
            console.error('Admin details could not be retrieved');
            return;
        }

        emailAdmin.textContent = admin.email;
    }
}

const adminDetails = new GetAdminDetails();
adminDetails.setAdminDetails();


//div for admin dashboard
const homeAdminDiv = document.querySelector(".home")! as HTMLDivElement
const toursAdminDiv = document.querySelector(".toursAdminDiv")! as HTMLDivElement
const hotelsAdminDiv = document.querySelector(".hotelsAdminDiv")! as HTMLDivElement
const userAdminDiv = document.querySelector('.userAdminDiv')! as HTMLDivElement
const bookingsAdminDiv = document.querySelector('.bookingsAdminDiv')! as HTMLDivElement

//buttons to open specific divs
const homeAdminOpen = document.getElementById("homeAdmin")! as HTMLHeadElement
const toursAdminOpen = document.getElementById("toursAdmin")! as HTMLHeadElement
const hotelsAdminOpen = document.getElementById("hotelsAdmin")! as HTMLHeadElement
const usersAdminOpen = document.getElementById("usersAdmin")! as HTMLHeadElement
const bookingsAdminOpen = document.getElementById("bookingsAdmin")! as HTMLHeadElement

//Logout Button
const logoutAdmin = document.getElementById("logoutAdmin")! as HTMLHeadElement

class ManipulateDashboard {
    eventListeners() {
        //Home
        homeAdminOpen.addEventListener('click', () => this.openHomeDiv())

        //Tours
        toursAdminOpen.addEventListener('click', () => this.openToursDiv())

        //Hotels
        hotelsAdminOpen.addEventListener('click', () => this.openHotelsDiv())

        //Tours
        usersAdminOpen.addEventListener('click', () => this.openUsersDiv())

        //Bookings
        bookingsAdminOpen.addEventListener('click', () => this.openBookingsDiv())

        //Logout
        logoutAdmin.addEventListener('click', () => {
            sessionStorage.removeItem("username");
            window.location.href = "index.html";
        });
    }
    openHomeDiv() {
        homeAdminDiv.style.display = "block"
        toursAdminDiv.style.display = "block"
        hotelsAdminDiv.style.display = "block"
        userAdminDiv.style.display = "block"
        bookingsAdminDiv.style.display = "block"
    }
    openToursDiv() {
        toursAdminDiv.style.display = "block"
        homeAdminDiv.style.display = "none"
        hotelsAdminDiv.style.display = "none"
        userAdminDiv.style.display = "none"
        bookingsAdminDiv.style.display = "none"
    }
    openHotelsDiv() {
        hotelsAdminDiv.style.display = "block"
        homeAdminDiv.style.display = "none"
        toursAdminDiv.style.display = "none"
        userAdminDiv.style.display = "none"
        bookingsAdminDiv.style.display = "none"
    }
    openUsersDiv() {
        userAdminDiv.style.display = "block"
        homeAdminDiv.style.display = "none"
        bookingsAdminDiv.style.display = "none"
        hotelsAdminDiv.style.display = "none"
        toursAdminDiv.style.display = "none"
    }
    openBookingsDiv() {
        bookingsAdminDiv.style.display = "block"
        homeAdminDiv.style.display = "none"
        userAdminDiv.style.display = "none"
        hotelsAdminDiv.style.display = "none"
        toursAdminDiv.style.display = "none"
    }
}
let manipulateDashboard = new ManipulateDashboard()
manipulateDashboard.eventListeners()




//Users Service
class Users {
    private static _instanceUsers: Users

    //Constructor
    private constructor() {
        this.displayUsers()
    }

    public static getInstance(): Users {
        if (!Users._instanceUsers) {
            Users._instanceUsers = new Users
        }
        return Users._instanceUsers
    }

    private async getUsers(): Promise<UserInterface[]> {
        try {
            const response = await fetch(baseURLUserAdminDashboard)
            const users = await response.json()
            return users
        }
        catch (error) {
            return []
        }
    }


    public async displayUsers(): Promise<void> {
        const users = await this.getUsers()
        const tbody = document.querySelector(".display-users")! as HTMLTableSectionElement
        tbody.innerHTML = ''

        if (!users.length) {
            console.error('No users found');
        } else {
            users.forEach(user => {
                const tr = document.createElement('tr')
                const userIdColumn = document.createElement('td')
                userIdColumn.textContent = user.id
                const userNameColumn = document.createElement('td')
                userNameColumn.textContent = user.username
                const userEmailColumn = document.createElement('td')
                userEmailColumn.textContent = user.email
                const userRoleColumn = document.createElement('td')
                // userRoleColumn.textContent = 'Customer'
                const roleSelect = document.createElement('select')
                const customerOption = document.createElement('option')
                const adminOption = document.createElement('option')

                customerOption.value = 'customer'
                customerOption.textContent = 'Customer'
                adminOption.value = 'admin'
                adminOption.textContent = 'Admin'

                roleSelect.appendChild(customerOption)
                roleSelect.appendChild(adminOption)

                roleSelect.value = user.role
                roleSelect.addEventListener('change', () => this.updateUserRole(user.id, user.username, user.email, user.password, roleSelect.value))
                userRoleColumn.appendChild(roleSelect)
                const userDeleteColumn = document.createElement('td')
                const deleteUserBin = document.createElement('ion-icon')
                deleteUserBin.setAttribute('name', 'trash-outline')
                deleteUserBin.classList.add('deleteUserBin')
                deleteUserBin.addEventListener('click', (e) => {
                    e.preventDefault()
                    this.deleteUser(user.id)
                })
                userDeleteColumn.appendChild(deleteUserBin)

                tr.appendChild(userIdColumn)
                tr.appendChild(userNameColumn)
                tr.appendChild(userEmailColumn)
                tr.appendChild(userRoleColumn)
                tr.appendChild(userDeleteColumn)

                tbody.appendChild(tr)
            })
        }
    }
    private async deleteUser(id: string): Promise<void> {
        try {
            await fetch(`${baseURLUserAdminDashboard}/${id}`, {
                method: 'DELETE',
                headers: { 'Content-type': 'application/json' }
            })
            this.displayUsers()
        } catch (error) {
            console.log(error)
        }
    }

    private async updateUserRole(id: string, username: string, email: string, password: string, newRole: string): Promise<void> {
        let updatedUser = {
            id,
            username,
            email,
            password,
            role: newRole
        }
        try {
            await fetch(`${baseURLUserAdminDashboard}/${id}`, {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(updatedUser)
            })
            this.displayUsers()
        } catch (error) {
            console.log(error)
        }
    }



}
const usersInstance = Users.getInstance();
usersInstance.displayUsers();


//Add Tours
let baseURLToursAdmin = "http://localhost:3000/tours"


interface toursInterface {
    name: string;
    image: string;
    destination: string;
    description: string;
    price: string;
    hotels: []
}

class Tours {
    async getTours() {

        //Message Div
        const errorMessageTours = document.querySelector(".edit-user-error-message")! as HTMLDivElement
        const successMessageTours = document.querySelector(".edit-user-success-message")! as HTMLDivElement

        const tourNameInput = document.getElementById("tourInput")! as HTMLInputElement
        const tourImageURLInput = document.getElementById("imageInput")! as HTMLInputElement
        const destinationInputInput = document.getElementById("destinationInput")! as HTMLInputElement
        const descriptionInput = document.getElementById("descriptionInput")! as HTMLInputElement
        const priceInput = document.getElementById("priceInput")! as HTMLInputElement

        const addTourHotels = document.getElementById("addTourHotels")! as HTMLElement
        const addTourButton = document.getElementById("addTour-btn")! as HTMLButtonElement
        let hotelName = addTourHotels.addEventListener('click', () => {
            prompt("input name of hotel")
        })

        console.log(hotelName)

        addTourButton.addEventListener('click', async (e) => {
            e.preventDefault()
            const tourName = tourNameInput.value.trim()
            const tourImage = tourImageURLInput.value.trim()
            const tourDestination = destinationInputInput.value.trim()
            const tourDescription = descriptionInput.value.trim()
            const tourPrice = priceInput.value.trim()
            const hotels = []
            hotels.push(hotelName)

            const newTour = {
                tourName,
                tourImage,
                tourDescription,
                tourDestination,
                tourPrice,
                hotels: []
            }

            const response = await fetch(baseURLToursAdmin, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTour)
            })
            if (response.ok) {
                successMessageTours.style.display = "block"
                successMessageTours.innerHTML = `<p class="messageP">Tour Added Successfully</p>`
                setTimeout(() => {
                    successMessageTours.style.display = "none"
                }, 3000)

            } else {
                errorMessageTours.style.display = "block"
                errorMessageTours.innerHTML = `<p class="messageP">Tour Failed to Add</p>`
            }

        })


    }
}
let tours = new Tours()
tours.getTours()