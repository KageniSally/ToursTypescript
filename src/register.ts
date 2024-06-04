let baseURLUsers: string = 'http://localhost:3000/users';

enum Role {
    Admin = "admin",
    Customer = "customer",
}

interface User {
    email: string;
    username: string;
    password: string;
    role: Role;
}

class Register {
    async getUserValues() {
        const usernameInput = document.getElementById("username") as HTMLInputElement;
        const emailInput = document.getElementById("email") as HTMLInputElement;
        const passwordInput = document.getElementById("password") as HTMLInputElement;
        const confPasswordInput = document.getElementById("confpassword") as HTMLInputElement;
        const registerBtn = document.getElementById("btn-reg") as HTMLButtonElement;

        const messageDiv = document.querySelector(".auth-message") as HTMLElement;

        registerBtn.addEventListener('click', async (e) => {
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
                    const usernameExists = await this.checkUsernameExists(username);
                    if (usernameExists) {
                        messageDiv.style.display = 'block';
                        messageDiv.innerHTML = `<p class="message-p">Username already exists. Please choose another one.</p>`;
                        return;
                    }

                    const response = await fetch(baseURLUsers, {
                        method: "POST",
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(userData)
                    });

                    if (response.ok) {
                        window.location.href = "login.html";
                    } else {
                        messageDiv.style.display = 'block';
                        messageDiv.innerHTML = `<p class="message-p">Registration Failed</p>`;
                    }
                } catch (error) {
                    messageDiv.style.display = 'block';
                    messageDiv.innerHTML = `<p class="message-p">Registration Failed</p>`;
                }
            } else {
                messageDiv.style.display = 'block';
                messageDiv.innerHTML = `<p class="message-p">${validationMessage}</p>`;
            }
        });
    }

    private validate(email: string, username: string, password: string, confPassword: string): string {
        if (email === "" || username === "" || password === "" || confPassword === "") {
            return "All fields are required";
        } else if (password !== confPassword) {
            return "Passwords do not match";
        } else if (password.length < 8) {
            return "Password must be at least 8 characters long";
        } else {
            return "valid";
        }
    }

    private async checkUsernameExists(username: string): Promise<boolean> {
        try {
            const response = await fetch(baseURLUsers);
            if (response.ok) {
                const users: User[] = await response.json();
                return users.some(user => user.username === username);
            } else {
                throw new Error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error checking username:', error);
            return false;
        }
    }
}



let register = new Register();
register.getUserValues();
