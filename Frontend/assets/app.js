// Définir l'URL des apis
const apiWork = fetch('http://localhost:5678/api/works').then((response) => response.json());
const apiCategory = fetch('http://localhost:5678/api/categories').then((response) => response.json());

// Gallery Const
const Gallery = document.getElementById('gallery');
const filterDiv = document.getElementById('filter_list');
const filterElement = document.querySelectorAll('.filter_list');
const loginContent = document.getElementById('loginContent');
const loginButton = document.getElementById('loginUl');
const body = document.getElementById('body');
const Corp = document.getElementById('container');
let initOk = false

// Editor Const
const EditorHeader = document.getElementById('editor-mode');
const EditorModeButton = document.getElementById('EditorMode');
const adminModale = document.getElementById('adminModale');
const closeAdminModale = document.getElementById('closeIcon');
const closeAdminModale2 = document.getElementById('closeIcon2');
const Gallery2 = document.getElementById('GalleryEdit');

// Add modal
const returnIcon = document.getElementById('returnIcon');
const adminEditModal = document.getElementById('adminEditModal');
const adminAddPicture = document.getElementById('adminAddPicture');
const adminAddModal = document.getElementById('adminAddModal');
const choiceModalAdd = document.getElementById('choiceModalAdd');
const addModalButton = document.getElementById('adminModalSubmit');
const errorAddModal = document.getElementById('error_validateModal');
const adminModaleTitle = document.getElementById('adminModaleTitle');
const adminModaleCategory = document.getElementById('choiceModalAdd');
const formImage = document.getElementById('formImage');
const adminModalpreview = document.getElementById('adminModalpreview');
const adminFileUpload = document.getElementById('adminFileUpload');
const imageModale = document.getElementById('imageModale');
const ModaleForm = document.getElementById('ModaleForm');


const filterList2 = []
let alreadyClickedOnModified = false
let token = localStorage.getItem("token");
// Créer l'affichage des projets.
const createGallery = (data, parent, type) => {
    for (let i = 0; i < data.length; i++) {
        const figure = document.createElement('figure');
        figure.id = data[i].category.id
        parent.appendChild(figure)
        const image = document.createElement('img');
        figure.appendChild(image);
        image.src = data[i].imageUrl
        if (type === 'Text Accepted') {
            const text = document.createElement('figcaption');
            figure.appendChild(text);
            text.innerHTML = data[i].title
        } else if (type === 'Icon Accepted'){
            const icon = document.createElement('i');
            figure.appendChild(icon);
            icon.classList.add('fa-solid')
            icon.classList.add('fa-trash-can')
            icon.id = 'trashcan'
            removeProjet(icon, data[i])
        }
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
        for (let child of Gallery.children) {
            child.style.display = 'block';
            if (child.getAttribute('id') !== choose) {
                child.style.display = 'none';
            }
        }
    } else {
        for (let child of Gallery.children) {
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

// Modification de la galerie
const spawnModifiedBox = (display, height) => {
    adminModale.style.display = display
    adminModale.style.height = height
}

// Remove projet
const removeProjet = (parent, galleryi) => {
    parent.addEventListener('click', () => {
        fetch(`http://localhost:5678/api/works/${galleryi.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}`},
        })
        .then (res => {
            if (res.status === 204) {
                refreshContent(Gallery, "Text Accepted")
                refreshContent(Gallery2, "Icon Accepted")
            } else if (res.status === 401) { // Token inorrect //
                window.location.href = "login.html";
            }
        })
        .catch (error => {
            console.log(error)
        })
    })
}

// Fermeture de la modale
const closeEvent = ([parent1, parent2]) => {
    parent1.addEventListener('click', () => {
        spawnModifiedBox('none')
        adminEditModal.style.display = 'block'
        adminAddModal.style.display = 'none'
    })
    parent2.addEventListener('click', () => {
        spawnModifiedBox('none')
        adminEditModal.style.display = 'block'
        adminAddModal.style.display = 'none'
        deleteImage()
    })
}

// Evenement de changement de display
const changeDisplay = () => {
    adminAddPicture.addEventListener('click', () => {
        adminEditModal.style.display = 'none'
        adminAddModal.style.display = 'block'
    })
    returnIcon.addEventListener('click', () => {
        adminEditModal.style.display = 'block'
        adminAddModal.style.display = 'none'
    })
    adminModale.addEventListener('click', (event) => {
        let targetElement = event.target;
        if(!adminEditModal.contains(targetElement) && !adminAddModal.contains(targetElement)){
            adminAddModal.style.display = 'none'
            adminEditModal.style.display = 'block'
            adminModale.style.display = 'none'
            deleteImage()
        }
    })
}

// Affichage de l'image
const affichageImg = () => {
    adminFileUpload.addEventListener('change', function() {
        let file = this.files[0];
        if (file) {
            formImage.style.display = 'none'
            imageModale.style.display = 'block'
            let reader = new FileReader();
            reader.onload = function(event) {
                imageModale.setAttribute('src', event.target.result);
                imageModale.setAttribute('alt', adminFileUpload.files[0].name);
            };
            reader.readAsDataURL(file);
        }
    });
}

const deleteImage = () => {
    imageModale.style.display = 'none'
    formImage.style.display = 'flex'
    ModaleForm.reset();
}
 
// Refresh Content
const refreshContent = async (parent, choiceText) => {
    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }
    const data = await fetchWork()
    createGallery(data, parent, choiceText)
    deleteImage()
}

async function fetchWork() {
    const response = await fetch('http://localhost:5678/api/works');
    const data = await response.json();
    return data;
}

const updateButtonColor = () => {
    if (adminModaleTitle.value === '' || adminModaleTitle.value === null || adminModaleCategory.value === '0' || adminFileUpload.value === '' || adminFileUpload.value === null) {
        addModalButton.style.backgroundColor = '#A7A7A7';
    } else {
        addModalButton.style.backgroundColor = '#1D6154';
    }
}

adminModaleTitle.addEventListener('input', updateButtonColor)
adminModaleCategory.addEventListener('input', updateButtonColor)
adminFileUpload.addEventListener('input', updateButtonColor)

// Récupéré les différents liens d'apis
Promise.all([apiWork, apiCategory])
        .then(([data1, data2]) => {
            createGallery(data1, Gallery, "Text Accepted")
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
            EditorModeButton.addEventListener('click', () => {
                    spawnModifiedBox('flex')
                    if(!alreadyClickedOnModified) {
                        createGallery(data1, Gallery2, "Icon Accepted")
                        alreadyClickedOnModified = true
                    }
                })
                for(let i = 0; i < data2.length; i++) {
                    const createOptionModalC = document.createElement('option')
                    createOptionModalC.value = data2[i].id
                    createOptionModalC.innerHTML = data2[i].name
                    choiceModalAdd.appendChild(createOptionModalC)
                }
                affichageImg()
                changeDisplay()
                closeEvent([closeAdminModale, closeAdminModale2])
                initOk = true
            })
    
    
        // En cas d'erreur
        .catch(error => {
            console.log("Une erreur est survenue :", error)
        });

// Ajouté un projet
ModaleForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    if(adminModaleTitle.value === '' || adminModaleTitle.value === null || adminModaleCategory.value === '0' || adminFileUpload.value === '' || adminFileUpload.value === null){
        errorAddModal.style.display = 'block'
        addModalButton.style.backgroundColor = '#A7A7A7'
    }else {
        errorAddModal.style.display = 'none'
        try {
            let newProjet = new FormData();
            newProjet.append("title", adminModaleTitle.value);
            newProjet.append("image", adminFileUpload.files[0]);
            newProjet.append("category", adminModaleCategory.value);

            const response = await fetch(`http://localhost:5678/api/works`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: newProjet
            });

            if (!response.ok) {
                console.log("Error", response);
            } else {
                ModaleForm.reset()
                adminEditModal.style.display = 'block'
                adminAddModal.style.display = 'none'
                await refreshContent(Gallery, "Text Accepted")
                await refreshContent(Gallery2, "Icon Accepted")
            }
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    }
})