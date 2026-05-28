// =============================================
// CONFIGURATION
// =============================================

const CONFIG = {
  CLE_API  : "2e8ce7edd37d6723cbc2b408ca753def",
  URL_BASE : "https://api.openweathermap.org/data/2.5/weather",
  LANGUE   : "fr",
  UNITES   : "metric"
};

// =============================================
// FONDS MÉTÉO
// =============================================

const FONDS_METEO = {
  "01d": "fond-ensoleille",
  "01n": "fond-nuit",
  "02d": "fond-nuageux",
  "02n": "fond-nuageux",
  "03d": "fond-nuageux",
  "04d": "fond-nuageux",
  "09d": "fond-pluvieux",
  "10d": "fond-pluvieux",
  "10n": "fond-pluvieux",
  "11d": "fond-orage",
  "13d": "fond-neige",
  "50d": "fond-nuageux"
};

// =============================================
// ÉLÉMENTS DOM
// =============================================

const champVille = document.querySelector("#champ-ville");
const btnRechercher = document.querySelector("#btn-rechercher");
const btnGeoloc = document.querySelector("#btn-geoloc");
const btnReessayer = document.querySelector("#btn-reessayer");

const zoneChargement = document.querySelector("#zone-chargement");
const carteMeteo = document.querySelector("#carte-meteo");
const zoneErreur = document.querySelector("#zone-erreur");
const messageErreur = document.querySelector("#message-erreur");

const zoneHistorique = document.querySelector("#historique");

// =============================================
// ÉTAT APPLICATION
// =============================================

let dernierVille = "";
let historiqueRecherches = [];

const MAX_HISTORIQUE = 5;

// =============================================
// URL API
// =============================================

function construireURL(ville) {

  return `${CONFIG.URL_BASE}?q=${encodeURIComponent(ville)}&appid=${CONFIG.CLE_API}&units=${CONFIG.UNITES}&lang=${CONFIG.LANGUE}`;

}

function construireURLCoords(lat, lon) {

  return `${CONFIG.URL_BASE}?lat=${lat}&lon=${lon}&appid=${CONFIG.CLE_API}&units=${CONFIG.UNITES}&lang=${CONFIG.LANGUE}`;

}

// =============================================
// EXTRACTION JSON
// =============================================

function extraireInfosMeteo(donnees) {

  const {
    name,
    sys: { country },
    main: {
      temp,
      feels_like,
      humidity,
      temp_min,
      temp_max
    },
    weather: [{
      description,
      icon
    }],
    wind: {
      speed
    },
    visibility
  } = donnees;

  return {

    ville: `${name}, ${country}`,

    temperature: Math.round(temp),

    ressenti: Math.round(feels_like),

    humidite: humidity,

    tempMin: Math.round(temp_min),

    tempMax: Math.round(temp_max),

    description:
      description.charAt(0).toUpperCase() +
      description.slice(1),

    icone:
      `https://openweathermap.org/img/wn/${icon}@2x.png`,

    codeIcone: icon,

    vent: (speed * 3.6).toFixed(1),

    visibilite: (visibility / 1000).toFixed(1)

  };

}

// =============================================
// ÉTATS UI
// =============================================

function afficherChargement() {

  zoneChargement.classList.remove("cache");

  carteMeteo.classList.add("cache");

  zoneErreur.classList.add("cache");

}

function afficherCarte(infos) {

  zoneChargement.classList.add("cache");

  zoneErreur.classList.add("cache");

  carteMeteo.classList.remove("cache");

  afficherMeteo(infos);

  mettreAJourFond(infos.codeIcone);

}

function afficherErreur(message) {

  zoneChargement.classList.add("cache");

  carteMeteo.classList.add("cache");

  zoneErreur.classList.remove("cache");

  messageErreur.textContent = message;

}

// =============================================
// FOND DYNAMIQUE
// =============================================

function mettreAJourFond(codeIcone) {

  Object.values(FONDS_METEO).forEach(classe => {
    document.body.classList.remove(classe);
  });

  document.body.classList.add(
    FONDS_METEO[codeIcone] || "fond-defaut"
  );

}

// =============================================
// AFFICHAGE MÉTÉO
// =============================================

function afficherMeteo(infos) {

  carteMeteo.innerHTML = `
    <div class="entete-meteo">

      <div class="nom-ville">
        ${infos.ville}
      </div>

      <img
        class="icone-meteo"
        src="${infos.icone}"
        alt="${infos.description}"
      />

    </div>

    <div class="temperature-principale">
      ${infos.temperature}
      <span class="unite">°C</span>
    </div>

    <div class="description">
      ${infos.description}
    </div>

    <div class="details-meteo">

      <div class="detail">
        <span class="label-detail">Ressenti</span>
        <span class="valeur-detail">${infos.ressenti}°C</span>
      </div>

      <div class="detail">
        <span class="label-detail">Humidité</span>
        <span class="valeur-detail">${infos.humidite}%</span>
      </div>

      <div class="detail">
        <span class="label-detail">Vent</span>
        <span class="valeur-detail">${infos.vent} km/h</span>
      </div>

      <div class="detail">
        <span class="label-detail">Visibilité</span>
        <span class="valeur-detail">${infos.visibilite} km</span>
      </div>

      <div class="detail">
        <span class="label-detail">Min / Max</span>
        <span class="valeur-detail">
          ${infos.tempMin}° / ${infos.tempMax}°
        </span>
      </div>

    </div>
  `;

}

// =============================================
// HISTORIQUE
// =============================================

function ajouterAHistorique(ville) {

  historiqueRecherches =
    historiqueRecherches.filter(v =>
      v.toLowerCase() !== ville.toLowerCase()
    );

  historiqueRecherches.unshift(ville);

  if (historiqueRecherches.length > MAX_HISTORIQUE) {
    historiqueRecherches.pop();
  }

  afficherHistorique();

}

function afficherHistorique() {

  if (historiqueRecherches.length === 0) {

    zoneHistorique.innerHTML = "";

    return;

  }

  let html = `
    <p class="titre-historique">
      Recherches récentes :
    </p>
  `;

  historiqueRecherches.forEach(ville => {

    html += `
      <button class="btn-historique">
        ${ville}
      </button>
    `;

  });

  zoneHistorique.innerHTML = html;

}

// =============================================
// RECHERCHE
// =============================================

async function rechercherVille(ville) {

  if (!ville.trim()) return;

  dernierVille = ville;

  afficherChargement();

  try {

    const reponse =
      await fetch(construireURL(ville));

    if (!reponse.ok) {

      if (reponse.status === 404) {

        throw new Error(
          `Ville "${ville}" introuvable.`
        );

      }

      throw new Error(
        `Erreur ${reponse.status}`
      );

    }

    const donnees = await reponse.json();

    const infos =
      extraireInfosMeteo(donnees);

    afficherCarte(infos);

    ajouterAHistorique(ville);

  } catch (erreur) {

    afficherErreur(erreur.message);

  }

}

// =============================================
// GÉOLOCALISATION
// =============================================

async function rechercherParCoordonnees(lat, lon) {

  afficherChargement();

  try {

    const reponse =
      await fetch(construireURLCoords(lat, lon));

    if (!reponse.ok) {

      throw new Error(
        "Impossible de charger la météo."
      );

    }

    const donnees = await reponse.json();

    const infos =
      extraireInfosMeteo(donnees);

    afficherCarte(infos);

  } catch (erreur) {

    afficherErreur(erreur.message);

  }

}

// =============================================
// ÉVÉNEMENTS
// =============================================

btnRechercher.addEventListener("click", () => {

  rechercherVille(champVille.value.trim());

});

champVille.addEventListener("keydown", event => {

  if (event.key === "Enter") {

    rechercherVille(champVille.value.trim());

  }

});

btnReessayer.addEventListener("click", () => {

  if (dernierVille) {

    rechercherVille(dernierVille);

  }

});

btnGeoloc.addEventListener("click", () => {

  if (!navigator.geolocation) {

    afficherErreur(
      "Géolocalisation non supportée."
    );

    return;

  }

  navigator.geolocation.getCurrentPosition(

    async position => {

      const {
        latitude,
        longitude
      } = position.coords;

      await rechercherParCoordonnees(
        latitude,
        longitude
      );

    },

    erreur => {

      afficherErreur(erreur.message);

    }

  );

});

zoneHistorique.addEventListener("click", event => {

  if (
    event.target.classList.contains("btn-historique")
  ) {

    const ville = event.target.textContent.trim();

    champVille.value = ville;

    rechercherVille(ville);

  }

});

// =============================================
// DÉMARRAGE
// =============================================

rechercherVille("Paris");