/** Constantes **/
const gallerySection = document.querySelector(".gallery");
const filtreSection = document.querySelector(".projet");
const boutonSection = document.getElementById("filtres");

/********************************************
 Partie dédié à l'affichage des projets
*********************************************/
function afficherProjet(work) {
  // créer balise figure
  const figure = document.createElement("figure");
  figure.id = "figure" + `${work.id}`;
  //rajouter balise img
  const img = document.createElement("img");
  //rajouter balise figCaption
  const figCaption = document.createElement("figcaption");

  img.src = `${work.imageUrl}`;
  img.alt = `${work.title}`;
  figure.appendChild(img);
  figCaption.innerHTML = `${work.title}`;
  figure.setAttribute('category-id', `${work.categoryId}`);
  figure.appendChild(figCaption)

  return figure;
}
//Appel API Works
const oWorks = getOWorks("main");

/********************************************
 Partie dédié à l'affichage des boutons
*********************************************/
function afficherTousBouton() {
  //bouton tous
  let divTous = document.createElement("button");
  //rajout classe CSS tous
  divTous.classList.add("buttonStyle");
  //css selectionée par defaut
  divTous.classList.add("selected");
  //rajout du texte du bouton
  divTous.textContent = "Tous";
  divTous.addEventListener("click", function () {
    enleverAllSelection();
    //appliquer css selected sur ce bouton
    this.classList.add('selected');
    //filtrer
    let oFilter = {
      id: 0,
      name: "Tous"
    }
    filtrerProjetsParCategorie(oFilter);
  });

  //rajout du bouton sous le div
  boutonSection.appendChild(divTous)
}

function afficherAutresBoutons(categorie) {
  let divCatButton = document.createElement("button");
  divCatButton.classList.add("buttonStyle");
  divCatButton.textContent = `${categorie.name}`;
  divCatButton.addEventListener("click", function () {
    enleverAllSelection();
    //appliquer css selected sur ce bouton
    this.classList.add('selected');
    //filtrer
    let oFilter = {
      id: `${categorie.id}`,
      name: `${categorie.name}`
    }
    filtrerProjetsParCategorie(oFilter);
  });

  return divCatButton;
}

//Appel API Categories
const oCategories = getOCategories("main");

//fonction qui eneleve le CSS sélection de tous les boutons
function enleverAllSelection() {
  const boutons = document.querySelectorAll('.buttonStyle');
  boutons.forEach((bouton) => {
    bouton.classList.remove('selected');
  });

}
/********************************************
 Filtrer les projets par catégorie
*********************************************/
function filtrerProjetsParCategorie(oFilter) {
  const elements = document.querySelectorAll('div.gallery figure');
  elements.forEach((element) => {
    const categoryId = element.getAttribute('category-id');
    switch (oFilter.id) {
      case 0:
        element.style.display = 'block';
        break;
      default:
        if (categoryId === oFilter.id) {
          element.style.display = 'block';
        } else {
          element.style.display = 'none';
        }
        break;
    }
  });
}


/*************************************************************
********* déclaration des fonctions d'appels API *************
**************************************************************/

// fonction récup works
/* sTarget pour modifier la gallerySection sinon
retoruner simplement les data*/
async function getOWorks(sTarget) {
  const response = await fetch('http://localhost:5678/api/works');
  const data = await response.json();
  if (sTarget === "main") {
    data.forEach((work) => {
      let figure = afficherProjet(work);
      gallerySection.appendChild(figure);
    });
  }
  return data;
}


//fonction récup Categories
/* sTarget pour modifier la boutonSection sinon
retoruner simplement les data*/
async function getOCategories(sTarget) {
  const response = await fetch('http://localhost:5678/api/categories');
  const data = await response.json();
  afficherTousBouton();
  if (sTarget === "main") {
    data.forEach((categorie) => {
      let bouton = afficherAutresBoutons(categorie);
      boutonSection.appendChild(bouton);
    });
  }
  return data;
}
/***********************************************************************/

//smooth scrolling projet + contact
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
      });
  });
});












