document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initDialogs();
  initProofButtons();
  initSimulator();
});

// 1. Scroll Reveal
function initScrollReveal() {
  const rv = [...document.querySelectorAll('.rv')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('on');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    rv.forEach((el) => io.observe(el));
  } else {
    rv.forEach((el) => el.classList.add('on'));
  }
}

// 2. Dialogs + Fallback per Safari (Modern Web Guidance: light-dismiss-a-dialog)
function initDialogs() {
  const openSimBtn = document.getElementById('openSimModalBtn');
  const simDialog = document.getElementById('simDialog');

  if (openSimBtn && simDialog) {
    openSimBtn.addEventListener('click', () => {
      simDialog.showModal();
    });
  }

  const allDialogs = document.querySelectorAll('dialog');
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    allDialogs.forEach((dialog) => {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (isDialogContent) return;
        dialog.close();
      });
    });
  }
}

// 3. Bozze di lavoro complete
const PROOFS = {
  agenda: {
    kicker: '01 · Agenda e roadmap',
    title: 'La nota del mattino e il follow-up dopo le riunioni',
    html: `
      <p>Per dare a entrambi una visione chiara appena inizia la giornata senza farvi perdere tempo a chiedere aggiornamenti, invio ogni mattina uno schema fisso diviso in quattro punti:</p>
      <ul>
        <li><b>1. Numeri del giorno prima (concordati insieme):</b> andamento delle metriche che abbiamo deciso di tenere sotto controllo ogni giorno (nuove registrazioni, conversioni a pagamento, risultati delle campagne attive) per capire subito se si muove qualcosa o se c'è un calo.</li>
        <li><b>2. Preparazione ai vostri meeting della giornata:</b> per ogni call o incontro che avete in calendario, preparo poche righe con il contesto, lo storico dei contatti precedenti e i dati estratti da Saikoo sull'azienda o sul partner che avrete davanti.</li>
        <li><b>3. Le attività da chiudere entro sera:</b> l'elenco delle priorità operative della giornata tra sviluppo prodotto, commerciale e amministrazione, distinguendo cosa seguo io direttamente e dove serve un vostro ok veloce.</li>
        <li><b>4. Spunti su cosa cambiare o provare:</b> osservazioni nate guardando i dati, parlando coi clienti o vedendo cosa fanno altre aziende, per proporre continuamente piccoli test o miglioramenti.</li>
      </ul>
    `
  },
  talenti: {
    kicker: '02 · Talenti',
    title: 'Tre prove pratiche di selezione per trovare chi sa fare davvero',
    html: `
      <p>Guardando come assumono le startup che crescono più in fretta in Europa e negli Stati Uniti, il punto in comune è inserire nel processo di selezione una prova reale sul lavoro quotidiano. Ecco tre test pratici che applicherei a Modena:</p>
      <ul>
        <li><b>1. Per il ruolo di BDR (modello usato in Compri):</b> oltre a valutare il percorso della persona, inseriamo una chiamata a freddo simulata direttamente al nostro Team Leader BDR. Serve per misurare subito chi non ha paura di prendere in mano la cornetta, come reagisce a un "non mi interessa" nei primi dieci secondi e se sa fare domande invece di recitare un copione.</li>
        <li><b>2. Per il ruolo di Account Executive (AE):</b> venti minuti prima del colloquio diamo al candidato i dati reali di bilancio di un'azienda italiana presa da Saikoo (ad esempio una PMI che cresce di fatturato ma incassa a 140 giorni e ha debiti bancari in salita). Durante il colloquio deve condurre la trattativa con uno di noi che interpreta l'imprenditore scettico ("Ho già il commercialista che mi manda i bilanci, perché dovrei pagare Saikoo?"), per vedere se sa vendere il valore economico del prodotto.</li>
        <li><b>3. Per il ruolo di Software Engineer:</b> invece dei test teorici astratti, diamo un piccolo caso reale (ad esempio pulire e visualizzare un set di dati camerali sporchi o aggiungere un filtro rapido su una tabella con migliaia di righe) lasciando usare liberamente gli strumenti AI che userebbe al lavoro. Poi facciamo quindici minuti di chiamata in cui modifica un requisito in diretta davanti a noi, per capire se padroneggia davvero quello che ha scritto.</li>
      </ul>
    `
  },
  vendite: {
    kicker: '03 · Vendite B2B',
    title: 'Usare i dati di bilancio di Saikoo per aprire le chiamate a freddo',
    html: `
      <p>Quando si chiama un'azienda a freddo, partire da un dato concreto del suo bilancio cambia completamente il tono della conversazione rispetto alle solite chiamate generiche.</p>
      <pre>Azienda individuata tramite i filtri di Saikoo:
Settore: Meccanica / Componentistica (Provincia di Modena)
Fatturato: 9,4 milioni di euro (+14% sull'anno precedente)
EBITDA: 9,5%
Giorni medi di incasso clienti (DSO): 134 giorni
Giorni medi di pagamento fornitori (DPO): 92 giorni</pre>
      <p><b>Esempio di apertura al telefono con l'imprenditore o il direttore commerciale:</b></p>
      <p><i>"Buongiorno, sono Matteo di Saikoo a Modena. Ho visto dal vostro ultimo bilancio che siete cresciuti del 14% superando i 9 milioni. La chiamo per un dato specifico: vedevo che incassate mediamente a 134 giorni mentre pagate i fornitori a 92. Noi a Modena abbiamo sviluppato il primo CRM con i dati delle 6 milioni di aziende italiane già integrati, pensato proprio per evitare che i commerciali portino in casa ordini da clienti che poi pagano in ritardo. Le posso chiedere sette minuti giovedì per farle vedere come lo usano le reti vendita?"</i></p>
    `
  },
  marketing: {
    kicker: '04 · Marketing, LinkedIn e Ads',
    title: 'Brief per autori LinkedIn, riutilizzo video in Ads e testimonianze B2B',
    html: `
      <p>Tre azioni concrete su cui lavorerei per portare iscritti in target senza disperdere budget:</p>
      <ul>
        <li><b>1. Fornire brief pronti a chi analizza già aziende e settori su LinkedIn:</b> su LinkedIn ci sono decine di commercialisti, consulenti aziendali e analisti che pubblicano regolarmente post in cui commentano i risultati di un'azienda o i numeri di un settore. L'idea è mapparli, contattarli e fornirgli regolarmente dei brief già pronti con i dati estratti da Saikoo: a loro risparmiamo ore di ricerca, e in cambio inseriscono una riga finale o uno screenshot che cita Saikoo davanti a migliaia di imprenditori.</li>
        <li><b>2. Usare i video dei creator e le testimonianze clienti dentro le nostre Ads:</b> nel B2B ciò che convince davvero un imprenditore è vedere il beneficio pratico ottenuto da un'altra azienda simile alla sua. Oltre a girare brevi video-testimonianze con i nostri clienti attivi, prendiamo gli spezzoni migliori dei creator con cui collaboriamo e li usiamo come creatività nelle campagne Meta, TikTok e LinkedIn Ads, testando 4 o 5 aperture diverse nei primi tre secondi.</li>
        <li><b>3. Accordi a performance con profili verticali:</b> affiancare ai grandi divulgatori una rete di profili più piccoli ma seguiti solo da chi ha partita IVA o guida reti commerciali, legando una parte del compenso agli abbonamenti annuali attivati.</li>
      </ul>
    `
  },
  progetti: {
    kicker: '05 · Progetti speciali',
    title: 'Il format "La PMI Solida" a Modena e il filo diretto con i giornali economici',
    html: `
      <p><b>1. Come strutturerei il format "La PMI Solida" (interviste in sede a Modena):</b></p>
      <p>Filtriamo su Saikoo le aziende modenesi (5–50 milioni di ricavi) con i migliori indicatori di bilancio degli ultimi tre anni. Le contattiamo per dirgli che rientrano tra le PMI più solide della provincia e chiediamo 20 minuti in sede da loro con il fondatore o l'amministratore.</p>
      <ul>
        <li><b>Le 4 domande fisse del format:</b> (1) Qual è la scelta industriale o commerciale che vi ha permesso di mantenere questi margini negli ultimi tre anni? (2) Come selezionate i clienti e come vi proteggete dal rischio di insoluti? (3) Qual è la sfida più grande nel trovare persone giovani e portarle in azienda a Modena? (4) Dove state iniziando a usare software o intelligenza artificiale nei vostri processi?</li>
        <li><b>Perché funziona anche come acquisizione:</b> a fine intervista consegniamo una targa o un attestato fisico ("PMI Solida 2026 secondo i dati Saikoo"). L'azienda stessa ricondividerà il video e la foto sui propri canali LinkedIn taggando Saikoo davanti a tutti i suoi clienti e fornitori.</li>
      </ul>
      <p><b>2. Brief già pronti per giornalisti economici (es. Il Sole 24 Ore):</b></p>
      <p>Costruire una lista di giornalisti e pagine di divulgazione economica a cui mandare una volta al mese un'analisi di settore già impaginata (e rendersi disponibili a estrarre per loro numeri precisi in giornata quando preparano un'inchiesta).</p>
    `
  },
  crescita: {
    kicker: '07 · Crescita e Automazioni',
    title: 'Tre esempi di automazioni con n8n e piccoli tool interni per Saikoo',
    html: `
      <p>Per togliere lavoro manuale al team e sfruttare i dati di chi usa la piattaforma, ecco tre flussi che costruirei con n8n e modelli AI:</p>
      <ul>
        <li><b>1. Automazione sui clic degli utenti gratuiti (Lead Scoring per i commerciali):</b> quando un utente registrato gratuitamente apre più di tre bilanci nella stessa giornata o clicca sulla pagina dei prezzi senza acquistare, un workflow n8n legge il dominio della sua email aziendale, cerca il bilancio della sua stessa azienda dentro Saikoo e manda una notifica su Slack o HubSpot al commerciale con già pronto il numero di telefono, il fatturato e i bilanci che stava guardando.</li>
        <li><b>2. Tool interno di Discovery pre-chiamata:</b> un piccolo strumento interno dove il commerciale inserisce la Partita IVA prima di una demo call e ottiene in dieci secondi un riassunto dei punti deboli di quel bilancio (es. DSO peggiorato rispetto all'anno scorso, margini in calo rispetto alla media del suo codice ATECO) da usare come argomento durante la chiamata.</li>
        <li><b>3. Follow-up automatico personalizzato dopo le demo:</b> finita una chiamata commerciale, un flusso recupera gli appunti della call e prepara in bozza l'email di follow-up con allegato un esempio di lista clienti del settore specifico del prospect.</li>
      </ul>
    `
  }
};

function initProofButtons() {
  const btns = document.querySelectorAll('[data-proof]');
  const dialog = document.getElementById('proofDialog');
  const kicker = document.getElementById('proofKicker');
  const title = document.getElementById('proofTitle');
  const body = document.getElementById('proofBody');

  btns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-proof');
      const item = PROOFS[key];
      if (!item || !dialog) return;

      kicker.textContent = item.kicker;
      title.textContent = item.title;
      body.innerHTML = item.html;
      dialog.showModal();
    });
  });
}

// 4. Simulatore 25.000 -> 100.000 utenti + Esportazione CSV
function initSimulator() {
  const sNewUsers = document.getElementById('sNewUsers');
  const sConv = document.getElementById('sConv');
  const sUltra = document.getElementById('sUltra');
  const sCredits = document.getElementById('sCredits');
  const sBudget = document.getElementById('sBudget');
  const exportBtn = document.getElementById('exportCsvBtn');

  if (!sNewUsers) return;

  function calc() {
    const base = 25000;
    const target = 100000;
    const delta = target - base;

    const newUsers = Number(sNewUsers.value);
    const conv = Number(sConv.value) / 100;
    const ultraShare = Number(sUltra.value) / 100;
    const creditsArpu = Number(sCredits.value);
    const budget = Number(sBudget.value);

    const arpuSub = (1 - ultraShare) * 478.80 + ultraShare * 718.80;
    const months = delta / newUsers;
    const total12 = base + newUsers * 12;

    const paidUsersOnDelta = delta * conv;
    const newArr = paidUsersOnDelta * arpuSub;
    const creditsRev = paidUsersOnDelta * creditsArpu;

    const cacReg = budget / newUsers;
    const cacPaid = budget / (newUsers * conv);

    document.getElementById('vNewUsers').textContent = newUsers.toLocaleString('it-IT');
    document.getElementById('vConv').textContent = `${Number(sConv.value).toFixed(1).replace('.', ',')}%`;
    document.getElementById('vUltra').textContent = `${Math.round(ultraShare * 100)}%`;
    document.getElementById('vCredits').textContent = `${creditsArpu} €`;
    document.getElementById('vBudget').textContent = `${budget.toLocaleString('it-IT')} €`;

    document.getElementById('mMonths').textContent = `${months.toFixed(1).replace('.', ',')} mesi`;
    document.getElementById('mTotal12').textContent = `${total12.toLocaleString('it-IT')} utenti totali a fine mese 12`;
    document.getElementById('mArr').textContent = `${Math.round(newArr).toLocaleString('it-IT')} €`;
    document.getElementById('mArpu').textContent = `Ricavo medio annuo per abbonato: ${arpuSub.toFixed(2).replace('.', ',')} €`;
    document.getElementById('mCreditsRev').textContent = `${Math.round(creditsRev).toLocaleString('it-IT')} €`;
    document.getElementById('mCac').textContent = `Costo per iscritto: ${cacReg.toFixed(2).replace('.', ',')} € · CAC cliente pagante: ${Math.round(cacPaid)} €`;

    const barsEl = document.getElementById('miniBars');
    if (barsEl) {
      const maxVal = Math.max(105000, total12);
      let html = '';
      for (let m = 1; m <= 12; m++) {
        const val = base + newUsers * m;
        const pct = Math.max(10, Math.min(100, Math.round((val / maxVal) * 100)));
        const hit = val >= 100000 ? 'hit' : '';
        html += `
          <div class="m-col" title="Mese ${m}: ${val.toLocaleString('it-IT')} utenti">
            <div class="m-bar ${hit}" style="height:${pct}%"></div>
            <span class="m-lbl">M${m}</span>
          </div>
        `;
      }
      barsEl.innerHTML = html;
    }

    return { base, newUsers, conv, arpuSub, creditsArpu, budget };
  }

  [sNewUsers, sConv, sUltra, sCredits, sBudget].forEach((input) => {
    input.addEventListener('input', calc);
  });

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const st = calc();
      const rows = [
        ['Mese', 'Utenti_Iniziali', 'Nuovi_Iscritti', 'Utenti_Fine_Mese', 'Nuovi_Abbonati_Paganti', 'Ricavi_Abbonamenti_EUR', 'Ricavi_Crediti_EUR', 'Budget_Marketing_EUR']
      ];
      for (let m = 1; m <= 12; m++) {
        const uStart = st.base + st.newUsers * (m - 1);
        const uEnd = uStart + st.newUsers;
        const paid = Math.round(st.newUsers * st.conv);
        const revSub = Math.round(paid * st.arpuSub);
        const revCred = Math.round(paid * st.creditsArpu);
        rows.push([`Mese ${m}`, uStart, st.newUsers, uEnd, paid, revSub, revCred, st.budget]);
      }
      const csv = rows.map((r) => r.join(';')).join('\n');
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Modello_Saikoo_100k_Matteo_Bonardi.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  calc();
}
