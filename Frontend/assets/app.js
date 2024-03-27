// Définir l'URL de l'API
const apiWork = fetch('http://localhost:5678/api/works').then((response) => response.json());
const apiCategory = fetch('http://localhost:5678/api/categories').then((response) => response.json());
const gallery = document.getElementById('gallery');
const filterDiv = document.getElementById('filter_list');
const filterElement = document.querySelectorAll('.filter_list');
const loginContent = document.getElementById('loginContent');
const loginButton = document.getElementById('loginUl');
const EditorHeader = document.getElementById('editor-mode');
const body = document.getElementById('body');
const EditorModeButton = document.getElementById('EditorMode');
const filterList2 = []
let token = localStorage.getItem("token");
// Créer l'affichage des projets.
const createGallery = (data) => {
    for (let i = 0; i < data.length; i++) {
        const figure = document.createElement('figure');
        figure.id = data[i].category.id
        gallery.appendChild(figure)
        const image = document.createElement('img');
        figure.appendChild(image);
        image.src = data[i].imageUrl
        const text = document.createElement('figcaption');
        figure.appendChild(text);
        text.innerHTML = data[i].title
    }
}
// Créer la liste des filtres ainsi que leurs evenements.
const createFilterList = (filterList) => {
    newElementFilter('p', filterDiv, 'filterText', "Tous", "0")
    filterList2[0].classList.add('filterTextSelected')
    for (let i = 0; i < filterList.length ; i++) {
        newElementFilter('p', filterDiv, 'filterText', filterList[i].name, filterList[i].id)
    }
    filterList2.forEach(element => {
        element.addEventListener("click", () => {
            filterList2.forEach(element => {
                element.classList.remove('filterTextSelected');
            })
            element.classList.add('filterTextSelected');
            filterChoose(element.id)
        })
    })
}
// Créer un nouvel élément.
const newElementFilter = (element, parent, classToAdd, name, id) => {
    let filterText = document.createElement(element);
    parent.appendChild(filterText)
    filterText.innerHTML = name
    filterText.classList.add(classToAdd)
    filterText.id = id
    filterList2.push(filterText)
}
// Trier les éléments par filtres.
const filterChoose = (choose) => {
    if (choose !== 0 && choose > 0) {
        for (let child of gallery.children) {
            child.style.display = 'block';
            if (child.getAttribute('id') !== choose) {
                child.style.display = 'none';
            }
        }
    } else {
        for (let child of gallery.children) {
            child.style.display = 'block';
        }
    }
}

// Ajout de l'affichage du mode éditeur
const editorMod = () => {
    const divEdit = document.createElement('div')
    divEdit.classList.add('editor-mode')
    const fasFadivEdit = document.createElement('i')
    fasFadivEdit.classList.add('fa-regular')
    fasFadivEdit.classList.add('fa-pen-to-square')
    divEdit.appendChild(fasFadivEdit)
    const textdivEdit = document.createElement('p')
    textdivEdit.innerHTML = 'Mode édition'
    divEdit.appendChild(textdivEdit)
    body.insertBefore(divEdit, body.firstChild)
}

// Fetch des différents lien d'api
Promise.all([apiWork, apiCategory])
.then(([data1, data2]) => {
    createGallery(data1)
    createFilterList(data2)
    
    loginButton.addEventListener('click', () => {
        if(token) {
            localStorage.removeItem("token");
            loginButton.innerHTML = 'login';
            window.location.href = '';
        } else {
            window.location.href = './login.html';
        }
        });
        if(token) {
            loginButton.innerHTML = 'logout';
            editorMod()
            EditorModeButton.style.display = 'inline'
        }
        
    })

    // En cas d'erreur
    .catch(error => {
        console.log("Une erreur est survenue :", error)
    });