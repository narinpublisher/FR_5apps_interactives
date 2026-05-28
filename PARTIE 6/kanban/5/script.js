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
        titre: 'Lire la documentation MDN sur Drag and Drop',
        description: 'En particulier les événements dragstart, dragover et drop.',
        priorite: 'haute',
        dateCreation: '2025-05-01'
      },
      {
        id: 'c-2',
        titre: 'Configurer l’environnement de développement',
        description: '',
        priorite: 'moyenne',
        dateCreation: '2025-05-02'
      },
      {
        id: 'c-3',
        titre: 'Concevoir la structure HTML du tableau',
        description: 'Définir les classes CSS et les identifiants.',
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
        titre: 'Implémenter la logique de drag and drop',
        description: 'Gérer les événements et le transfert de données.',
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
        description: 'Structure validée.',
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
  colonnes: []
};

/* =========================
   UTILITAIRES
========================= */

function genererID() {
  return 'carte-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
}

function trouverColonneDeCarte(carteId) {
  const colonne = etat.colonnes.find(col =>
    col.cartes.some(c => c.id === carteId)
  );

  return colonne ? colonne.id : null;
}

/* =========================
   VALIDATION
========================= */

function estEtatValide(colonnes) {
  if (!Array.isArray(colonnes)) return false;

  return colonnes.every(col =>
    col.id &&
    col.titre &&
    Array.isArray(col.cartes)
  );
}

/* =========================
   LOCAL STORAGE
========================= */

function sauvegarderEtat() {
  const json = JSON.stringify(etat.colonnes);

  localStorage.setItem('kanban-etat', json);
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

  } catch (e) {

    console.warn('Réinitialisation :', e.message);

    etat.colonnes = structuredClone(DONNEES_INITIALES);

    sauvegarderEtat();
  }
}

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

  el.dataset.colonneId = colonne.id;

  el.innerHTML = `
    <div class="colonne-header">
      <span class="colonne-titre">${colonne.titre}</span>
      <span class="colonne-compteur">${colonne.cartes.length}</span>
    </div>

    <div class="liste-cartes" data-colonne-id="${colonne.id}"></div>

    <button class="btn-ajouter" data-colonne-id="${colonne.id}">
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

  el.className = `carte priorite-${carte.priorite}`;

  el.dataset.carteId = carte.id;

  el.draggable = true;

  el.innerHTML = `
    <p class="carte-titre">${carte.titre}</p>

    ${carte.description
      ? `<p class="carte-description">${carte.description}</p>`
      : ''}

    <div class="carte-footer">

      <span class="badge-priorite">
        ${carte.priorite}
      </span>

      <button
        class="btn-supprimer"
        data-carte-id="${carte.id}"
        data-colonne-id="${trouverColonneDeCarte(carte.id)}">
        ✕
      </button>

    </div>
  `;

  return el;
}

/* =========================
   AJOUT / SUPPRESSION
========================= */

function ajouterCarte(colonneId, titre, priorite = 'moyenne') {

  const colonne = etat.colonnes.find(c => c.id === colonneId);

  if (!colonne) return;

  colonne.cartes.push({
    id: genererID(),
    titre,
    description: '',
    priorite,
    dateCreation: new Date().toISOString().split('T')[0]
  });

  sauvegarderEtat();

  afficherTableau();
}

function supprimerCarte(carteId, colonneId) {

  const colonne = etat.colonnes.find(c => c.id === colonneId);

  if (!colonne) return;

  const index = colonne.cartes.findIndex(c => c.id === carteId);

  if (index === -1) return;

  const confirme = confirm('Supprimer cette carte ?');

  if (!confirme) return;

  colonne.cartes.splice(index, 1);

  sauvegarderEtat();

  afficherTableau();
}

/* =========================
   FORMULAIRE AJOUT
========================= */

function afficherFormulaireAjout(colonneId) {

  const colEl = tableau.querySelector(
    `[data-colonne-id='${colonneId}']`
  );

  const btnAjouter = colEl.querySelector('.btn-ajouter');

  btnAjouter.style.display = 'none';

  const form = document.createElement('div');

  form.className = 'form-ajout';

  form.innerHTML = `
    <textarea
      class="input-titre"
      placeholder="Titre..."
      rows="2"></textarea>

    <select class="select-priorite">
      <option value="basse">Priorité basse</option>
      <option value="moyenne" selected>Priorité moyenne</option>
      <option value="haute">Priorité haute</option>
    </select>

    <div class="form-boutons">
      <button class="btn-valider">Ajouter</button>
      <button class="btn-annuler">Annuler</button>
    </div>
  `;

  colEl.appendChild(form);

  form.querySelector('.input-titre').focus();

  form.querySelector('.btn-valider')
    .addEventListener('click', () => {

      const titre = form.querySelector('.input-titre')
        .value
        .trim();

      const priorite = form.querySelector('.select-priorite')
        .value;

      if (titre) {
        ajouterCarte(colonneId, titre, priorite);
      }
    });

  form.querySelector('.btn-annuler')
    .addEventListener('click', () => {

      form.remove();

      btnAjouter.style.display = '';
    });
}

/* =========================
   DRAG AND DROP
========================= */

let carteEnCours = null;

tableau.addEventListener('dragstart', (e) => {

  const carteEl = e.target.closest('.carte');

  if (!carteEl) return;

  carteEnCours = carteEl.dataset.carteId;

  e.dataTransfer.setData('text/plain', carteEnCours);

  e.dataTransfer.effectAllowed = 'move';

  setTimeout(() => {
    carteEl.classList.add('en-deplacement');
  }, 0);
});

tableau.addEventListener('dragend', (e) => {

  const carteEl = e.target.closest('.carte');

  if (carteEl) {
    carteEl.classList.remove('en-deplacement');
  }

  document
    .querySelectorAll('.colonne.depot-actif')
    .forEach(c => c.classList.remove('depot-actif'));
});

tableau.addEventListener('dragover', (e) => {

  e.preventDefault();

  const colonneEl = e.target.closest('.colonne');

  document
    .querySelectorAll('.colonne.depot-actif')
    .forEach(c => c.classList.remove('depot-actif'));

  if (colonneEl) {
    colonneEl.classList.add('depot-actif');
  }
});

tableau.addEventListener('drop', (e) => {

  e.preventDefault();

  const carteId = e.dataTransfer.getData('text/plain');

  if (!carteId) return;

  const colonneDestEl = e.target.closest('.colonne');

  if (!colonneDestEl) return;

  const colonneDestId = colonneDestEl.dataset.colonneId;

  const colonneSource = etat.colonnes.find(col =>
    col.cartes.some(c => c.id === carteId)
  );

  if (!colonneSource) return;

  if (colonneSource.id === colonneDestId) return;

  const indexCarte = colonneSource.cartes
    .findIndex(c => c.id === carteId);

  const [carte] = colonneSource.cartes.splice(indexCarte, 1);

  const colonneDest = etat.colonnes.find(
    c => c.id === colonneDestId
  );

  colonneDest.cartes.push(carte);

  sauvegarderEtat();

  afficherTableau();
});

/* =========================
   DÉLÉGATION ÉVÉNEMENTS
========================= */

tableau.addEventListener('click', (e) => {

  const btnAjouter = e.target.closest('.btn-ajouter');

  if (btnAjouter) {

    const colonneId = btnAjouter.dataset.colonneId;

    afficherFormulaireAjout(colonneId);
  }

  const btnSupprimer = e.target.closest('.btn-supprimer');

  if (btnSupprimer) {

    const { carteId, colonneId } = btnSupprimer.dataset;

    supprimerCarte(carteId, colonneId);
  }
});

/* =========================
   DÉMARRAGE APPLICATION
========================= */

function demarrerApplication() {

  hydraterEtat();

  afficherTableau();
}

document.addEventListener(
  'DOMContentLoaded',
  demarrerApplication
);