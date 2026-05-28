
//script.js
// === CALCULATEUR DE POURBOIRE ===
 
// --- Sélection des éléments ---
const inputMontant    = document.querySelector('#montant');
const inputPersonnes  = document.querySelector('#personnes');
const btnsTip         = document.querySelectorAll('.btn-tip');
const spanPourboirePP = document.querySelector('#pourboire-pp');
const spanTotalPP     = document.querySelector('#total-pp');
const msgErreur       = document.querySelector('#message-erreur');
 
// --- État de l'application ---
let pourcentageTip = 15;
 
// --- Écouteurs d'événements ---
inputMontant.addEventListener('input', calculer);
inputPersonnes.addEventListener('input', calculer);
 
btnsTip.forEach(bouton => {
  bouton.addEventListener('click', () => {
    btnsTip.forEach(b => b.classList.remove('actif'));
    bouton.classList.add('actif');
    pourcentageTip = Number(bouton.dataset.tip);
    calculer();
  });
});
 
// Activer 15% par défaut
document.querySelector('[data-tip="15"]').classList.add('actif');
 
// --- Fonctions ---
function calculer() {
  const montant   = parseFloat(inputMontant.value);
  const personnes = parseInt(inputPersonnes.value);
 
  if (isNaN(montant) || montant <= 0 ||
      isNaN(personnes) || personnes < 1) {
    spanPourboirePP.textContent = '0.00 €';
    spanTotalPP.textContent     = '0.00 €';
    if (inputMontant.value || inputPersonnes.value) {
      msgErreur.textContent =
        'Veuillez entrer des valeurs valides et positives.';
      msgErreur.style.display = 'block';
    }
    return;
  }
 
  msgErreur.style.display = 'none';
 
  const pourboire = montant * (pourcentageTip / 100);
  const total     = montant + pourboire;
 
  spanPourboirePP.textContent =
    (pourboire / personnes).toFixed(2) + ' €';
  spanTotalPP.textContent =
    (total / personnes).toFixed(2) + ' €';
}