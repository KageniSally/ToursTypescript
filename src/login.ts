const baseURLUsersLogin: string = "http://localhost:3000/users";



class Login {
    getValues() {
        // Get values from inputs
        const usernameInput = document.getElementById("username-inp") as HTMLInputElement;
        const passwordInput = document.getElementById("password-inp") as HTMLInputElement;
        const btnLogin = document.getElementById("btn-login") as HTMLButtonElement;

        const messageDiv = document.querySelector(".auth-message") as HTMLElement;

        btnLogin.addEventListener('click', async (e) => {
            e.preventDefault();

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            // Hide previous messages
            messageDiv.style.display = 'none';
            messageDiv.innerHTML = '';

            // Validate inputs
            if (this.validate(username, password)) {
                try {
                    const userExists = await this.checkUserExists(username, password);

                    if (userExists) {
                        sessionStorage.setItem("username", username);

                        const isAdmin = await this.checkUserRole(username);
                        if (!isAdmin) {
                            window.location.href = "index.html";
                        } else {
                            window.location.href = "adminDashboard.html";
                        }
                    } else {
                        messageDiv.style.display = 'block';
                        messageDiv.innerHTML = `<p class="message-p">Login Failed: Invalid username or password</p>`;
                    }
                } catch (error) {
                    messageDiv.style.display = 'block';
                    messageDiv.innerHTML = `<p class="message-p">Login Failed: An error occurred</p>`;
                }
            } else {
                messageDiv.style.display = 'block';
                messageDiv.innerHTML = `<p class="message-p">Login Failed: Please enter both username and password</p>`;
            }
        });
    }

    private validate(username: string, password: string): boolean {
        return username !== "" && password !== "";
    }

    private async checkUserExists(username: string, password: string): Promise<boolean> {
        try {
            const response = await fetch(baseURLUsersLogin);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const users: { username: string, password: string }[] = await response.json();
            const user = users.find(user => user.username === username);

            return user !== undefined && user.password === password;
        } catch (error) {
            console.error('Error checking user:', error);
            return false;
        }
    }

    private async checkUserRole(username: string): Promise<boolean> {
        try {
            const response = await fetch(baseURLUsersLogin);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const users: { username: string, role: string }[] = await response.json();
            const user = users.find(user => user.username === username);

            if (!user || user.role !== 'admin') {

                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking user role:', error);
            return false;
        }
    }
}

const login = new Login();
login.getValues();
