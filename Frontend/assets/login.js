const apiLogin = 'http://localhost:5678/api/users/login'
const loginUl = document.getElementById('loginUl')
const errorMessage = document.getElementById("error_message")
const inputs = document.querySelectorAll("input");
const loginBtn = document.querySelector(".form");
const form = document.querySelector("form");
let existingError = false
let messageOfError = ''

const Error = (errorName, id) => {
    if(!existingError) {
        let errorValue = document.createElement('p')
        errorMessage.appendChild(errorValue)
        errorValue.innerHTML = errorName
        errorValue.id = id
        messageOfError = errorValue
        existingError = true
    } else {
        messageOfError.innerHTML = errorName
    }
}

loginUl.addEventListener('click', () => {
    window.location.href = './index.html'
})


loginBtn.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = event.target.email.value
    const password = event.target.password.value
    const res = await fetch(apiLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        window.location.href = "./index.html"
    } else {
        if(res.status === 404) {
            errorMessage.style.display = 'flex';
            Error("Nom d'utilisateur invalide.")
        } else if (res.status === 401) {
            errorMessage.style.display = 'flex';
            Error("Mot de passe invalide.")
        }
        
    }

});