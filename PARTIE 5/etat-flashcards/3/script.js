// =============================================
// APPLICATION FLASHCARDS — RÉVISION BAC
// =============================================

// =============================================
// BANQUE DE CARTES
// =============================================

const BANQUE_CARTES = [

  {
    id: 1,
    categorie: "Histoire",
    niveau: "première",

    question:
      "En quelle année a eu lieu la Révolution française ?",

    reponse:
      "1789",

    explication:
      "Prise de la Bastille le 14 juillet 1789."
  },

  {
    id: 2,
    categorie: "Mathématiques",
    niveau: "terminale",

    question:
      "Quelle est la dérivée de ln(x) ?",

    reponse:
      "1/x",

    explication:
      "La dérivée de ln(x) vaut 1/x pour x > 0."
  },

  {
    id: 3,
    categorie: "Physique",
    niveau: "terminale",

    question:
      "Quelle est la formule de l'énergie cinétique ?",

    reponse:
      "Ec = ½mv²",

    explication:
      "m = masse, v = vitesse."
  },

  {
    id: 4,
    categorie: "Philosophie",
    niveau: "terminale",

    question:
      "Qui a écrit le Discours de la méthode ?",

    reponse:
      "René Descartes",

    explication:
      "Publié en 1637."
  },

  {
    id: 5,
    categorie: "SVT",
    niveau: "terminale",

    question:
      "Quel organe produit l'insuline ?",

    reponse:
      "Le pancréas",

    explication:
      "L'insuline régule le taux de glucose."
  }

];

// =============================================
// ÉTAT GLOBAL
// =============================================

const etat = {

  cartes: [],

  indexCourant: 0,

  estRetournee: false,

  bonnesReponses: 0,

  mauvaisesReponses: 0,

  sessionTerminee: false

};

// =============================================
// MÉLANGE FISHER-YATES
// =============================================

function melangerTableau(tableau) {

  const copie = [...tableau];

  for (
    let i = copie.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(
        Math.random() * (i + 1)
      );

    [copie[i], copie[j]] =
      [copie[j], copie[i]];

  }

  return copie;

}

// =============================================
// DOM
// =============================================

const sceneCarte =
  document.querySelector('#scene-carte');

const carte =
  document.querySelector('#carte');

const texteQuestion =
  document.querySelector('#texte-question');

const texteReponse =
  document.querySelector('#texte-reponse');

const texteExplication =
  document.querySelector('#texte-explication');

const categorieEl =
  document.querySelector('#categorie-carte');

const indicateurProg =
  document.querySelector('#indicateur-progression');

const zoneReponse =
  document.querySelector('#zone-reponse');

const btnRetourner =
  document.querySelector('#btn-retourner');

const btnCorrect =
  document.querySelector('#btn-correct');

const btnIncorrect =
  document.querySelector('#btn-incorrect');

const ecranResultats =
  document.querySelector('#ecran-resultats');

// =============================================
// AFFICHAGE CARTE
// =============================================

function afficherCarteCourante() {

  const carteData =
    etat.cartes[etat.indexCourant];

  texteQuestion.textContent =
    carteData.question;

  texteReponse.textContent =
    carteData.reponse;

  texteExplication.textContent =
    carteData.explication || '';

  categorieEl.textContent =
    carteData.categorie;

  etat.estRetournee = false;

  carte.classList.remove('retournee');

  zoneReponse.classList.add('cache');

  btnRetourner.textContent =
    'Retourner la carte';

  mettreAJourProgression();

}

// =============================================
// PROGRESSION
// =============================================

function mettreAJourProgression() {

  const total =
    etat.cartes.length;

  const courant =
    etat.indexCourant + 1;

  const vus =
    etat.bonnesReponses +
    etat.mauvaisesReponses;

  const pourcent =
    Math.round(
      (etat.indexCourant / total) * 100
    );

  const tauxReussite =
    vus > 0
      ? Math.round(
          (etat.bonnesReponses / vus) * 100
        )
      : null;

  let texteReussite = '';

  if (tauxReussite !== null) {

    texteReussite = `
      <span class="
        ${
          tauxReussite >= 70
            ? 'taux-bon'
            : 'taux-mauvais'
        }
      ">
        ${tauxReussite}% de réussite
      </span>
    `;

  }

  indicateurProg.innerHTML = `

    <div class="progression-texte">

      Carte ${courant} / ${total}

      &nbsp;|&nbsp;

      ✓ ${etat.bonnesReponses}

      &nbsp;✗ ${etat.mauvaisesReponses}

      ${texteReussite}

    </div>

    <div class="barre-progression">

      <div
        class="remplissage"
        style="width:${pourcent}%"
      ></div>

    </div>

  `;

}

// =============================================
// RETOURNER CARTE
// =============================================

function retournerCarte() {

  etat.estRetournee =
    !etat.estRetournee;

  carte.classList.toggle('retournee');

  if (etat.estRetournee) {

    zoneReponse.classList.remove('cache');

    btnRetourner.textContent =
      'Revoir la question';

  } else {

    zoneReponse.classList.add('cache');

    btnRetourner.textContent =
      'Retourner la carte';

  }

}

// =============================================
// CARTE SUIVANTE
// =============================================

function avancerVersCarteSuivante(estCorrect) {

  carte.classList.add(
    estCorrect
      ? 'feedback-correct'
      : 'feedback-incorrect'
  );

  setTimeout(() => {

    carte.classList.remove(
      'feedback-correct',
      'feedback-incorrect'
    );

    etat.indexCourant++;

    if (
      etat.indexCourant >=
      etat.cartes.length
    ) {

      etat.sessionTerminee = true;

      afficherEcranResultats();

    } else {

      afficherCarteCourante();

    }

  }, 600);

}

// =============================================
// ÉCRAN FINAL
// =============================================

function afficherEcranResultats() {

  const total =
    etat.cartes.length;

  const taux =
    Math.round(
      (etat.bonnesReponses / total) * 100
    );

  document.querySelector(
    '.scene-carte'
  ).classList.add('cache');

  btnRetourner.classList.add('cache');

  zoneReponse.classList.add('cache');

  ecranResultats.classList.remove('cache');

  ecranResultats.innerHTML = `

    <h2>Session terminée 🎉</h2>

    <p>
      Bonnes réponses :
      ${etat.bonnesReponses}
    </p>

    <p>
      Mauvaises réponses :
      ${etat.mauvaisesReponses}
    </p>

    <p>
      Score final :
      ${taux}%
    </p>

  `;

}

// =============================================
// ÉVÉNEMENTS
// =============================================

btnRetourner.addEventListener(
  'click',
  retournerCarte
);

sceneCarte.addEventListener(
  'click',
  retournerCarte
);

btnCorrect.addEventListener(
  'click',
  () => {

    etat.bonnesReponses++;

    avancerVersCarteSuivante(true);

  }
);

btnIncorrect.addEventListener(
  'click',
  () => {

    etat.mauvaisesReponses++;

    avancerVersCarteSuivante(false);

  }
);

// =============================================
// INITIALISATION
// =============================================

etat.cartes =
  melangerTableau(BANQUE_CARTES);

console.log(
  '=== BANQUE ORIGINALE ==='
);

console.log(BANQUE_CARTES);

console.log('');

console.log(
  '=== ÉTAT INITIAL ==='
);

console.log(etat);

console.log('');

console.log(
  '=== NOUVEAU MÉLANGE ==='
);

console.log(
  melangerTableau(BANQUE_CARTES)
);

afficherCarteCourante();