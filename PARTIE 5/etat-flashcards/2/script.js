// =====================================
// ÉTAT CENTRAL
// =====================================

const etat = {

  cartes: [],

  indexCourant: 0,

  estRetournee: false,

  bonnesReponses: 0,

  mauvaisesReponses: 0,

  sessionTerminee: false

};

// =====================================
// BANQUE DE CARTES
// =====================================

const BANQUE_CARTES = [

  {
    id: 1,
    categorie: "Mathématiques",

    question:
      "Quelle est la dérivée de ln(x) ?",

    reponse:
      "1/x",

    explication:
      "La dérivée de ln(x) est 1/x pour x > 0."
  },

  {
    id: 2,
    categorie: "Physique",

    question:
      "Quelle est la formule de l'énergie cinétique ?",

    reponse:
      "Ec = ½mv²",

    explication:
      "m = masse, v = vitesse."
  },

  {
    id: 3,
    categorie: "Histoire",

    question:
      "En quelle année a eu lieu la Révolution française ?",

    reponse:
      "1789",

    explication:
      "Prise de la Bastille le 14 juillet 1789."
  }

];

// =====================================
// MÉLANGE FISHER-YATES
// =====================================

function melangerTableau(tableau) {

  const copie = [...tableau];

  for (let i = copie.length - 1; i > 0; i--) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [copie[i], copie[j]] =
      [copie[j], copie[i]];
  }

  return copie;
}

// =====================================
// DOM
// =====================================

const sceneCarte =
  document.querySelector("#scene-carte");

const carte =
  document.querySelector("#carte");

const texteQuestion =
  document.querySelector("#texte-question");

const texteReponse =
  document.querySelector("#texte-reponse");

const texteExplication =
  document.querySelector("#texte-explication");

const categorieEl =
  document.querySelector("#categorie-carte");

const indicateurProg =
  document.querySelector("#indicateur-progression");

const zoneReponse =
  document.querySelector("#zone-reponse");

const btnRetourner =
  document.querySelector("#btn-retourner");

const btnCorrect =
  document.querySelector("#btn-correct");

const btnIncorrect =
  document.querySelector("#btn-incorrect");

// =====================================
// PROGRESSION
// =====================================

function mettreAJourProgression() {

  const total =
    etat.cartes.length;

  const courant =
    etat.indexCourant + 1;

  const pourcent =
    Math.round(
      (etat.indexCourant / total) * 100
    );

  indicateurProg.innerHTML = `

    <div class="progression-texte">
      Carte ${courant} / ${total}
      &nbsp;|&nbsp;
      ✓ ${etat.bonnesReponses}
      &nbsp;
      ✗ ${etat.mauvaisesReponses}
    </div>

    <div class="barre-progression">
      <div
        class="remplissage"
        style="width:${pourcent}%">
      </div>
    </div>
  `;
}

// =====================================
// AFFICHER CARTE
// =====================================

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

  carte.classList.remove("retournee");

  zoneReponse.classList.add("cache");

  btnRetourner.textContent =
    "Retourner la carte";

  mettreAJourProgression();
}

// =====================================
// RETOURNER
// =====================================

function retournerCarte() {

  etat.estRetournee =
    !etat.estRetournee;

  carte.classList.toggle("retournee");

  if (etat.estRetournee) {

    zoneReponse.classList.remove("cache");

    btnRetourner.textContent =
      "Revoir la question";

  } else {

    zoneReponse.classList.add("cache");

    btnRetourner.textContent =
      "Retourner la carte";
  }
}

// =====================================
// NAVIGATION
// =====================================

function passerCarteSuivante() {

  etat.indexCourant++;

  if (
    etat.indexCourant >= etat.cartes.length
  ) {

    alert("Session terminée !");
    return;
  }

  afficherCarteCourante();
}

function enregistrerBonneReponse() {

  etat.bonnesReponses++;

  passerCarteSuivante();
}

function enregistrerMauvaiseReponse() {

  etat.mauvaisesReponses++;

  passerCarteSuivante();
}

// =====================================
// ÉVÉNEMENTS
// =====================================

btnRetourner.addEventListener(
  "click",
  retournerCarte
);

sceneCarte.addEventListener(
  "click",
  retournerCarte
);

btnCorrect.addEventListener(
  "click",
  enregistrerBonneReponse
);

btnIncorrect.addEventListener(
  "click",
  enregistrerMauvaiseReponse
);

// =====================================
// DÉMARRAGE
// =====================================

etat.cartes =
  melangerTableau(BANQUE_CARTES);

afficherCarteCourante();