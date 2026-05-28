
//script.js

// === CALCULATEUR DE POURBOIRE ===

// --- Sélection des éléments ---
const inputMontant = document.querySelector('#montant');
const inputPersonnes = document.querySelector('#personnes');
const btnsTip = document.querySelectorAll('.btn-tip');

const spanPourboirePP = document.querySelector('#pourboire-pp');
const spanTotalPP = document.querySelector('#total-pp');
const msgErreur = document.querySelector('#message-erreur');

// --- État de l'application ---
let pourcentageTip = 15;

// --- Écouteurs d'événements ---
inputMontant.addEventListener('input', calculer);
inputPersonnes.addEventListener('input', calculer);

btnsTip.forEach(bouton => {
  bouton.addEventListener('click', () => {

    // Retirer la classe actif
    btnsTip.forEach(b => b.classList.remove('actif'));

    // Ajouter actif au bouton cliqué
    bouton.classList.add('actif');

    // Lire le pourcentage
    pourcentageTip = Number(bouton.dataset.tip);

    // Recalculer
    calculer();
  });
});

// Activer 15% par défaut
document
  .querySelector('[data-tip="15"]')
  .classList.add('actif');

// --- Fonction principale ---
function calculer() {

  // Lire et convertir les valeurs
  const montant = parseFloat(inputMontant.value);
  const personnes = parseInt(inputPersonnes.value);

  // Vérification des erreurs
  if (
    isNaN(montant) || montant <= 0 ||
    isNaN(personnes) || personnes < 1
  ) {

    // Réinitialiser les résultats
    spanPourboirePP.textContent = '0.00 €';
    spanTotalPP.textContent = '0.00 €';

    // Afficher le message d'erreur seulement
    // si l'utilisateur a commencé à saisir
    if (inputMontant.value || inputPersonnes.value) {

      msgErreur.textContent =
        'Veuillez entrer des valeurs valides et positives.';

      msgErreur.style.display = 'block';
    }

    return;
  }

  // Masquer le message d'erreur
  msgErreur.style.display = 'none';

  // Calcul du pourboire
  const pourboire =
    montant * (pourcentageTip / 100);

  // Calcul du total
  const total =
    montant + pourboire;

  // Calcul par personne
  const pourboireParPersonne =
    pourboire / personnes;

  const totalParPersonne =
    total / personnes;

  // Mise à jour du DOM
  spanPourboirePP.textContent =
    pourboireParPersonne.toFixed(2) + ' €';

  spanTotalPP.textContent =
    totalParPersonne.toFixed(2) + ' €';
}