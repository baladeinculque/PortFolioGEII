// Charger les traductions en fonction de la langue sélectionnée
async function loadTranslations(lang) {
    try {
        const response = await fetch('content.json');
        const translations = await response.json();
        
        document.querySelectorAll("[data-key]").forEach(element => {
            const key = element.getAttribute("data-key");
            if (translations[key] && translations[key][lang]) {
                element.innerHTML = translations[key][lang].replace(/\n/g, '<br>');
            }
        });
    } catch (error) {
        console.error("Erreur lors du chargement des traductions :", error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    fetch("footer.html") // Charge le fichier footer.html
        .then(response => response.text()) // Convertit la réponse en texte HTML
        .then(html => {
            document.getElementById("footerContainer").innerHTML = html; // Insère le HTML dans la page principale
            
            // Appliquer la traduction après insertion du footer
            const lang = localStorage.getItem('lang') || "fr";
            loadTranslations(lang);
        })
        .catch(error => console.error("Erreur lors du chargement du footer :", error));

    // Gérer le changement de langue
    const toggleButton = document.getElementById('toggleButton');
    if (toggleButton) {
        toggleButton.value = localStorage.getItem('lang') || "fr";
        loadTranslations(toggleButton.value);

        toggleButton.addEventListener('change', function() {
            localStorage.setItem('lang', toggleButton.value);
            loadTranslations(toggleButton.value);
        });
    }
});

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const response = await fetch("resources.json");
        const data = await response.json();
        const resources = data.resources;

        // 🎯 1. Auto-remplissage des liens avec resource-key
        document.querySelectorAll("a[resource-key]").forEach(link => {
            const key = link.getAttribute("resource-key");
            const resource = resources.find(res => res["resource-key"] === key);

            if (resource) {
                link.textContent = resource.title; // Affiche le titre
                link.href = resource.url; // Met l'URL
                link.target = "_blank"; // Ouvre dans un nouvel onglet
            } else {
                console.warn(`Ressource non trouvée pour resource-key="${key}"`);
            }
        });

        // 🎯 2. Affichage de la liste des ressources filtrables
        const resourceListContainer = document.getElementById("resourceList");
        const categoryFilter = document.getElementById("categoryFilter");

        // Fonction pour afficher les ressources filtrées
        function displayResources(filterCategory = "all") {
            resourceListContainer.innerHTML = ""; // Vide la liste

            const filteredResources = (filterCategory === "all") 
                ? resources 
                : resources.filter(res => res.category === filterCategory);

            if (filteredResources.length === 0) {
                resourceListContainer.innerHTML = "<p>Aucune ressource trouvée.</p>";
                return;
            }

            filteredResources.forEach(resource => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<a href="${resource.url}" target="_blank">${resource.title}</a>`;
                resourceListContainer.appendChild(listItem);
            });
        }

        // Générer les options du filtre
        const categories = [...new Set(resources.map(res => res.category))];
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category === "all" ? "Toutes les catégories" : category;
            categoryFilter.appendChild(option);
        });

        // Écouteur pour changer la catégorie
        categoryFilter.addEventListener("change", (e) => {
            displayResources(e.target.value);
        });

        // Affichage initial
        displayResources();
    } catch (error) {
        console.error("Erreur lors du chargement des ressources JSON :", error);
    }
});

// Affichage dynamique du menu responsive
function toggleList() {
    const list = document.getElementById('responsive-list');
    if (list) {
        list.style.display = (list.style.display === 'none' || list.style.display === '') ? 'flex' : 'none';
    }
}

// Réajuster le menu en fonction de la taille de l’écran
window.addEventListener('resize', () => {
    const list = document.getElementById('responsive-list');
    if (list) {
        list.style.display = (window.innerWidth > 768) ? 'flex' : 'none';
    }
});

function showModal(modalID) {
    document.getElementById(modalID).classList.remove("hidden");
}
function closeModal(modalID) {
    document.getElementById(modalID).classList.add("hidden");
}
const cvLink = document.getElementById("cvLink");

  // Fonction pour mettre à jour le lien en fonction de la langue sélectionnée
  function updateCVLink() {
    if (toggleButton.value === "fr") {
      cvLink.href = "assets/documents/CV_CédricRouillé.pdf";
    } else if (toggleButton.value === "en") {
      cvLink.href = "assets/documents/CV_CédricRouillé_en.pdf";
    }
  }

  // Écouteur d'événements pour détecter le changement de langue
  toggleButton.addEventListener("change", updateCVLink);

  // Initialisation du lien au chargement de la page
  updateCVLink();