const tableau = document.querySelector('#tableau');

/* ─────────────────────────
   DONNÉES INITIALES
───────────────────────── */

const DONNEES_INITIALES = [
  {
    id: 'col-todo',
    titre: 'À faire',

    cartes: [
      {
        id: 'c-1',

        titre:
          'Lire la documentation MDN sur Drag and Drop',

        description:
          'Étudier dragstart, dragover et drop.',

        priorite: 'haute',

        dateCreation: '2025-05-01'
      },

      {
        id: 'c-2',

        titre:
          'Configurer l’environnement de développement',

        description:
          'Préparer les fichiers HTML, CSS et JS.',

        priorite: 'moyenne',

        dateCreation: '2025-05-02'
      },

      {
        id: 'c-3',

        titre:
          'Concevoir la structure HTML du tableau',

        description:
          'Définir les classes CSS et les identifiants.',

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

        titre:
          'Implémenter la logique de drag and drop',

        description:
          'Gérer les événements et le transfert.',

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

        titre:
          'Définir le modèle de données',

        description:
          'Structure des colonnes validée.',

        priorite: 'basse',

        dateCreation: '2025-04-28'
      }
    ]
  }
];

/* ─────────────────────────
   ÉTAT GLOBAL
───────────────────────── */

let etat = {
  colonnes: structuredClone(DONNEES_INITIALES)
};

/* Carte actuellement déplacée */
let carteEnCours = null;

/* ─────────────────────────
   RENDU DU TABLEAU
───────────────────────── */

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

  el.dataset.colonneId = colonne.id;

  el.innerHTML = `
    <div class="colonne-header">

      <span class="colonne-titre">
        ${colonne.titre}
      </span>

      <span class="colonne-compteur">
        ${colonne.cartes.length}
      </span>

    </div>

    <div
      class="liste-cartes"
      data-colonne-id="${colonne.id}"
    ></div>

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

  el.className =
    `carte priorite-${carte.priorite}`;

  el.dataset.carteId = carte.id;

  el.draggable = true;

  el.innerHTML = `
    <p class="carte-titre">
      ${carte.titre}
    </p>

    ${
      carte.description
      ? `
        <p class="carte-description">
          ${carte.description}
        </p>
      `
      : ''
    }

    <div class="carte-footer">

      <span
        class="badge-priorite priorite-${carte.priorite}"
      >
        ${carte.priorite}
      </span>

      <button
        class="btn-supprimer"
      >
        ✕
      </button>

    </div>
  `;

  return el;

}

/* ─────────────────────────
   FORMULAIRE AJOUT
───────────────────────── */

tableau.addEventListener('click', (e) => {

  const btnAjouter =
    e.target.closest('.btn-ajouter');

  if (btnAjouter) {

    const colonneId =
      btnAjouter.dataset.colonneId;

    afficherFormulaireAjout(colonneId);

  }

});

function afficherFormulaireAjout(colonneId) {

  const colEl = tableau.querySelector(
    `[data-colonne-id="${colonneId}"]`
  );

  const btnAjouter =
    colEl.querySelector('.btn-ajouter');

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

  colEl.appendChild(form);

  form.querySelector('.input-titre').focus();

  form.querySelector('.btn-annuler')
    .addEventListener('click', () => {

      form.remove();

      btnAjouter.style.display = '';

    });

}

/* ─────────────────────────
   DRAG & DROP
───────────────────────── */

/* dragstart */
tableau.addEventListener('dragstart', (e) => {

  const carteEl =
    e.target.closest('.carte');

  if (!carteEl) return;

  carteEnCours =
    carteEl.dataset.carteId;

  e.dataTransfer.setData(
    'text/plain',
    carteEnCours
  );

  e.dataTransfer.effectAllowed = 'move';

  /* Retour visuel */
  setTimeout(() => {

    carteEl.classList.add('en-deplacement');

  }, 0);

});

/* dragend */
tableau.addEventListener('dragend', (e) => {

  const carteEl =
    e.target.closest('.carte');

  if (carteEl) {

    carteEl.classList.remove('en-deplacement');

  }

  carteEnCours = null;

  document
    .querySelectorAll('.colonne.depot-actif')
    .forEach(colonne => {

      colonne.classList.remove('depot-actif');

    });

});

/* dragover */
tableau.addEventListener('dragover', (e) => {

  e.preventDefault();

  e.dataTransfer.dropEffect = 'move';

  const colonneEl =
    e.target.closest('.colonne');

  document
    .querySelectorAll('.colonne.depot-actif')
    .forEach(colonne => {

      colonne.classList.remove('depot-actif');

    });

  if (colonneEl) {

    colonneEl.classList.add('depot-actif');

  }

});

/* dragleave */
tableau.addEventListener('dragleave', (e) => {

  if (
    !e.relatedTarget ||
    !tableau.contains(e.relatedTarget)
  ) {

    document
      .querySelectorAll('.colonne.depot-actif')
      .forEach(colonne => {

        colonne.classList.remove('depot-actif');

      });

  }

});

/* ─────────────────────────
   INITIALISATION
───────────────────────── */

afficherTableau();