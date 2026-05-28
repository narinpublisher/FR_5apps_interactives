const BANQUE_CARTES = [
  {
    question: 'En quelle année a eu lieu la Révolution française ?',
    reponse: '1789',
    explication: 'Prise de la Bastille le 14 juillet 1789.',
    categorie: 'Histoire'
  },

  {
    question: 'Qui a écrit Le Rouge et le Noir ?',
    reponse: 'Stendhal',
    explication: 'Roman publié en 1830.',
    categorie: 'Littérature'
  },

  {
    question: 'Quelle est la formule de l’énergie cinétique ?',
    reponse: 'Ec = 1/2 × m × v²',
    explication: 'm = masse, v = vitesse.',
    categorie: 'Physique'
  },

  {
    question: 'Quelle est la capitale de l’Espagne ?',
    reponse: 'Madrid',
    explication: 'Située au centre du pays.',
    categorie: 'Géographie'
  },

  {
    question: 'Qui a peint La Joconde ?',
    reponse: 'Léonard de Vinci',
    explication: 'Peinture exposée au Louvre.',
    categorie: 'Art'
  }
];

/* =========================================
   ETAT
========================================= */

const etat = {
  cartes: [],
  indexCourant: 0,
  estRetournee: false,
  bonnesReponses: 0,
  mauvaisesReponses: 0,
  sessionTerminee: false,
  cartesRatees: []
};

/* =========================================
   DOM
========================================= */

const sceneCarte       = document.querySelector('#scene-carte');
const carte            = document.querySelector('#carte');

const texteQuestion    = document.querySelector('#texte-question');
const texteReponse     = document.querySelector('#texte-reponse');
const texteExplication = document.querySelector('#texte-explication');

const categorieEl      = document.querySelector('#categorie-carte');

const indicateurProg   = document.querySelector('#indicateur-progression');

const zoneReponse      = document.querySelector('#zone-reponse');

const btnRetourner     = document.querySelector('#btn-retourner');

const btnCorrect       = document.querySelector('#btn-correct');
const btnIncorrect     = document.querySelector('#btn-incorrect');

/* =========================================
   MELANGE
========================================= */

function melangerTableau(tableau) {

  const copie = [...tableau];

  for (let i = copie.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [copie[i], copie[j]] = [copie[j], copie[i]];
  }

  return copie;
}

/* =========================================
   PROGRESSION
========================================= */

function mettreAJourProgression() {

  const total = etat.cartes.length;

  const courant = etat.indexCourant + 1;

  const vus =
    etat.bonnesReponses +
    etat.mauvaisesReponses;

  const pourcent =
    Math.round(
      (etat.indexCourant / total) * 100
    );

  const tauxReussite =
    vus > 0
      ? Math.round((etat.bonnesReponses / vus) * 100)
      : null;

  const texteReussite =
    tauxReussite !== null
      ? `<span class="${
          tauxReussite >= 70
            ? 'taux-bon'
            : 'taux-mauvais'
        }">
          | ${tauxReussite}% de réussite
        </span>`
      : '';

  indicateurProg.innerHTML = `
    <div class="progression-texte">

      Carte ${courant} / ${total}

      | ✓ ${etat.bonnesReponses}

      ✗ ${etat.mauvaisesReponses}

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

/* =========================================
   AFFICHER CARTE
========================================= */

function afficherCarteCourante() {

  const carteData =
    etat.cartes[etat.indexCourant];

  texteQuestion.textContent =
    carteData.question;

  texteReponse.textContent =
    carteData.reponse;

  texteExplication.textContent =
    carteData.explication;

  categorieEl.textContent =
    carteData.categorie;

  etat.estRetournee = false;

  carte.classList.remove('retournee');

  zoneReponse.classList.add('cache');

  btnRetourner.textContent =
    'Retourner la carte';

  carte.classList.remove('carte-entree');

  void carte.offsetHeight;

  carte.classList.add('carte-entree');

  mettreAJourProgression();
}

/* =========================================
   RETOURNER
========================================= */

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

btnRetourner.addEventListener(
  'click',
  retournerCarte
);

sceneCarte.addEventListener(
  'click',
  retournerCarte
);

/* =========================================
   AVANCER
========================================= */

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

/* =========================================
   SCORE
========================================= */

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

/* =========================================
   RESULTATS
========================================= */

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
      ? Math.round((bonnes / vus) * 100)
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
      'Quelques révisions nécessaires.';

  } else {

    message =
      'Révision approfondie recommandée.';
  }

  return {
    total,
    bonnes,
    mauvaises,
    tauxReussite,
    message
  };
}

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

  const ecranResultats =
    document.querySelector(
      '#ecran-resultats'
    );

  ecranResultats.classList.remove('cache');

  ecranResultats.innerHTML = `
    <div class="resultats-carte">

      <h2 class="resultats-titre">
        Session terminée !
      </h2>

      <div class="score-principal">

        <span class="score-chiffre ${
          tauxReussite >= 60
            ? 'score-bon'
            : 'score-mauvais'
        }">

          ${tauxReussite}%

        </span>

      </div>

      <div class="detail-scores">

        <div class="score-item correct">
          <span class="score-nombre">
            ${bonnes}
          </span>

          <span>
            bonnes réponses
          </span>
        </div>

        <div class="score-item incorrect">
          <span class="score-nombre">
            ${mauvaises}
          </span>

          <span>
            à revoir
          </span>
        </div>

        <div class="score-item neutre">
          <span class="score-nombre">
            ${total}
          </span>

          <span>
            total
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
        </button>

        <button
          id="btn-revoir-erreurs"
          class="btn-secondaire"
          ${mauvaises === 0 ? 'disabled' : ''}
        >
          Revoir erreurs
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

/* =========================================
   RESET SESSION
========================================= */

function reinitialiserEtat(
  cartesAUtiliser = null
) {

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

function demarrerSession() {

  reinitialiserEtat();

  document
    .querySelector('#ecran-resultats')
    .classList.add('cache');

  sceneCarte.classList.remove('cache');

  btnRetourner.classList.remove('cache');

  afficherCarteCourante();
}

function demarrerSessionErreurs() {

  const cartesMelangees =
    melangerTableau(etat.cartesRatees);

  reinitialiserEtat(cartesMelangees);

  document
    .querySelector('#ecran-resultats')
    .classList.add('cache');

  sceneCarte.classList.remove('cache');

  btnRetourner.classList.remove('cache');

  afficherCarteCourante();
}

/* =========================================
   START
========================================= */

demarrerSession();