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
const baseURLUsersLogin = "http://localhost:3000/users";
class Login {
    getValues() {
        // Get values from inputs
        const usernameInput = document.getElementById("username-inp");
        const passwordInput = document.getElementById("password-inp");
        const btnLogin = document.getElementById("btn-login");
        const messageDiv = document.querySelector(".auth-message");
        btnLogin.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            // Hide previous messages
            messageDiv.style.display = 'none';
            messageDiv.innerHTML = '';
            // Validate inputs
            if (this.validate(username, password)) {
                try {
                    const userExists = yield this.checkUserExists(username, password);
                    if (userExists) {
                        sessionStorage.setItem("username", username);
                        const isAdmin = yield this.checkUserRole(username);
                        if (!isAdmin) {
                            window.location.href = "index.html";
                        }
                        else {
                            window.location.href = "adminDashboard.html";
                        }
                    }
                    else {
                        messageDiv.style.display = 'block';
                        messageDiv.innerHTML = `<p class="message-p">Login Failed: Invalid username or password</p>`;
                    }
                }
                catch (error) {
                    messageDiv.style.display = 'block';
                    messageDiv.innerHTML = `<p class="message-p">Login Failed: An error occurred</p>`;
                }
            }
            else {
                messageDiv.style.display = 'block';
                messageDiv.innerHTML = `<p class="message-p">Login Failed: Please enter both username and password</p>`;
            }
        }));
    }
    validate(username, password) {
        return username !== "" && password !== "";
    }
    checkUserExists(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLUsersLogin);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const users = yield response.json();
                const user = users.find(user => user.username === username);
                return user !== undefined && user.password === password;
            }
            catch (error) {
                console.error('Error checking user:', error);
                return false;
            }
        });
    }
    checkUserRole(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLUsersLogin);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const users = yield response.json();
                const user = users.find(user => user.username === username);
                if (!user || user.role !== 'admin') {
                    return false;
                }
                return true;
            }
            catch (error) {
                console.error('Error checking user role:', error);
                return false;
            }
        });
    }
}
const login = new Login();
login.getValues();
