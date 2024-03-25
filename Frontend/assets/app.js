// Définir l'URL de l'API
const apiUrl = 'http://localhost:5678/api/works';
const gallery = document.getElementById('gallery');
const filterDiv = document.getElementById('filter_list');
const filterElement = document.querySelectorAll('.filter_list');
const filterList = [
    {
        "text": "Tous",
        "id": "0",
    }, 
    {
        "text": "Objets",
        "id": "1",
    },
    { 
        "text": "Appartements",
        "id": "2",
    },
    {
        "text": "Hotels & restaurants",
        "id": "3",
    },
]
const filterList2 = []
const filterChoose = (choose) => {
    console.log(choose)
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


fetch(apiUrl)
    .then(resp => {
        // Vérifier si la requête a abouti
        if (!resp.ok) {
            throw new Error('La requête a échoué');
        }
        // Convertir la réponse en JSON
        return resp.json();
    })

    // Traitement de donnée
    .then(data => {
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
            console.log(data[i].category.id)
        }

        for (let i2 = 0; i2 < filterList.length; i2++) {
            let filterText = document.createElement('p');
            filterDiv.appendChild(filterText)
            filterText.innerHTML = filterList[i2].text
            filterText.classList.add('filterText')
            if(i2 === 0){
                filterText.classList.add('filterTextSelected')
            }
            filterList2.push(filterText)
        
            filterText.addEventListener("click", () => {
                filterList2.forEach(element => {
                    element.classList.remove('filterTextSelected');
                });
                filterText.classList.add('filterTextSelected');
                filterChoose(filterList[i2].id)
            });
        }
    })

    // En cas d'erreur
    .catch(error => {
        const figure = document.createElement('figure');
        gallery.appendChild(figure)
        const text = document.createElement('figcaption');
        figure.appendChild(text);
        text.innerHTML = ("Une erreur est survenue :", error)
    });