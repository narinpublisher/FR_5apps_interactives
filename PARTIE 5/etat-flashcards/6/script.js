// ===================================================
// FLASHCARDS — RÉVISION BAC & CONCOURS
// ===================================================

// ---------------------------------------------------
// BANQUE DE CARTES
// ---------------------------------------------------

const BANQUE_CARTES = [
  {
    id: 1,
    categorie: 'Mathématiques',
    niveau: 'terminale',
    question: 'Quelle est la dérivée de ln(x) ?',
    reponse: '1/x',
    explication:
      'La dérivée de ln(x) est 1/x pour x > 0.'
  },

  {
    id: 2,
    categorie: 'Mathématiques',
    niveau: 'terminale',
    question: 'Que vaut e⁰ ?',
    reponse: '1',
    explication:
      'Toute valeur non nulle élevée à la puissance 0 vaut 1.'
  },

  {
    id: 3,
    categorie: 'Physique',
    niveau: 'terminale',
    question: 'Formule de l’énergie cinétique ?',
    reponse: 'Ec = ½mv²',
    explication:
      'm représente la masse et v la vitesse.'
  },

  {
    id: 4,
    categorie: 'Histoire',
    niveau: 'première',
    question: 'Année de la Révolution française ?',
    reponse: '1789',
    explication:
      'Prise de la Bastille le 14 juillet 1789.'
  },

  {
    id: 5,
    categorie: 'Philosophie',
    niveau: 'terminale',
    question: 'Auteur du Discours de la méthode ?',
    reponse: 'René Descartes',
    explication:
      'Publié en 1637.'
  },

  {
    id: 6,
    categorie: 'Physique',
    niveau: 'terminale',
    question: 'Vitesse de la lumière dans le vide ?',
    reponse: '299 792 458 m/s',
    explication:
      'Constante fondamentale notée c.'
  },

  {
    id: 7,
    categorie: 'Chimie',
    niveau: 'terminale',
    question: 'Formule chimique de l’eau ?',
    reponse: 'H₂O',
    explication:
      'Deux atomes d’hydrogène et un atome d’oxygène.'
  },

  {
    id: 8,
    categorie: 'Littérature',
    niveau: 'première',
    question: 'Qui a écrit Les Misérables ?',
    reponse: 'Victor Hugo',
    explication:
      'Roman publié en 1862.'
  },

  {
    id: 9,
    categorie: 'Mathématiques',
    niveau: 'terminale',
    question: 'Théorème de Pythagore ?',
    reponse: 'a² + b² = c²',
    explication:
      'Applicable dans un triangle rectangle.'
  },

  {
    id: 10,
    categorie: 'Géographie',
    niveau: 'seconde',
    question: 'Capitale de l’Australie ?',
    reponse: 'Canberra',
    explication:
      'Souvent confondue avec Sydney.'
  },

  {
    id: 11,
    categorie: 'Biologie',
    niveau: 'terminale',
    question: 'Où a lieu la réplication de l’ADN ?',
    reponse: 'Dans le noyau',
    explication:
      'Chez les cellules eucaryotes.'
  },

  {
    id: 12,
    categorie: 'Physique',
    niveau: 'terminale',
    question: 'Loi d’Ohm ?',
    reponse: 'U = R × I',
    explication:
      'Relation entre tension, résistance et intensité.'
  },

  {
    id: 13,
    categorie: 'Chimie',
    niveau: 'terminale',
    question: 'Numéro atomique du carbone ?',
    reponse: '6',
    explication:
      'Le carbone possède 6 protons.'
  },

  {
    id: 14,
    categorie: 'Histoire',
    niveau: 'terminale',
    question: 'Date de l’armistice de 1918 ?',
    reponse: '11 novembre 1918',
    explication:
      'Fin des combats de la Première Guerre mondiale.'
  },

  {
    id: 15,
    categorie: 'Philosophie',
    niveau: 'terminale',
    question: 'Qui a formulé le cogito ?',
    reponse: 'René Descartes',
    explication:
      '« Je pense donc je suis ».'
  },

  {
    id: 16,
    categorie: 'Mathématiques',
    niveau: 'première',
    question: 'Que mesure le discriminant Δ ?',
    reponse: 'Le nombre de solutions réelles',
    explication:
      'Δ > 0 : deux solutions réelles.'
  },

  {
    id: 17,
    categorie: 'Littérature',
    niveau: 'terminale',
    question: 'Qui a écrit À la recherche du temps perdu ?',
    reponse: 'Marcel Proust',
    explication:
      'Œuvre majeure du roman français.'
  },

  {
    id: 18,
    categorie: 'Géographie',
    niveau: 'première',
    question: 'Le plus long fleuve du monde ?',
    reponse: 'Le Nil',
    explication:
      'Environ 6 650 km.'
  },

  {
    id: 19,
    categorie: 'Mathématiques',
    niveau: 'terminale',
    question: 'Limite de 1/x quand x → +∞ ?',
    reponse: '0',
    explication:
      '1/x se rapproche de 0.'
  },

  {
    id: 20,
    categorie: 'Physique',
    niveau: 'terminale',
    question: 'Unité de la force ?',
    reponse: 'Le Newton',
    explication:
      'Noté N.'
  }
];

// ---------------------------------------------------
// MÉLANGE FISHER-YATES
// ---------------------------------------------------

function melangerTableau(tableau) {
  const copie = [...tableau];

  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copie[i], copie[j]] =
      [copie[j], copie[i]];
  }

  return copie;
}

// ---------------------------------------------------
// ÉTAT APPLICATION
// ---------------------------------------------------

const etat = {
  cartes: [],
  indexCourant: 0,
  estRetournee: false,

  bonnesReponses: 0,
  mauvaisesReponses: 0,

  sessionTerminee: false,

  cartesRatees: []
};

// ---------------------------------------------------
// SÉLECTION DOM
// ---------------------------------------------------

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

const categorieCarte =
  document.querySelector('#categorie-carte');

const indicateurProg =
  document.querySelector('#indicateur-progression');

const btnRetourner =
  document.querySelector('#btn-retourner');

const zoneReponse =
  document.querySelector('#zone-reponse');

const btnCorrect =
  document.querySelector('#btn-correct');

const btnIncorrect =
  document.querySelector('#btn-incorrect');

const ecranResultats =
  document.querySelector('#ecran-resultats');

// ---------------------------------------------------
// RÉINITIALISER SESSION
// ---------------------------------------------------

function reinitialiserEtat(cartesAUtiliser = null) {

  etat.cartes =
    cartesAUtiliser ??
    melangerTableau(BANQUE_CARTES);

  etat.indexCourant = 0;

  etat.estRetournee = false;

  etat.bonnesReponses = 0;
  etat.mauvaisesReponses = 0;

  etat.sessionTerminee = false;

  etat.cartesRatees = [];
}

// ---------------------------------------------------
// AFFICHER CARTE
// ---------------------------------------------------

function afficherCarteCourante() {

  const carteCourante =
    etat.cartes[etat.indexCourant];

  texteQuestion.textContent =
    carteCourante.question;

  texteReponse.textContent =
    carteCourante.reponse;

  texteExplication.textContent =
    carteCourante.explication;

  categorieCarte.textContent =
    carteCourante.categorie;

  etat.estRetournee = false;

  carte.classList.remove(
    'retournee',
    'feedback-correct',
    'feedback-incorrect'
  );

  void carte.offsetHeight;

  carte.classList.remove('carte-entree');
  void carte.offsetHeight;
  carte.classList.add('carte-entree');

  zoneReponse.classList.add('cache');

  btnRetourner.textContent =
    'Retourner la carte';

  mettreAJourProgression();
}

// ---------------------------------------------------
// PROGRESSION
// ---------------------------------------------------

function mettreAJourProgression() {

  const total =
    etat.cartes.length;

  const courant =
    etat.indexCourant + 1;

  const vus =
    etat.bonnesReponses +
    etat.mauvaisesReponses;

  const pourcentageProgression =
    Math.round(
      (etat.indexCourant / total) * 100
    );

  const tauxReussite =
    vus > 0
      ? Math.round(
          (etat.bonnesReponses / vus) * 100
        )
      : null;

  const texteTaux =
    tauxReussite !== null
      ? `
      | 
      <span class="
        taux-${tauxReussite >= 70
          ? 'bon'
          : 'mauvais'}
      ">
        ${tauxReussite}% réussite
      </span>
    `
      : '';

  indicateurProg.innerHTML = `
    <div class="progression-texte">
      Carte ${courant} / ${total}
      |
      ✓ ${etat.bonnesReponses}
      ✗ ${etat.mauvaisesReponses}
      ${texteTaux}
    </div>

    <div class="barre-progression">
      <div
        class="remplissage"
        style="
          width:
          ${pourcentageProgression}%;
        "
      ></div>
    </div>
  `;
}

// ---------------------------------------------------
// RETOURNER CARTE
// ---------------------------------------------------

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

// ---------------------------------------------------
// AVANCER CARTE
// ---------------------------------------------------

function avancerVersCarteSuivante(estCorrect) {

  if (!estCorrect) {

    etat.cartesRatees.push(
      etat.cartes[etat.indexCourant]
    );
  }

  carte.classList.add(
    estCorrect
      ? 'feedback-correct'
      : 'feedback-incorrect'
  );

  setTimeout(() => {

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

// ---------------------------------------------------
// CALCUL RÉSULTATS
// ---------------------------------------------------

function calculerResultats() {

  const total =
    etat.cartes.length;

  const bonnes =
    etat.bonnesReponses;

  const mauvaises =
    etat.mauvaisesReponses;

  const vus =
    bonnes + mauvaises;

  const tauxReussite =
    vus > 0
      ? Math.round(
          (bonnes / vus) * 100
        )
      : 0;

  let message;

  if (tauxReussite >= 80) {

    message =
      'Excellent travail !';

  } else if (tauxReussite >= 60) {

    message =
      'Bon résultat.';

  } else if (tauxReussite >= 40) {

    message =
      'Quelques révisions restent nécessaires.';

  } else {

    message =
      'Courage ! Recommencez la session.';
  }

  return {
    total,
    bonnes,
    mauvaises,
    tauxReussite,
    message
  };
}

// ---------------------------------------------------
// ÉCRAN RÉSULTATS
// ---------------------------------------------------

function afficherEcranResultats() {

  const {
    total,
    bonnes,
    mauvaises,
    tauxReussite,
    message
  } = calculerResultats();

  sceneCarte.classList.add('cache');

  btnRetourner.classList.add('cache');

  zoneReponse.classList.add('cache');

  ecranResultats.classList.remove('cache');

  ecranResultats.innerHTML = `
    <div class="resultats-carte">

      <h2 class="resultats-titre">
        Session terminée !
      </h2>

      <div class="score-principal">

        <span class="
          score-chiffre
          ${tauxReussite >= 60
            ? 'score-bon'
            : 'score-mauvais'}
        ">
          ${tauxReussite}%
        </span>

        <span class="score-label">
          de réussite
        </span>

      </div>

      <div class="detail-scores">

        <div class="score-item correct">
          <span class="score-nombre">
            ${bonnes}
          </span>

          <span class="score-desc">
            bonnes réponses
          </span>
        </div>

        <div class="score-item incorrect">
          <span class="score-nombre">
            ${mauvaises}
          </span>

          <span class="score-desc">
            à revoir
          </span>
        </div>

        <div class="score-item neutre">
          <span class="score-nombre">
            ${total}
          </span>

          <span class="score-desc">
            cartes au total
          </span>
        </div>

      </div>

      <p class="message-performance">
        ${message}
      </p>

      <div class="boutons-resultats">

        <button
          id="btn-recommencer"
          class="btn-primaire"
        >
          Recommencer
          (ordre mélangé)
        </button>

        <button
          id="btn-revoir-erreurs"
          class="btn-secondaire"
          ${mauvaises === 0
            ? 'disabled'
            : ''}
        >
          Revoir les
          ${mauvaises} erreurs
        </button>

      </div>

    </div>
  `;

  document
    .querySelector('#btn-recommencer')
    .addEventListener(
      'click',
      demarrerSession
    );

  if (mauvaises > 0) {

    document
      .querySelector('#btn-revoir-erreurs')
      .addEventListener(
        'click',
        demarrerSessionErreurs
      );
  }
}

// ---------------------------------------------------
// SESSION ERREURS
// ---------------------------------------------------

function demarrerSessionErreurs() {

  const cartesMelangees =
    melangerTableau(
      etat.cartesRatees
    );

  reinitialiserEtat(cartesMelangees);

  ecranResultats.classList.add('cache');

  sceneCarte.classList.remove('cache');

  btnRetourner.classList.remove('cache');

  afficherCarteCourante();
}

// ---------------------------------------------------
// DÉMARRER SESSION
// ---------------------------------------------------

function demarrerSession() {

  reinitialiserEtat();

  ecranResultats.classList.add('cache');

  sceneCarte.classList.remove('cache');

  btnRetourner.classList.remove('cache');

  afficherCarteCourante();
}

// ---------------------------------------------------
// ÉVÉNEMENTS
// ---------------------------------------------------

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

// ---------------------------------------------------
// LANCEMENT
// ---------------------------------------------------

demarrerSession();