// Variables pour la modal suppression de projets
const modalDeleteWork = document.querySelector("#modalsSuppr");
const openGalleryModalBtn = document.querySelector("#figure-modify");
const closeGalleryModalBtn = document.querySelector(".fermer");
const galleryModal = document.querySelector(".gallerymodal");

// Variables pour la modal ajout de projets
const modalAddWork = document.querySelector("#modalsAjout");
const openAddWork = document.querySelector("#AjoutPhoto");
const previousBtn = document.querySelector(".precedent");
const closeAddWorkModalBtn = document.querySelector("#fermer-ajout");
const categorySelect = document.querySelector("#selectCategorie");

// Variables pour upload une image
const uploadImageInput = document.querySelector("#imageUpload");
const projectUpload = document.querySelector("#previewImage");
const uploadContent = document.querySelector("#previewdetails");
const submitProjet = document.querySelector("#validerAjout");
const backgroundPreview = document.querySelector(".AjoutPhotoContainer");

//variable input titre
const inputTitle = document.querySelector("#titreAjout");

//Variable pour le form
const addProjectForm = document.querySelector("#ajout-form");

// Variable pour background modal
const backgroundModal = document.querySelector("#modals");

// Fonction pour ouvrir modal galerie pour supprimer un projet et celle pour ajouter un projet
function openGalleryModal() {
    modalDeleteWork.style.display = "flex";
    backgroundModal.style.display = "block";
    addWorkModal();
}

function openAddWorkModal() {
    modalAddWork.style.display = "flex";
    backgroundModal.style.display = "block";
}

// Fonction pour fermeture des modals
function closeGalleryModal() {
    modalDeleteWork.style.display = "none";
    backgroundModal.style.display = "none";
    if (projectUpload.firstChild) {
        projectUpload.innerHTML = "";
        uploadContent.style.display = "flex";
    }
    if (galleryModal.firstChild) {
        galleryModal.innerHTML = "";
    }

    // reset form
    submitProjet.style.backgroundColor = "#A7A7A7";
    addProjectForm.reset();

}
//fonction fermer modal
function closeAddWorkModal() {
    modalAddWork.style.display = "none";
    backgroundModal.style.display = "none";
    categorySelect.innerHTML = "";
}

// Ouvrir les modals
if (openGalleryModalBtn) {
    openGalleryModalBtn.addEventListener("click", event => {
        event.preventDefault();
        openGalleryModal();
    });
}
if (openAddWork) {
    openAddWork.addEventListener("click", event => {
        event.preventDefault();
        closeGalleryModal();
        setCategoriesSelect();
        openAddWorkModal();
    });
}

// Fermer X event
closeGalleryModalBtn.addEventListener("click", event => {
    event.preventDefault();
    closeGalleryModal();
});

//bouton fermer X event
closeAddWorkModalBtn.addEventListener("click", event => {
    event.preventDefault();
    closeAddWorkModal();
});

// bouton précedent du 2ieme modal event
previousBtn.addEventListener("click", event => {
    event.preventDefault();
    closeAddWorkModal();
    openGalleryModal();
});


//event lors de la modif du titre
inputTitle.addEventListener("input", (event) => {
    verifValidityForm();
});

//fermer modal quand on click en dehors du modal
window.onclick = function (event) {
    if (event.target == backgroundModal) {
        closeAddWorkModal();
        closeGalleryModal();
        // reset form
        submitProjet.style.backgroundColor = "#A7A7A7";
        addProjectForm.reset();
    }
}

// fonction rajouter les works dans le modal
function addWorkModal() {
    const fragment = document.createDocumentFragment();
    //Appel function récup Works 
    const oWorks = getOWorks("");
    //rajout des works dans le content
    oWorks.then(works => {
        works.forEach((work) => {
            const div = document.createElement('div');
            div.id = "gallery_edit_img" + work.id;
            div.setAttribute("class", "gallery_edit_img");

            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.crossOrigin = 'anonymous';
            img.title = work.title;
            div.appendChild(img);

            const i = document.createElement('i');
            i.setAttribute("class", "fa fa-trash");
            i.setAttribute("data-id", work.id);
            i.addEventListener("click", event => {
                event.preventDefault();
                deleteWork(work);
            });

            div.appendChild(i);
            fragment.appendChild(div);
        })
        galleryModal.appendChild(fragment);
    });
}



//fonction rajouter les categories dans le selectOption
function setCategoriesSelect() {
    //Appel function récup Ctegories
    const oCategories = getOCategories("");
    //insert categories dans le selectOption
    oCategories.then(categories => {
        categories.forEach((category) => {
            let divCatOption = document.createElement("option");
            divCatOption.value = `${category.id}`;
            divCatOption.text = `${category.name}`;
            categorySelect.add(divCatOption);
        })
    });
}



// Supprimer des photos
function deleteWork(work) {
    let text = "Voulez vous supprimer le projet:  " + work.title + "  ?";
    //pop up de confirmation
    if (confirm(text) == true) {
        //Appel API delete
        const sUrl = "http://localhost:5678/api/works/" + work.id;
        fetch(sUrl, {
            method: "DELETE",
            headers: {
                'Accept': 'application/json',
                'Authorization': getAuthorization(),
                'Content-Type': 'application/json',
            },
            params: {
                'id': work.id
            },
        }).then((response) => {
            if (response.ok) {
                //IDs dans modal et figure
                let imgId = "#gallery_edit_img" + work.id;
                let figureId = "#figure" + work.id;
                //recup elements
                const deltedWork = document.querySelector(imgId);
                const deletedFigure = document.querySelector(figureId);
                //Actualisation du DOM
                deltedWork.remove();
                deletedFigure.remove();
            } else {
                throw new Error('Erreur lors de la supression');
            }
        }).catch((error) => {
            console.error('Error Delete:', error);
        });
    }
}

addProjectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    onValiderForm();

});
//ajouter les works via API
async function onValiderForm() {

    // Récupérer les valeurs du formulaire déja vérifiés
    const title = inputTitle.value;
    const category = categorySelect.value;
    const file = uploadImageInput.files[0];

    //form data pour envoyer les données
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", file);
    formData.append("category", category);

    //attendre la réponse pour MAJ DOM
    const resp = await sendnewWork(formData);
    //MAJ DOM sans refresh
    let newFigure = afficherProjet(resp);
    gallerySection.appendChild(newFigure);
    //reset form pour rajout nouvelle photo
    projectUpload.style.display = "flex";
    uploadContent.style.display = "flex";
    backgroundPreview.style.backgroundColor = "#E8F1F6";
    projectUpload.innerHTML = "";
    addProjectForm.reset();


}

// Fonctions pour ajouter des projets
async function sendnewWork(data) {
    const sUrl = "http://localhost:5678/api/works";
    return fetch(sUrl, {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Authorization': getAuthorization()
        },
        body: data
    }).then((response) => {
        return response.json().then((respdata) => {
            alert("Votre projet a été ajouté avec succès");
            return respdata;
        });
    }).catch(error => {
        console.log(error);
        error.json().then((body) => {
            console.log(body);
        });
    });

}
// Ajout des événements pour gérer l'upload de photos
uploadImageInput.addEventListener("change", event => {
    uploadImage();
    verifValidityForm();
});

// Fonction pour afficher l'aperçu de l'image
function uploadImage() {
    if (uploadImageInput.files && uploadImageInput.files[0]) {
        const reader = new FileReader();
        const image = new Image();
        const fileName = uploadImageInput.files[0].name;

        reader.onload = event => {
            image.src = event.target.result;
            image.alt = fileName.split(".")[0];
        };

        uploadContent.style.display = "none";
        projectUpload.style.display = "block";

       // backgroundPreview.style.backgroundColor = "#FFFFFF";
        reader.readAsDataURL(uploadImageInput.files[0]);
        projectUpload.appendChild(image);
    }
}

//vérif si tous les champs sont remplis pour activer le bouton
function verifValidityForm() {
    // Récupérer les valeurs du formulaire
    const title = inputTitle.value;
    const category = categorySelect.value;
    const file = uploadImageInput.files[0];
    if (title != "" && category != "" && file) {
        //activer bouton
        submitProjet.style.backgroundColor = "#1D6154";
    } else {
        submitProjet.style.backgroundColor = "#A7A7A7";
    }
}
