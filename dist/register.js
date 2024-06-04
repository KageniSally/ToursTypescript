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
let baseURLUsers = 'http://localhost:3000/users';
var Role;
(function (Role) {
    Role["Admin"] = "admin";
    Role["Customer"] = "customer";
})(Role || (Role = {}));
class Register {
    getUserValues() {
        return __awaiter(this, void 0, void 0, function* () {
            const usernameInput = document.getElementById("username");
            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");
            const confPasswordInput = document.getElementById("confpassword");
            const registerBtn = document.getElementById("btn-reg");
            const messageDiv = document.querySelector(".auth-message");
            registerBtn.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                const email = emailInput.value.trim();
                const username = usernameInput.value.trim();
                const password = passwordInput.value.trim();
                const confPassword = confPasswordInput.value.trim();
                const userData = {
                    email,
                    username,
                    password,
                    role: Role.Customer
                };
                const validationMessage = this.validate(email, username, password, confPassword);
                if (validationMessage === "valid") {
                    try {
                        const usernameExists = yield this.checkUsernameExists(username);
                        if (usernameExists) {
                            messageDiv.style.display = 'block';
                            messageDiv.innerHTML = `<p class="message-p">Username already exists. Please choose another one.</p>`;
                            return;
                        }
                        const response = yield fetch(baseURLUsers, {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(userData)
                        });
                        if (response.ok) {
                            window.location.href = "login.html";
                        }
                        else {
                            messageDiv.style.display = 'block';
                            messageDiv.innerHTML = `<p class="message-p">Registration Failed</p>`;
                        }
                    }
                    catch (error) {
                        messageDiv.style.display = 'block';
                        messageDiv.innerHTML = `<p class="message-p">Registration Failed</p>`;
                    }
                }
                else {
                    messageDiv.style.display = 'block';
                    messageDiv.innerHTML = `<p class="message-p">${validationMessage}</p>`;
                }
            }));
        });
    }
    validate(email, username, password, confPassword) {
        if (email === "" || username === "" || password === "" || confPassword === "") {
            return "All fields are required";
        }
        else if (password !== confPassword) {
            return "Passwords do not match";
        }
        else if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        else {
            return "valid";
        }
    }
    checkUsernameExists(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(baseURLUsers);
                if (response.ok) {
                    const users = yield response.json();
                    return users.some(user => user.username === username);
                }
                else {
                    throw new Error('Failed to fetch users');
                }
            }
            catch (error) {
                console.error('Error checking username:', error);
                return false;
            }
        });
    }
}
let register = new Register();
register.getUserValues();
