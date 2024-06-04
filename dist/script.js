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
const baseURLUsersIndex = 'http://localhost:3000/users';
const closeEditUserButton = document.getElementById('closeEditUserButton');
const editUser = document.getElementById('edit-user');
const openEditUser = document.getElementById('username');
// Event listeners for edit User
openEditUser.addEventListener('click', () => {
    editUser.classList.add('open');
    const userClassInstance = User.getInstance();
    console.log("here");
    userClassInstance.displayUserInfo();
});
closeEditUserButton.addEventListener('click', () => {
    editUser.classList.remove('open');
});
// Display logged in username
let username = sessionStorage.getItem("username");
const usernameP = document.querySelector(".username");
usernameP.textContent = username || '';
class User {
    constructor() {
        this.displayUserInfo();
    }
    static getInstance() {
        if (!User._instanceUser) {
            User._instanceUser = new User();
        }
        return User._instanceUser;
    }
    //Edit User Information
    getUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${baseURLUsersIndex}?username=${username}`);
                const users = yield response.json();
                let user = users[0];
                return user;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    displayUserInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let currentUser = sessionStorage.getItem("username");
            if (!currentUser) {
                console.log("user doesn't exist");
                return;
            }
            const user = yield this.getUser(currentUser);
            if (!user) {
                return;
            }
            const emailInput = document.querySelector('.emailInput');
            const usernameInput = document.querySelector('.usernameInput');
            emailInput.value = user.email;
            usernameInput.value = user.username;
            const btnEdit = document.getElementById('btnEdit');
            btnEdit.addEventListener('click', () => this.editUser(user.id));
            const deleteUserBin = document.querySelector(".deleteUserBin");
            deleteUserBin.addEventListener('click', () => User.getInstance().deleteUser(user.id));
        });
    }
    editUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const successMessageDiv = document.querySelector(".edit-user-success-message");
            const errorMessageDiv = document.querySelector(".edit-user-error-message");
            const emailInput = document.querySelector('.emailInput');
            const usernameInput = document.querySelector('.usernameInput');
            const updatedUser = {
                id: userId,
                username: usernameInput.value,
                email: emailInput.value
            };
            try {
                const response = yield fetch(`${baseURLUsersIndex}?username=${username}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedUser)
                });
                if (response.ok) {
                    successMessageDiv.style.display = "block";
                    successMessageDiv.innerHTML = `<p class="messageP">User Information Added Successfully<p/>`;
                    sessionStorage.setItem("username", updatedUser.username);
                    usernameP.textContent = updatedUser.username;
                    setTimeout(() => {
                        successMessageDiv.style.display = "none";
                    }, 3000);
                }
                else {
                    errorMessageDiv.style.display = "block";
                    errorMessageDiv.innerHTML = `<p class="messageP">Failed to update user<p/>`;
                    setTimeout(() => {
                        errorMessageDiv.style.display = "none";
                    }, 3000);
                }
            }
            catch (error) {
                console.error('Error updating user:', error);
                errorMessageDiv.style.display = "block";
                errorMessageDiv.innerHTML = `<p class="messageP">Failed to update user information<p/>`;
                setTimeout(() => {
                    errorMessageDiv.style.display = "none";
                }, 5000);
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const successMessageDiv = document.querySelector(".edit-user-success-message");
            try {
                if (confirm("You are about to delete your account")) {
                    yield fetch(`${baseURLUsersIndex}/${userId}`, {
                        method: 'DELETE',
                        headers: { 'Content-type': 'application/JSON' }
                    }).then(data => {
                        successMessageDiv.style.display = "block";
                        successMessageDiv.innerHTML = `<p class="messageP">User Information Deleted Successfully<p/>`;
                        setTimeout(() => {
                            usernameP.textContent = '';
                            editUser.classList.remove('open');
                        }, 3000);
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
const userClass = User.getInstance();
