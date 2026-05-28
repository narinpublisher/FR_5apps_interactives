// === GESTIONNAIRE DE BUDGET ===

// Tableau principal
let depenses = [];

// ID automatique
let prochainId = 1;

// Filtre actif
let filtreCourant = 'Tout';

// --- Ajouter une dépense ---
function ajouterDepense(
  intitule,
  montant,
  categorie
) {

  const nouvelle = {
    id: prochainId++,
    intitule: intitule,
    montant: parseFloat(montant),
    categorie: categorie
  };

  depenses.push(nouvelle);

  rendreInterface();
}

// --- Filtrer les dépenses ---
function obtenirDepensesFiltrees() {

  if (filtreCourant === 'Tout') {
    return depenses;
  }

  return depenses.filter(depense =>
    depense.categorie === filtreCourant
  );
}

// --- Calcul du total ---
function calculerTotal(tableau) {

  return tableau.reduce(
    (total, depense) =>
      total + depense.montant,
    0
  );
}

// --- Affichage dynamique ---
function rendreInterface() {

  const liste =
    document.querySelector(
      '#liste-depenses'
    );

  const spanTotal =
    document.querySelector('#total');

  // Vider la liste
  liste.innerHTML = '';

  // Dépenses visibles
  const depensesVisibles =
    obtenirDepensesFiltrees();

  // Construire chaque ligne
  depensesVisibles.forEach(depense => {

    const li =
      document.createElement('li');

    li.className = 'item-depense';

    li.dataset.id = depense.id;

    li.innerHTML = `
      <span class="intitule">
        ${depense.intitule}
      </span>

      <span class="categorie">
        ${depense.categorie}
      </span>

      <span class="montant">
        ${depense.montant.toFixed(2)} €
      </span>

      <button
        class="btn-suppr"
        data-id="${depense.id}"
      >
        ✕
      </button>
    `;

    liste.appendChild(li);

  });

  // Mise à jour du total
  const total =
    calculerTotal(depenses);

  spanTotal.textContent =
    total.toFixed(2) + ' €';
}

// --- Données de démonstration ---
ajouterDepense(
  'Loyer',
  850,
  'Logement'
);

ajouterDepense(
  'Courses Carrefour',
  72.50,
  'Alimentation'
);

ajouterDepense(
  'Netflix',
  13.99,
  'Loisirs'
);

ajouterDepense(
  'Bus',
  2.15,
  'Transport'
);

ajouterDepense(
  'Restaurant',
  38,
  'Loisirs'
);