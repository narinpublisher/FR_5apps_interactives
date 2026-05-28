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

function obtenirDepensesFiltrees() {

  if (filtreCourant === 'Tout') {
    return depenses;
  }

  return depenses.filter(d => {
    return d.categorie === filtreCourant;
  });
}

function calculerTotal(tableau) {

  return tableau.reduce((acc, depense) => {
    return acc + depense.montant;
  }, 0);
}

function supprimerDepense(id) {

  depenses = depenses.filter(d => {
    return d.id !== id;
  });

  rendreInterface();
}

function rendreInterface() {

  const liste = document.querySelector('#liste-depenses');
  const spanTotal = document.querySelector('#total');

  liste.innerHTML = '';

  const depensesVisibles = obtenirDepensesFiltrees();

  depensesVisibles.forEach(depense => {

    const li = document.createElement('li');

    li.innerHTML = `
      ${depense.intitule}
      —
      ${depense.categorie}
      —
      ${depense.montant.toFixed(2)} €
      <button
        class="btn-suppr"
        data-id="${depense.id}">
        ✕
      </button>
    `;

    liste.appendChild(li);
  });

  const total = calculerTotal(depensesVisibles);

  spanTotal.textContent =
    total.toFixed(2) + ' €';
}

rendreInterface();

const liste = document.querySelector('#liste-depenses');

liste.addEventListener('click', (event) => {

  if (event.target.classList.contains('btn-suppr')) {

    const id = Number(event.target.dataset.id);

    supprimerDepense(id);
  }
});

const zoneFiltre = document.querySelector('.filtres');

zoneFiltre.addEventListener('click', (event) => {

  if (event.target.classList.contains('btn-filtre')) {

    filtreCourant = event.target.dataset.cat;

    document.querySelectorAll('.btn-filtre').forEach(b => {
      b.classList.remove('actif');
    });

    event.target.classList.add('actif');

    rendreInterface();
  }
});