// Variables pour la modal suppression de projets
const modalDeleteWork = document.querySelector("#modal-works");
const openGalleryModalBtn = document.querySelector("#figure-modify");
const closeGalleryModalBtn = document.querySelector(".modal-close");
const galleryModal = document.querySelector(".modal-content");

// Variables pour la modal ajout de projets
const modalAddWork = document.querySelector("#modal-edit");
const openAddWork = document.querySelector("#modal-edit-add");
const previousBtn = document.querySelector("#precedent");
const closeAddWorkModalBtn = document.querySelector("#button-to-close-second-window");
const categorySelect = document.querySelector("#modal-photo-category");

// Variables pour upload une image
const uploadImageInput = document.querySelector("#form-image");
const projectUpload = document.querySelector("#previewImage");
const uploadContent = document.querySelector("#modal-edit-new-photo");
const submitProjet = document.querySelector("#validerAjout");
const backgroundPreview = document.querySelector(".AjoutPhotoContainer");

const addProjectForm = document.querySelector("#ajout-form");

// Variable pour background modal
const backgroundModal = document.querySelector("#modal");

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
    if(galleryModal.firstChild){
        galleryModal.innerHTML = "";
    }
    
}

function closeAddWorkModal() {
    modalAddWork.style.display = "none";
    backgroundModal.style.display = "none";
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

// Fermer les modals et précédent
closeGalleryModalBtn.addEventListener("click", event => {
    event.preventDefault();
    closeGalleryModal();
});

closeAddWorkModalBtn.addEventListener("click", event => {
    event.preventDefault();
    closeAddWorkModal();
});

previousBtn.addEventListener("click", event => {
    event.preventDefault();
    closeAddWorkModal();
    openGalleryModal();
    addWorkModal();
});

window.onclick = function (event) {
    if (event.target == backgroundModal) {
        closeAddWorkModal();
        closeGalleryModal();
    }
}


// // Supprimer des photos
function deleteWork(event, id) {
    alert("supression projet ID: " + id);
}
 

// Ajout des événements pour gérer l'upload de photos
uploadImageInput.addEventListener("change", event => {
    uploadImage();
});

// addProjectForm.addEventListener("submit", event =>{
//     event.preventDefault();
//     handleFormSubmit();
// });

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
        // submitProjet.style.backgroundColor = "#1D6154";
        projectUpload.style.display = "block";
        backgroundPreview.style.backgroundColor = "#FFFFFF";
        reader.readAsDataURL(uploadImageInput.files[0]);
        projectUpload.appendChild(image);
    }
}


function addWorkModal() {
    const fragment = document.createDocumentFragment();
    const works = JSON.parse(localStorage.getItem('worksedit'));
    works.forEach((work) => {
        const div = document.createElement('div');
        div.id = "gallery_edit_img";

        const img = document.createElement('img');
        img.src = work.imageUrl;
        img.crossOrigin = 'anonymous';
        div.appendChild(img);

        const i = document.createElement('i');
        i.setAttribute("class", "fa fa-trash");
        i.setAttribute("data-id", work.id);
        i.setAttribute("onclick", "deleteWork(this, " + work.id + ")");
        div.appendChild(i);

        const p = document.createElement('p');
        p.setAttribute("data-id", work.id);
        div.appendChild(p);

        fragment.appendChild(div);
    });
    galleryModal.appendChild(fragment);
}

function setCategoriesSelect() {

    const categories = JSON.parse(localStorage.getItem('categoriesModal'));
    categories.forEach((category) => {
        let divCatOption = document.createElement("option");
        divCatOption.value = `${category.id}`;
        divCatOption.text = `${category.name}`;
        categorySelect.add(divCatOption);
    });
}