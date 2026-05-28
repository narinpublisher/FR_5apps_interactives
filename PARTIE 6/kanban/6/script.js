// ===================================================
// KANBAN — GESTION DE TÂCHES AVEC PERSISTANCE
// ===================================================

// ---------------------------------------------------
// DONNÉES INITIALES
// ---------------------------------------------------

const DONNEES_INITIALES = [
  {
    id: 'col-todo',
    titre: 'À faire',
    cartes: [
      {
        id: 'c-1',
        titre: 'Lire la documentation MDN sur Drag and Drop',
        description: 'En particulier les événements dragstart, dragover et drop.',
        priorite: 'haute',
        dateCreation: '2025-05-01',
      },
      {
        id: 'c-2',
        titre: 'Configurer l’environnement de développement',
        description: '',
        priorite: 'moyenne',
        dateCreation: '2025-05-02',
      },
      {
        id: 'c-3',
        titre: 'Concevoir la structure HTML du tableau',
        description: 'Définir les classes CSS et les identifiants.',
        priorite: 'basse',
        dateCreation: '2025-05-03',
      },
    ],
  },

  {
    id: 'col-inprogress',
    titre: 'En cours',
    cartes: [
      {
        id: 'c-4',
        titre: 'Implémenter la logique de drag and drop',
        description: 'Gérer les événements et le transfert de données.',
        priorite: 'haute',
        dateCreation: '2025-05-04',
      },
    ],
  },

  {
    id: 'col-done',
    titre: 'Terminé',
    cartes: [
      {
        id: 'c-5',
        titre: 'Définir le modèle de données',
        description: 'Structure des colonnes et des cartes validée.',
        priorite: 'basse',
        dateCreation: '2025-04-28',
      },
    ],
  },
];

// ---------------------------------------------------
// ÉTAT GLOBAL
// ---------------------------------------------------

let etat = {
  colonnes: [],
};

let carteEnCours = null;

// ---------------------------------------------------
// RÉFÉRENCES DOM
// ---------------------------------------------------

const tableau = document.querySelector('#tableau');

// ---------------------------------------------------
// UTILITAIRES
// ---------------------------------------------------

function genererID() {
  return 'carte-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

function trouverColonneDeCarte(carteId) {
  const colonne = etat.colonnes.find(col =>
    col.cartes.some(carte => carte.id === carteId)
  );

  return colonne ? colonne.id : null;
}

function estEtatValide(colonnes) {
  if (!Array.isArray(colonnes)) return false;

  return colonnes.every(colonne => (
    colonne.id &&
    colonne.titre &&
    Array.isArray(colonne.cartes)
  ));
}

// ---------------------------------------------------
// LOCAL STORAGE
// ---------------------------------------------------

function sauvegarderEtat() {
  try {
    const json = JSON.stringify(etat.colonnes);

    localStorage.setItem('kanban-etat', json);
  } catch (erreur) {
    console.error('Erreur sauvegarde :', erreur);
  }
}

function hydraterEtat() {
  const json = localStorage.getItem('kanban-etat');

  if (json === null) {
    etat.colonnes = structuredClone(DONNEES_INITIALES);

    sauvegarderEtat();

    return;
  }

  try {
    const donnees = JSON.parse(json);

    if (!estEtatValide(donnees)) {
      throw new Error('Structure invalide');
    }

    etat.colonnes = donnees;
  } catch (erreur) {
    console.warn('Réinitialisation :', erreur.message);

    etat.colonnes = structuredClone(DONNEES_INITIALES);

    sauvegarderEtat();
  }
}

// ---------------------------------------------------
// RENDU
// ---------------------------------------------------

function afficherTableau() {
  tableau.innerHTML = '';

  etat.colonnes.forEach(colonne => {
    tableau.appendChild(creerElementColonne(colonne));
  });
}

function creerElementColonne(colonne) {
  const colonneEl = document.createElement('div');

  colonneEl.className = 'colonne';
  colonneEl.dataset.colonneId = colonne.id;

  colonneEl.innerHTML = `
    <div class="colonne-header">
      <span class="colonne-titre">${colonne.titre}</span>

      <span class="colonne-compteur">
        ${colonne.cartes.length}
      </span>
    </div>

    <div class="liste-cartes" data-colonne-id="${colonne.id}"></div>

    <button class="btn-ajouter"
            data-colonne-id="${colonne.id}">
      + Ajouter une carte
    </button>
  `;

  const listeCartes = colonneEl.querySelector('.liste-cartes');

  colonne.cartes.forEach(carte => {
    listeCartes.appendChild(creerElementCarte(carte));
  });

  return colonneEl;
}

function creerElementCarte(carte) {
  const carteEl = document.createElement('div');

  carteEl.className = `carte priorite-${carte.priorite}`;

  carteEl.dataset.carteId = carte.id;

  carteEl.draggable = true;

  const colonneId = trouverColonneDeCarte(carte.id);

  carteEl.innerHTML = `
    <p class="carte-titre">${carte.titre}</p>

    ${carte.description
      ? `<p class="carte-desc">${carte.description}</p>`
      : ''
    }

    <div class="carte-footer">
      <span class="badge-prio prio-${carte.priorite}">
        ${carte.priorite}
      </span>

      <button class="btn-supprimer"
              data-carte-id="${carte.id}"
              data-colonne-id="${colonneId}">
        ✕
      </button>
    </div>
  `;

  return carteEl;
}

// ---------------------------------------------------
// AJOUT DE CARTE
// ---------------------------------------------------

function afficherFormulaireAjout(colonneId) {
  const colonneEl = tableau.querySelector(
    `[data-colonne-id="${colonneId}"]`
  );

  if (!colonneEl) return;

  const formExistant = tableau.querySelector('.form-ajout');

  if (formExistant) {
    formExistant.remove();
  }

  const btnAjouter = colonneEl.querySelector('.btn-ajouter');

  btnAjouter.style.display = 'none';

  const form = document.createElement('div');

  form.className = 'form-ajout';

  form.innerHTML = `
    <textarea class="input-titre"
              placeholder="Titre de la carte..."
              rows="2"></textarea>

    <select class="select-priorite">
      <option value="basse">● Priorité basse</option>
      <option value="moyenne" selected>
        ● Priorité moyenne
      </option>
      <option value="haute">● Priorité haute</option>
    </select>

    <div class="form-boutons">
      <button class="btn-valider btn-primaire">
        Ajouter
      </button>

      <button class="btn-annuler btn-secondaire">
        Annuler
      </button>
    </div>
  `;

  colonneEl.appendChild(form);

  const inputTitre = form.querySelector('.input-titre');

  inputTitre.focus();

  function valider() {
    const titre = inputTitre.value.trim();

    if (!titre) {
      inputTitre.classList.add('erreur');

      inputTitre.placeholder =
        'Le titre ne peut pas être vide.';

      return;
    }

    const priorite = form.querySelector(
      '.select-priorite'
    ).value;

    ajouterCarte(colonneId, titre, priorite);
  }

  function annuler() {
    form.remove();

    btnAjouter.style.display = '';
  }

  form.querySelector('.btn-valider')
    .addEventListener('click', valider);

  form.querySelector('.btn-annuler')
    .addEventListener('click', annuler);

  inputTitre.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      valider();
    }

    if (e.key === 'Escape') {
      annuler();
    }
  });
}

function ajouterCarte(
  colonneId,
  titre,
  priorite = 'moyenne',
  description = ''
) {
  const colonne = etat.colonnes.find(
    col => col.id === colonneId
  );

  if (!colonne) return;

  const nouvelleCarte = {
    id: genererID(),
    titre,
    description,
    priorite,
    dateCreation: new Date()
      .toISOString()
      .split('T')[0],
  };

  colonne.cartes.push(nouvelleCarte);

  sauvegarderEtat();

  afficherTableau();

  brancherEcouteurs();
}

// ---------------------------------------------------
// SUPPRESSION
// ---------------------------------------------------

function supprimerCarte(carteId, colonneId) {
  const colonne = etat.colonnes.find(
    col => col.id === colonneId
  );

  if (!colonne) return;

  const index = colonne.cartes.findIndex(
    carte => carte.id === carteId
  );

  if (index === -1) return;

  const titreCarte = colonne.cartes[index].titre;

  const confirme = confirm(
    `Êtes-vous sûr de vouloir supprimer la carte : « ${titreCarte} » ?`
  );

  if (!confirme) return;

  colonne.cartes.splice(index, 1);

  sauvegarderEtat();

  afficherTableau();

  brancherEcouteurs();
}

// ---------------------------------------------------
// DRAG AND DROP
// ---------------------------------------------------

function gestionnaireDragStart(e) {
  const carteEl = e.target.closest('.carte');

  if (!carteEl) return;

  carteEnCours = carteEl.dataset.carteId;

  e.dataTransfer.setData(
    'text/plain',
    carteEnCours
  );

  e.dataTransfer.effectAllowed = 'move';

  setTimeout(() => {
    carteEl.classList.add('en-deplacement');
  }, 0);
}

function gestionnaireDragEnd(e) {
  const carteEl = e.target.closest('.carte');

  if (carteEl) {
    carteEl.classList.remove('en-deplacement');
  }

  carteEnCours = null;

  document
    .querySelectorAll('.depot-actif')
    .forEach(col => {
      col.classList.remove('depot-actif');
    });
}

function gestionnaireDragOver(e) {
  e.preventDefault();

  e.dataTransfer.dropEffect = 'move';

  const colonneEl = e.target.closest('.colonne');

  document
    .querySelectorAll('.depot-actif')
    .forEach(col => {
      col.classList.remove('depot-actif');
    });

  if (colonneEl) {
    colonneEl.classList.add('depot-actif');
  }
}

function gestionnaireDragLeave(e) {
  if (
    !e.relatedTarget ||
    !tableau.contains(e.relatedTarget)
  ) {
    document
      .querySelectorAll('.depot-actif')
      .forEach(col => {
        col.classList.remove('depot-actif');
      });
  }
}

function gestionnaireDrop(e) {
  e.preventDefault();

  const carteId = e.dataTransfer.getData(
    'text/plain'
  );

  if (!carteId) return;

  const colonneDestEl = e.target.closest('.colonne');

  if (!colonneDestEl) return;

  const colonneDestId =
    colonneDestEl.dataset.colonneId;

  const colonneSource = etat.colonnes.find(
    col =>
      col.cartes.some(
        carte => carte.id === carteId
      )
  );

  if (!colonneSource) return;

  if (colonneSource.id === colonneDestId) {
    return;
  }

  const indexCarte =
    colonneSource.cartes.findIndex(
      carte => carte.id === carteId
    );

  const [carte] =
    colonneSource.cartes.splice(indexCarte, 1);

  const colonneDest = etat.colonnes.find(
    col => col.id === colonneDestId
  );

  colonneDest.cartes.push(carte);

  document
    .querySelectorAll('.depot-actif')
    .forEach(col => {
      col.classList.remove('depot-actif');
    });

  sauvegarderEtat();

  afficherTableau();

  brancherEcouteurs();
}

// ---------------------------------------------------
// CLIC TABLEAU
// ---------------------------------------------------

function gestionnaireClicTableau(e) {
  const btnAjouter =
    e.target.closest('.btn-ajouter');

  if (btnAjouter) {
    afficherFormulaireAjout(
      btnAjouter.dataset.colonneId
    );

    return;
  }

  const btnSupprimer =
    e.target.closest('.btn-supprimer');

  if (btnSupprimer) {
    supprimerCarte(
      btnSupprimer.dataset.carteId,
      btnSupprimer.dataset.colonneId
    );
  }
}

// ---------------------------------------------------
// ÉCOUTEURS
// ---------------------------------------------------

function brancherEcouteurs() {

  tableau.removeEventListener(
    'dragstart',
    gestionnaireDragStart
  );

  tableau.removeEventListener(
    'dragend',
    gestionnaireDragEnd
  );

  tableau.removeEventListener(
    'dragover',
    gestionnaireDragOver
  );

  tableau.removeEventListener(
    'dragleave',
    gestionnaireDragLeave
  );

  tableau.removeEventListener(
    'drop',
    gestionnaireDrop
  );

  tableau.removeEventListener(
    'click',
    gestionnaireClicTableau
  );

  tableau.addEventListener(
    'dragstart',
    gestionnaireDragStart
  );

  tableau.addEventListener(
    'dragend',
    gestionnaireDragEnd
  );

  tableau.addEventListener(
    'dragover',
    gestionnaireDragOver
  );

  tableau.addEventListener(
    'dragleave',
    gestionnaireDragLeave
  );

  tableau.addEventListener(
    'drop',
    gestionnaireDrop
  );

  tableau.addEventListener(
    'click',
    gestionnaireClicTableau
  );
}

// ---------------------------------------------------
// DÉMARRAGE
// ---------------------------------------------------

function demarrerApplication() {
  hydraterEtat();

  afficherTableau();

  brancherEcouteurs();
}

document.addEventListener(
  'DOMContentLoaded',
  demarrerApplication
);