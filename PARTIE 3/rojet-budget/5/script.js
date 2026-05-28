// =============================================
// GESTIONNAIRE DE BUDGET PERSONNEL
// =============================================

// --- Couleurs ---
const COULEURS_CAT = {
  'Alimentation': '#4CAF50',
  'Transport': '#2196F3',
  'Loisirs': '#FF9800',
  'Logement': '#9C27B0',
  'Autre': '#607D8B'
};

// --- État ---
let depenses = [];
let prochainId = 1;
let filtreCourant = 'Tout';

// --- DOM ---
const inputIntitule = document.querySelector('#intitule');
const inputMontant = document.querySelector('#montant');
const selectCategorie = document.querySelector('#categorie');

const btnAjouter = document.querySelector('#btn-ajouter');

const spanTotal = document.querySelector('#total');

const listeDep = document.querySelector('#liste-depenses');

const zoneFiltre = document.querySelector('.filtres');

const zoneRepartition = document.querySelector('#repartition');

// =============================================
// LOGIQUE
// =============================================

function ajouterDepense(intitule, montant, categorie) {

  depenses.push({
    id: prochainId++,
    intitule: intitule,
    montant: parseFloat(montant),
    categorie: categorie
  });

  rendreInterface();
}

function supprimerDepense(id) {

  depenses = depenses.filter(d => d.id !== id);

  rendreInterface();
}

function obtenirDepensesFiltrees() {

  if (filtreCourant === 'Tout') {
    return depenses;
  }

  return depenses.filter(
    d => d.categorie === filtreCourant
  );
}

function calculerTotal(tableau) {

  return tableau.reduce((acc, d) => {
    return acc + d.montant;
  }, 0);
}

function calculerRepartition() {

  if (depenses.length === 0) {
    return {};
  }

  const totalGeneral = calculerTotal(depenses);

  const parCategorie = depenses.reduce((acc, d) => {

    if (!acc[d.categorie]) {
      acc[d.categorie] = 0;
    }

    acc[d.categorie] += d.montant;

    return acc;

  }, {});

  const resultat = {};

  for (const cat in parCategorie) {

    resultat[cat] = {
      total: parCategorie[cat],
      pourcentage: (
        parCategorie[cat] / totalGeneral * 100
      ).toFixed(1)
    };

  }

  return resultat;
}

// =============================================
// AFFICHAGE
// =============================================

function rendreInterface() {

  listeDep.innerHTML = '';

  const visibles = obtenirDepensesFiltrees();

  visibles.forEach(depense => {

    const li = document.createElement('li');

    li.className = 'item-depense';

    li.innerHTML = `
      <div class="info-depense">

        <span class="intitule">
          ${depense.intitule}
        </span>

        <span class="badge badge-${depense.categorie.toLowerCase()}">
          ${depense.categorie}
        </span>

      </div>

      <div class="droite">

        <span class="montant">
          ${depense.montant.toFixed(2)} €
        </span>

        <button
          class="btn-suppr"
          data-id="${depense.id}"
        >
          ✕
        </button>

      </div>
    `;

    listeDep.appendChild(li);

  });

  spanTotal.textContent =
    calculerTotal(visibles).toFixed(2) + ' €';

  afficherRepartition();
}

function afficherRepartition() {

  const repartition = calculerRepartition();

  if (Object.keys(repartition).length === 0) {

    zoneRepartition.innerHTML = '';

    return;
  }

  let html = `
    <h2>Répartition par catégorie</h2>
  `;

  for (const cat in repartition) {

    const total = repartition[cat].total;

    const pourcentage =
      repartition[cat].pourcentage;

    const couleur =
      COULEURS_CAT[cat] || '#999';

    html += `
      <div class="ligne-categorie">

        <div class="label-cat">

          <span class="nom-cat">
            ${cat}
          </span>

          <span class="montant-cat">
            ${total.toFixed(2)} €
            (${pourcentage} %)
          </span>

        </div>

        <div class="barre-fond">

          <div
            class="barre-remplie"
            style="
              width:${pourcentage}%;
              background:${couleur};
            "
          ></div>

        </div>

      </div>
    `;
  }

  zoneRepartition.innerHTML = html;
}

// =============================================
// ÉVÉNEMENTS
// =============================================

btnAjouter.addEventListener('click', () => {

  const intitule =
    inputIntitule.value.trim();

  const montant =
    parseFloat(inputMontant.value);

  const categorie =
    selectCategorie.value;

  if (
    !intitule ||
    isNaN(montant) ||
    montant <= 0
  ) {

    alert(
      'Veuillez renseigner un intitulé et un montant valide.'
    );

    return;
  }

  ajouterDepense(
    intitule,
    montant,
    categorie
  );

  inputIntitule.value = '';
  inputMontant.value = '';

  inputIntitule.focus();

});

// Suppression
listeDep.addEventListener('click', (event) => {

  if (
    event.target.classList.contains('btn-suppr')
  ) {

    supprimerDepense(
      Number(event.target.dataset.id)
    );

  }

});

// Filtres
zoneFiltre.addEventListener('click', (event) => {

  if (
    event.target.classList.contains('btn-filtre')
  ) {

    filtreCourant =
      event.target.dataset.cat;

    document
      .querySelectorAll('.btn-filtre')
      .forEach(btn => {
        btn.classList.remove('actif');
      });

    event.target.classList.add('actif');

    rendreInterface();

  }

});

// =============================================
// DONNÉES DE DÉMONSTRATION
// =============================================

ajouterDepense('Loyer', 850, 'Logement');
ajouterDepense('Courses Carrefour', 72.50, 'Alimentation');
ajouterDepense('Restaurant', 38, 'Alimentation');
ajouterDepense('Bus', 18.40, 'Transport');
ajouterDepense('Netflix', 13.99, 'Loisirs');
ajouterDepense('Cinéma', 24, 'Loisirs');

// Initialisation
rendreInterface();