const baseURLUsersIndex: string = 'http://localhost:3000/users'
const closeEditUserButton = document.getElementById('closeEditUserButton')! as HTMLButtonElement;
const editUser = document.getElementById('edit-user')! as HTMLDivElement;
const openEditUser = document.getElementById('username')! as HTMLParagraphElement



// Event listeners for edit User
openEditUser.addEventListener('click', () => {
    editUser.classList.add('open');
    const userClassInstance = User.getInstance()
    console.log("here");

    userClassInstance.displayUserInfo()

});

closeEditUserButton.addEventListener('click', () => {
    editUser.classList.remove('open');

});




// Display logged in username
let username = sessionStorage.getItem("username");
const usernameP = document.querySelector(".username")! as HTMLParagraphElement;
usernameP.textContent = username || '';


interface userInterface {
    id: string,
    username: string,
    email: string
}

class User {

    public static _instanceUser: User

    private constructor() {
        this.displayUserInfo()

    }

    public static getInstance(): User {
        if (!User._instanceUser) {
            User._instanceUser = new User()
        }
        return User._instanceUser;
    }
    //Edit User Information
    private async getUser(username: string): Promise<userInterface | null> {
        try {
            const response = await fetch(`${baseURLUsersIndex}?username=${username}`)
            const users: userInterface[] = await response.json()
            let user: userInterface = users[0]
            return user

        } catch (error) {
            console.log(error)
            return null
        }


    }


    public async displayUserInfo() {
        let currentUser = sessionStorage.getItem("username");
        if (!currentUser) {
            console.log("user doesn't exist")
            return
        }
        const user = await this.getUser(currentUser)
        if (!user) { return }

        const emailInput = document.querySelector('.emailInput')! as HTMLInputElement
        const usernameInput = document.querySelector('.usernameInput')! as HTMLInputElement

        emailInput.value = user.email
        usernameInput.value = user.username

        const btnEdit = document.getElementById('btnEdit')! as HTMLButtonElement
        btnEdit.addEventListener('click', () => this.editUser(user.id))

        const deleteUserBin = document.querySelector(".deleteUserBin")! as HTMLElement
        deleteUserBin.addEventListener('click', () => User.getInstance().deleteUser(user.id))
    }

    private async editUser(userId: string): Promise<void> {
        const successMessageDiv = document.querySelector(".edit-user-success-message")! as HTMLDivElement
        const errorMessageDiv = document.querySelector(".edit-user-error-message")! as HTMLDivElement
        const emailInput = document.querySelector('.emailInput')! as HTMLInputElement;
        const usernameInput = document.querySelector('.usernameInput')! as HTMLInputElement;

        const updatedUser = {
            id: userId,
            username: usernameInput.value,
            email: emailInput.value
        };

        try {
            const response = await fetch(`${baseURLUsersIndex}?username=${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {

                successMessageDiv.style.display = "block"
                successMessageDiv.innerHTML = `<p class="messageP">User Information Added Successfully<p/>`
                sessionStorage.setItem("username", updatedUser.username);
                usernameP.textContent = updatedUser.username;
                setTimeout(() => {
                    successMessageDiv.style.display = "none"
                }, 3000)

            } else {
                errorMessageDiv.style.display = "block"
                errorMessageDiv.innerHTML = `<p class="messageP">Failed to update user<p/>`
                setTimeout(() => {
                    errorMessageDiv.style.display = "none"
                }, 3000)

            }
        } catch (error) {
            console.error('Error updating user:', error);
            errorMessageDiv.style.display = "block"
            errorMessageDiv.innerHTML = `<p class="messageP">Failed to update user information<p/>`
            setTimeout(() => {
                errorMessageDiv.style.display = "none"
            }, 5000)

        }

    }

    private async deleteUser(userId: string): Promise<void> {
        const successMessageDiv = document.querySelector(".edit-user-success-message")! as HTMLDivElement
        try {
            if (confirm("You are about to delete your account")) {
                await fetch(`${baseURLUsersIndex}/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Content-type': 'application/JSON' }
                }).then(data => {
                    successMessageDiv.style.display = "block"
                    successMessageDiv.innerHTML = `<p class="messageP">User Information Deleted Successfully<p/>`
                    setTimeout(() => {

                        usernameP.textContent = '';
                        editUser.classList.remove('open');
                    }, 3000)
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}
const userClass = User.getInstance()