const apiLogin = 'http://localhost:5678/api/users/login'
const loginUl = document.getElementById('loginUl')
const errorMessage = document.getElementById("error_message")
const inputs = document.querySelectorAll("input");
const loginBtn = document.querySelector(".form");
const form = document.querySelector("form");

const Error = (errorName, id) => {
    let existingError = document.getElementById(id)
    if(!existingError) {
        let errorValue = document.createElement('p')
        errorMessage.appendChild(errorValue)
        errorValue.innerHTML = errorName
        errorValue.id = id
    } 
}

loginUl.addEventListener('click', () => {
    window.location.href = './index.html'
})


loginBtn.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = event.target.email.value
    const password = event.target.password.value
    const response = await fetch(apiLogin, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        window.location.href = "./index.html"
    }  else if(email !== response.ok || password !== response.ok) {
        errorMessage.style.display = 'flex';
        Error("Nom d'utilisateur ou mot de passe invalide.")
    }

});