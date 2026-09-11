function verifierReponse() {
  let saisie = document.getElementById('saisieReponse').value.trim().toLowerCase();
  let msg = document.getElementById('msgResultat');

  document.getElementById('saisieReponse').disabled = true;
  document.getElementById('btnValider').style.display = 'none';

  if (reponsesValides.includes(saisie)) {
    if (indexQuestion === 10) {
      ajouterPieces(5);
      msg.style.color = "#2ecc71";
      msg.innerText = "🎉 BRAVO ! Tu as terminé l'exercice ! (+5 pièces bonus !)";
      let v = new SpeechSynthesisUtterance("Bravo ! Vous avez réussi le niveau !");
      v.lang = 'fr-FR';
      window.speechSynthesis.speak(v);
    } else {
      ajouterPieces(2);
      msg.style.color = "#2ecc71";
      msg.innerText = "✅ Bravo ! Bonne réponse (+2 pièces !)";
      let v = new SpeechSynthesisUtterance("Bravo ! C'est la bonne réponse.");
      v.lang = 'fr-FR';
      window.speechSynthesis.speak(v);
    }
    document.getElementById('btnSuivant').style.display = 'inline-block';
  } else {
    msg.style.color = "#e74c3c";
    msg.innerText = `❌ Inexact. La réponse attendue était : ${reponsesValides[0]}`;

    let v = new SpeechSynthesisUtterance(`Inexact. La réponse était ${reponsesValides[0]}`);
    v.lang = 'fr-FR';
    window.speechSynthesis.speak(v);

    // Passe directement à la suite après 1.5 seconde
    setTimeout(() => {
      questionSuivante();
    }, 1500);
  }
}let historique = ['matieres'];
let matiereSelec = '', niveauSelec = '';
let niveauExoActuel = 1, indexQuestion = 1;
let reponsesValides = [];
let questionsPosees = [];
let bonnesReponsesCount = 0; // Compteur pour la note globale

let pieces = parseInt(localStorage.getItem('pieces_cagnotte')) || 0;
let videosAchetees = JSON.parse(localStorage.getItem('videos_achetees')) || [];

document.getElementById('nbPieces').innerText = pieces;

// Catalogue des vidéos et banques de questions restent identiques...

function lancerNiveauExo(numNiveau) {
  niveauExoActuel = numNiveau;
  indexQuestion = 1;
  bonnesReponsesCount = 0; // Remise à zéro de la note
  questionsPosees = [];
  genererQuestionAleatoire();
  naviguerVers('jeu');
}

function genererQuestionAleatoire() {
  document.getElementById('msgResultat').innerText = '';
  document.getElementById('saisieReponse').value = '';
  document.getElementById('saisieReponse').disabled = false;
  document.getElementById('btnSuivant').style.display = 'none';
  document.getElementById('btnValider').style.display = 'inline-block';

  document.getElementById('progressionText').innerText = `Question ${indexQuestion} / 10`;
  document.getElementById('nomExercice').innerText = `Exercice ${niveauExoActuel} (${niveauSelec})`;

  let q = "", r = [];
  let facteurDiff = (niveauExoActuel * 2) + indexQuestion;

  if (matiereSelec === 'Mathématiques') {
    if (['CP', 'CE1', 'CE2'].includes(niveauSelec)) {
      let max = 5 * facteurDiff;
      let a = rand(1, max), b = rand(1, max);
      q = `Calcule : ${a} + ${b} = ?`;
      r = [`${a + b}`];
    } else if (['CM1', 'CM2'].includes(niveauSelec)) {
      let a = rand(2, 5 + indexQuestion), b = rand(3, 10 + niveauExoActuel);
      q = `Calcule le produit : ${a} × ${b} = ?`;
      r = [`${a * b}`];
    } else if (niveauSelec === '6ème') {
      let type = indexQuestion % 3;
      if (type === 1) {
        let long = 5 + facteurDiff, larg = rand(2, 8);
        q = `Un rectangle mesure ${long} cm de long et ${larg} cm de large. Quelle est son aire (cm²) ?`;
        r = [`${long * larg}`];
      } else if (type === 2) {
        let p1 = rand(10, 50), p2 = rand(5, 20);
        q = `Calcule le périmètre d'un triangle dont les côtés mesurent ${p1} cm, ${p2} cm et ${p1+2} cm :`;
        r = [`${p1 + p2 + p1 + 2}`];
      } else {
        let a = rand(10, 50) * 2, b = rand(1, 9);
        q = `Calcule : ${a} ÷ 2 + ${b} = ?`;
        r = [`${(a/2) + b}`];
      }
    } else if (['5ème', '4ème', '3ème'].includes(niveauSelec)) {
      let a = rand(2, 5 + indexQuestion);
      let b = rand(1, 10);
      let res = a * b;
      q = `Résous l'équation simple : ${a}x = ${res}. Que vaut x ?`;
      r = [`${b}`];
    } else {
      let a = rand(1, 3 + indexQuestion);
      q = `Quelle est la dérivée de f(x) = ${a}x² ?`;
      r = [`${2*a}x`];
    }
  } else {
    let banque = banqueFrancais[niveauSelec] || banqueFrancais['6ème'];
    let dispo = banque.filter(item => !questionsPosees.includes(item.q));

    if (dispo.length === 0) {
      questionsPosees = [];
      dispo = banque;
    }

    let choix = dispo[Math.floor(Math.random() * dispo.length)];
    questionsPosees.push(choix.q);
    q = choix.q;
    r = choix.r;
  }

  document.getElementById('consigneText').innerText = q;
  reponsesValides = r;

  setTimeout(lireConsigne, 200);
}

function verifierReponse() {
  let saisie = document.getElementById('saisieReponse').value.trim().toLowerCase();
  let msg = document.getElementById('msgResultat');

  document.getElementById('saisieReponse').disabled = true;
  document.getElementById('btnValider').style.display = 'none';

  if (reponsesValides.includes(saisie)) {
    bonnesReponsesCount++; // On compte juste le point pour la note finale (0 argent ici)
    msg.style.color = "#2ecc71";
    msg.innerText = "✅ Bonne réponse !";
    let v = new SpeechSynthesisUtterance("Bonne réponse !");
    v.lang = 'fr-FR';
    window.speechSynthesis.speak(v);
    
    document.getElementById('btnSuivant').style.display = 'inline-block';
  } else {
    msg.style.color = "#e74c3c";
    msg.innerText = `❌ Inexact. La réponse était : ${reponsesValides[0]}`;

    let v = new SpeechSynthesisUtterance(`Inexact. La réponse était ${reponsesValides[0]}`);
    v.lang = 'fr-FR';
    window.speechSynthesis.speak(v);

    // Passe automatiquement à la question suivante après 1.5s
    setTimeout(() => {
      questionSuivante();
    }, 1500);
  }
}

function questionSuivante() {
  if (indexQuestion < 10) {
    indexQuestion++;
    genererQuestionAleatoire();
  } else {
    // FIN DE L'EXERCICE : C'est ici et seulement ici que l'argent est crédité + Note globale
    terminerExercice();
  }
}

function terminerExercice() {
  let noteGlobale = bonnesReponsesCount; // Sur 10
  let piecesGagnees = 20; // 🪙 Montant fixe d'argent gagné uniquement à la fin de l'exercice
  
  ajouterPieces(piecesGagnees);

  document.querySelector('.card-jeu').innerHTML = `
    <h2 style="color:#00f0ff;">🏆 Exercice Terminé !</h2>
    <div style="font-size: 1.5rem; margin: 20px 0; color: #ffd700;">Note globale : ${noteGlobale} / 10</div>
    <p style="margin-bottom: 20px; color: #b19cd9;">Bravo ! Tu as gagné <strong style="color:#ffd700;">${piecesGagnees} pièces</strong> pour avoir terminé cet exercice !</p>
    <button class="btn-valider" onclick="location.reload()">Retour au menu</button>
  `;

  let v = new SpeechSynthesisUtterance(`Exercice terminé. Note globale : ${noteGlobale} sur 10. Tu gagnes ${piecesGagnees} pièces.`);
  v.lang = 'fr-FR';
  window.speechSynthesis.speak(v);
}