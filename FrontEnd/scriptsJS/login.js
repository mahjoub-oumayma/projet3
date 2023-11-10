const login         = document.querySelector(".form-login");
const messageError  = document.querySelector("#msg-error");
const submibtn      = document.querySelector("#btnSubmit");
/*** se connecter lorsque l'on clique sur le bouton */

submibtn.addEventListener("click", function (event) {
    event.preventDefault();

    /** validation de formulaire */

    if (login.email.value === "" || login.password.value === "") {
        messageError.style.display = "flex";
    }
    else {
        messageError.style.display = "none";
    };

    /***appel des API */
    let oBody =  JSON.stringify({
        email:    login.email.value,
        password: login.password.value,
    });
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: oBody
    }).then((response) => response.json()).then((data) => {
            // Stocker les informations d'authentification et rediriger
            const token = localStorage.setItem('token', JSON.stringify(data));
            const auth = JSON.parse(localStorage.getItem('token'));
            if (auth && auth.token) {
                window.location = "index.html";
            } else {
                messageError.style.display = "flex";
            }
        }).catch((error) => {
            console.error('Error:', error);
            messageError.style.display = "flex";
        });
});
