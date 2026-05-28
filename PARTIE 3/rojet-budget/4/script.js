let depenses = [
  {
    id: 1,
    intitule: 'Loyer',
    montant: 850,
    categorie: 'Logement'
  },
  {
    id: 2,
    intitule: 'Courses',
    montant: 67.40,
    categorie: 'Alimentation'
  },
  {
    id: 3,
    intitule: 'Bus',
    montant: 18.40,
    categorie: 'Transport'
  },
  {
    id: 4,
    intitule: 'Cinéma',
    montant: 25,
    categorie: 'Loisirs'
  },
  {
    id: 5,
    intitule: 'Restaurant',
    montant: 42,
    categorie: 'Alimentation'
  }
];

let filtreCourant = 'Tout';

const COULEURS_CAT = {
  'Alimentation': '#4CAF50',
  'Transport': '#2196F3',
  'Loisirs': '#FF9800',
  'Logement': '#9C27B0',
  'Autre': '#607D8B'
};

function calculerTotal(tableau) {
  return tableau.reduce((acc, depense) => {
    return acc + depense.montant;
  }, 0);
}

function obtenirDepensesFiltrees() {
  if (filtreCourant === 'Tout') {
    return depenses;
  }

  return depenses.filter(d => {
    return d.categorie === filtreCourant;
  });
}

function supprimerDepense(id) {
  depenses = depenses.filter(d => {
    return d.id !== id;
  });

  rendreInterface();
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
      pourcentage:
        (parCategorie[cat] / totalGeneral * 100).toFixed(1)
    };

  }

  return resultat;
}

function afficherRepartition() {

  const zone = document.querySelector('#repartition');

  const repartition = calculerRepartition();

  if (Object.keys(repartition).length === 0) {
    zone.innerHTML = '';
    return;
  }

  let html = '<h2>Répartition par catégorie</h2>';

  for (const cat in repartition) {

    const { total, pourcentage } = repartition[cat];

    const couleur = COULEURS_CAT[cat] || '#999';

    html += `
      <div class="ligne-categorie">

        <div class="label-cat">
          <span class="nom-cat">${cat}</span>

          <span class="montant-cat">
            ${total.toFixed(2)} €
            (${pourcentage}%)
          </span>
        </div>

        <div class="barre-fond">
          <div
            class="barre-remplie"
            style="
              width:${pourcentage}%;
              background-color:${couleur};
            ">
          </div>
        </div>

      </div>
    `;
  }

  zone.innerHTML = html;
}

function rendreInterface() {

  const liste = document.querySelector('#liste-depenses');

  const spanTotal = document.querySelector('#total');

  liste.innerHTML = '';

  const depensesVisibles =
    obtenirDepensesFiltrees();

  depensesVisibles.forEach(depense => {

    const li = document.createElement('li');

    li.className = 'item-depense';

    li.dataset.id = depense.id;

    li.innerHTML = `
      <div class="info-depense">

        <span class="intitule">
          ${depense.intitule}
        </span>

        <span
          class="badge badge-${depense.categorie.toLowerCase()}">
          ${depense.categorie}
        </span>

      </div>

      <div class="droite">

        <span class="montant">
          ${depense.montant.toFixed(2)} €
        </span>

        <button
          class="btn-suppr"
          data-id="${depense.id}">
          ✕
        </button>

      </div>
    `;

    liste.appendChild(li);

  });

  const total =
    calculerTotal(depensesVisibles);

  spanTotal.textContent =
    total.toFixed(2) + ' €';

  afficherRepartition();
}

const liste =
  document.querySelector('#liste-depenses');

liste.addEventListener('click', event => {

  if (event.target.classList.contains('btn-suppr')) {

    const id =
      Number(event.target.dataset.id);

    supprimerDepense(id);

  }

});

const zoneFiltre =
  document.querySelector('.filtres');

zoneFiltre.addEventListener('click', event => {

  if (event.target.classList.contains('btn-filtre')) {

    filtreCourant =
      event.target.dataset.cat;

    document
      .querySelectorAll('.btn-filtre')
      .forEach(b => {
        b.classList.remove('actif');
      });

    event.target.classList.add('actif');

    rendreInterface();

  }

});

rendreInterface();