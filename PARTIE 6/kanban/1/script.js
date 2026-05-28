const tableau = document.querySelector('#tableau');

/* =========================
   DONNÉES INITIALES
========================= */

const DONNEES_INITIALES = [
  {
    id: 'col-todo',
    titre: 'À faire',

    cartes: [
      {
        id: 'c-1',
        titre: 'Lire la documentation MDN',

        description:
          'Étudier dragstart, dragover et drop.',

        priorite: 'haute',
        dateCreation: '2025-05-01'
      },

      {
        id: 'c-2',
        titre: 'Configurer le projet',

        description:
          'Préparer les fichiers HTML, CSS et JS.',

        priorite: 'moyenne',
        dateCreation: '2025-05-02'
      },

      {
        id: 'c-3',
        titre: 'Concevoir le tableau',

        description:
          'Définir la structure des colonnes.',

        priorite: 'basse',
        dateCreation: '2025-05-03'
      }
    ]
  },

  {
    id: 'col-inprogress',
    titre: 'En cours',

    cartes: [
      {
        id: 'c-4',
        titre: 'Implémenter le drag and drop',

        description:
          'Gérer les événements de déplacement.',

        priorite: 'haute',
        dateCreation: '2025-05-04'
      }
    ]
  },

  {
    id: 'col-done',
    titre: 'Terminé',

    cartes: [
      {
        id: 'c-5',
        titre: 'Définir le modèle de données',

        description:
          'Architecture des colonnes validée.',

        priorite: 'basse',
        dateCreation: '2025-04-28'
      }
    ]
  }
];

/* =========================
   ÉTAT GLOBAL
========================= */

let etat = {
  colonnes: structuredClone(DONNEES_INITIALES)
};

/* =========================
   RENDU
========================= */

function afficherTableau() {
  tableau.innerHTML = '';

  etat.colonnes.forEach(colonne => {
    const colonneEl = creerElementColonne(colonne);

    tableau.appendChild(colonneEl);
  });
}

function creerElementColonne(colonne) {
  const el = document.createElement('div');

  el.className = 'colonne';

  el.innerHTML = `
    <div class="colonne-header">

      <span class="colonne-titre">
        ${colonne.titre}
      </span>

      <span class="colonne-compteur">
        ${colonne.cartes.length}
      </span>

    </div>

    <div class="liste-cartes"></div>

    <button
      class="btn-ajouter"
      data-colonne-id="${colonne.id}"
    >
      + Ajouter une carte
    </button>
  `;

  const listeCartes = el.querySelector('.liste-cartes');

  colonne.cartes.forEach(carte => {
    const carteEl = creerElementCarte(carte);

    listeCartes.appendChild(carteEl);
  });

  return el;
}

function creerElementCarte(carte) {
  const el = document.createElement('div');

  el.className = 'carte';

  el.draggable = true;

  /* Couleur priorité */
  if (carte.priorite === 'haute') {
    el.style.borderLeftColor = '#e74c3c';
  }

  if (carte.priorite === 'moyenne') {
    el.style.borderLeftColor = '#f39c12';
  }

  if (carte.priorite === 'basse') {
    el.style.borderLeftColor = '#2ecc71';
  }

  el.innerHTML = `
    <p class="carte-titre">
      ${carte.titre}
    </p>

    <p class="carte-description">
      ${carte.description}
    </p>

    <div class="carte-footer">

      <span class="badge-priorite priorite-${carte.priorite}">
        ${carte.priorite}
      </span>

      <button class="btn-supprimer">
        ✕
      </button>

    </div>
  `;

  return el;
}

/* =========================
   FORMULAIRE AJOUT
========================= */

tableau.addEventListener('click', (e) => {

  const btnAjouter = e.target.closest('.btn-ajouter');

  if (btnAjouter) {
    const colonneId = btnAjouter.dataset.colonneId;

    afficherFormulaireAjout(colonneId);
  }

});

function afficherFormulaireAjout(colonneId) {

  const btnAjouter = tableau.querySelector(
    `[data-colonne-id="${colonneId}"]`
  );

  btnAjouter.style.display = 'none';

  const form = document.createElement('div');

  form.className = 'form-ajout';

  form.innerHTML = `
    <textarea
      class="input-titre"
      placeholder="Titre de la carte..."
    ></textarea>

    <select class="select-priorite">

      <option value="basse">
        Priorité basse
      </option>

      <option value="moyenne" selected>
        Priorité moyenne
      </option>

      <option value="haute">
        Priorité haute
      </option>

    </select>

    <div class="form-boutons">

      <button class="btn-valider">
        Ajouter
      </button>

      <button class="btn-annuler">
        Annuler
      </button>

    </div>
  `;

  btnAjouter.parentElement.appendChild(form);

  form.querySelector('.input-titre').focus();

  form.querySelector('.btn-annuler')
    .addEventListener('click', () => {

      form.remove();

      btnAjouter.style.display = '';
    });
}

/* =========================
   INITIALISATION
========================= */

afficherTableau();