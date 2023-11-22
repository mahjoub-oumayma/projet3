// Variable à afficher pour le mode éditeur
const modeEdition = document.querySelector("#admin-logged");
const editBtn = document.querySelector("#figure-modify");
const logout = document.querySelector('[href="login.html"]');
const filters = document.querySelector(".Filtres");

// Si nous avons récupéré le token
if (getAuthorization()) {
    modeEdition.style.display = "flex";
    editBtn.style.display = "flex";

    //hider les boutons filtres
    filters.style.display = "none";

    // Changer login en logout
    logout.textContent = "logout";
    logout.setAttribute("href", "#");

    // Lorque l'on click sur logout cela déconnecte l'utilisateur
    logout.addEventListener("click", event => {
        event.preventDefault();
        // enlever token
        localStorage.removeItem("token");
        //refresh index.html
        window.location.reload();
    });
} else {
    //reset mode
    modeEdition.style.display = "none";
    editBtn.style.display = "none";
}

// fonction pour récuperer l'id utilisateur et le token
function getAuthorization() {
    if (localStorage.getItem('token')) {
        const token = JSON.parse(localStorage.getItem('token')).token;
        return 'Bearer ' + token;
    } else {
        return false;
    }

}
