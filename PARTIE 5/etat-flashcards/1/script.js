// =============================================
// BANQUE DE CARTES
// =============================================

const BANQUE_CARTES = [

  {
    id: 1,
    categorie: "Mathématiques",
    niveau: "terminale",
    question: "Quelle est la dérivée de ln(x) ?",
    reponse: "1/x",
    explication: "La dérivée de ln(x) est 1/x."
  },

  {
    id: 2,
    categorie: "Mathématiques",
    niveau: "terminale",
    question: "Que vaut e⁰ ?",
    reponse: "1",
    explication: "Toute puissance zéro vaut 1."
  },

  {
    id: 3,
    categorie: "Physique",
    niveau: "terminale",
    question: "Quelle est la formule de l'énergie cinétique ?",
    reponse: "Ec = ½mv²",
    explication: "Énergie liée au mouvement."
  },

  {
    id: 4,
    categorie: "Histoire",
    niveau: "première",
    question: "En quelle année a eu lieu la Révolution française ?",
    reponse: "1789",
    explication: "Prise de la Bastille."
  },

  {
    id: 5,
    categorie: "Philosophie",
    niveau: "terminale",
    question: "Qui a écrit le Discours de la méthode ?",
    reponse: "René Descartes",
    explication: "Auteur du cogito."
  }

];

// =============================================
// FISHER-YATES
// =============================================

function melangerTableau(tableau) {

  const copie = [...tableau];

  for (let i = copie.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [copie[i], copie[j]] = [copie[j], copie[i]];

  }

  return copie;

}

// =============================================
// ÉTAT APPLICATION
// =============================================

const etat = {

  cartes: melangerTableau(BANQUE_CARTES),

  indexCourant: 0,

  estRetournee: false,

  bonnesReponses: 0,

  mauvaisesReponses: 0,

  sessionTerminee: false

};

// =============================================
// CONSOLE
// =============================================

console.clear();

console.log("=== BANQUE ORIGINALE ===");
console.log(BANQUE_CARTES);

console.log("");

console.log("=== ÉTAT INITIAL ===");
console.log(etat);

console.log("");

console.log("=== NOUVEAU MÉLANGE ===");
console.log(melangerTableau(BANQUE_CARTES));