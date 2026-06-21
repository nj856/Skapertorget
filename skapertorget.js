
const DJANGO   = 'http://localhost:8100';
const HELP_API = 'http://localhost:8000';
const NODE     = 'http://localhost:3000';
const STRIPE_PK = 'pk_test_51TTLOJH3mHXlEcsI962ow7Q5XSub5vw3uEqlJpiZhFHL8ANOGWrgaPoe6LVQGjZQjNKFUlKSir4cBvO15vcVwPsx00MWwV69kM';

const DEMO_USER = 'demo';
const DEMO_PASS = 'demo123';

let innlogget = false;
let innloggetNavn = '';

function loggInn() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value.trim();
  const feil = document.getElementById('login-error');

  if (user === DEMO_USER && pass === DEMO_PASS) {
    innlogget = true;
    innloggetNavn = 'Demo Bruker';
    localStorage.setItem('st_innlogget', '1');
    localStorage.setItem('st_navn', innloggetNavn);
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('app-content').style.display = 'block';
    document.getElementById('header-user-label').textContent = innloggetNavn;
    oppdaterProfilBanner();
  } else {
    feil.style.display = 'block';
  }
}

function loggUt() {
  innlogget = false;
  innloggetNavn = '';
  localStorage.removeItem('st_innlogget');
  localStorage.removeItem('st_navn');
  document.getElementById('header-user-label').textContent = 'Logg inn';
  document.getElementById('logget-inn-banner').style.display = 'none';
  document.getElementById('app-content').style.display = 'none';
  document.getElementById('login-overlay').style.display = 'flex';
}

function oppdaterProfilBanner() {
  const banner = document.getElementById('logget-inn-banner');
  if (innlogget) {
    banner.style.display = 'flex';
    document.getElementById('logget-inn-navn').textContent = innloggetNavn;
  } else {
    banner.style.display = 'none';
  }
}

function sjekkLagretInnlogging() {
  
  localStorage.removeItem('st_innlogget');
  localStorage.removeItem('st_navn');
}
function showBankID() {
  document.getElementById('bankid-screen').style.display = 'block';
}

window.showBankID = function() {
  document.getElementById('bankid-screen').style.display = 'block';
};

function skjulBankid() {
  document.getElementById('bankid-screen').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('.bankid-btn').onclick = function() {
    document.getElementById('bankid-screen').style.display = 'block';
  };
});

function nav(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('n-' + id);
  if (btn) btn.classList.add('active');
  window.scrollTo(0, 0);
  if (id === 'betaling') { initStripe(); loadPayProducts(); }
  if (id === 'hjelp')    loadTickets();
  if (id === 'chat')     loadMessages();
  if (id === 'profil')   oppdaterProfilBanner();
}

function globalSearch() {
  const q = document.getElementById('global-search').value.trim();
  if (!q) return;
  nav('produkter');
  document.getElementById('p-search').value = q;
  filterProducts();
}

async function checkConnections() {
  const check = async (url, elId) => {
    const el = document.getElementById(elId);
    try {
      await fetch(url, { signal: AbortSignal.timeout(2500) });
      el.textContent = ' tilkoblet'; el.className = 'conn-ok';
    } catch {
      el.textContent = ' frakoblet'; el.className = 'conn-err';
    }
  };
  await Promise.all([
    check(`${DJANGO}/api/clothing/`,       's-django'),
    check(`${NODE}/test-config`,           's-node'),
    check(`${HELP_API}/api/help/tickets/`, 's-help'),
  ]);
}

function showAlert(id, msg, ok = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = 'alert show ' + (ok ? 'alert-ok' : 'alert-err');
  setTimeout(() => el.classList.remove('show'), 6000);
}

function catLabel(c) {
  return { genser:'Genser', bukse:'Bukse', sokker:'Sokker', topper:'Topper', sko: 'Sko', kjoler: 'Kjoler' }[c] || c;
}

function prodCardHTML(p) {
  const price = parseFloat(p.price);
  return `<div class="prod-card">
    <div class="prod-img">
      ${p.image_url ? `<img src="${p.image_url}" alt="${p.name}"/>` : ''}
      <div class="prod-new-badge">Nyhet</div>
      <div class="prod-fav"></div>
    </div>
    <div class="prod-body">
      <div class="prod-cat-tag">${catLabel(p.category)}</div>
      <div class="prod-price">${price.toLocaleString('nb-NO')} kr</div>
      <div class="prod-name">${p.name}</div>
      <div class="prod-meta">
        <span>Str. ${p.size}</span>

      </div>
    </div>
  </div>`;
}

let allClothing = [
      { id:1, name:'Grå Strikket Genser – Gina Tricot', category:'genser', size:'S/M', price:'299.00', stock:1, image_url:'bilder/genser_gra_gina.jpg' },
      { id:2, name:'Grå Oversized Genser', category:'genser', size:'M/L', price:'349.00', stock:1, image_url:'bilder/genser_gra_oversized.jpg' },
      { id:3, name:'Blå Strikket Genser med Mønster', category:'genser', size:'M', price:'399.00', stock:1, image_url:'bilder/genser_bla_monster.jpg' },
      { id:4, name:'Håndstrikkede Sokker – Blå/Grønn', category:'sokker', size:'38-40', price:'149.00', stock:1, image_url:'bilder/sokker_bla_gronn.jpg' },
      { id:5, name:'Håndstrikkede Sokker – Rosa/Lilla', category:'sokker', size:'36-38', price:'149.00', stock:1, image_url:'bilder/sokker_rosa_lilla.jpg' },
      { id:6, name:'Håndstrikkede Høysokker – Brun/Hvit', category:'sokker', size:'37-39', price:'199.00', stock:1, image_url:'bilder/sokker_brun_hvit.jpg' },
      { id:7, name:'Håndstrikkede Ankelstrømper – Blå', category:'sokker', size:'38-40', price:'149.00', stock:1, image_url:'bilder/sokker_ankel_bla.jpg' },
      { id:8, name:'Håndstrikkede Høysokker – Rød/Hvit', category:'sokker', size:'37-39', price:'199.00', stock:1, image_url:'bilder/sokker_rod_hvit.jpg' },
      { id:9, name:'Lyse Denim Shorts', category:'bukse', size:'S/M', price:'249.00', stock:1, image_url:'bilder/shorts_lys_denim.jpg' },
      { id:10, name:'Grå Denim Shorts', category:'bukse', size:'S/M', price:'249.00', stock:1, image_url:'bilder/shorts_gra_denim.jpg' },
      { id:11, name:'Mørkeblå Flare Jeans', category:'bukse', size:'M', price:'349.00', stock:1, image_url:'bilder/jeans_morkeblaa_flare.jpg' },
      { id:12, name:'Lyse Straight Jeans', category:'bukse', size:'M', price:'349.00', stock:1, image_url:'bilder/jeans_lys_straight.jpg' },
      { id:13, name:'Olivengrønn Cargobukse', category:'bukse', size:'M', price:'299.00', stock:1, image_url:'bilder/bukse_cargo_oliven.jpg' },
      { id:14, name:'Hvit/Blå Strikket Genser', category:'genser', size:'M', price:'399.00', stock:1, image_url:'bilder/genser_hvit_bla.jpg' },
      { id:15, name:'Svart/Hvit Zigzag Genser', category:'genser', size:'M', price:'399.00', stock:1, image_url:'bilder/genser_svart_zigzag.jpg' },
      { id:16, name:'Blå stripete singlet', category: 'topper', size: 'S', price: '150.00', stock:1, image_url: 'bilder/singletblaa.jpg' },
      { id:17, name:'Grå oversized t-skjorte', category: 'topper', size: 'M/L', price: '250.00', stock:1, image_url: 'bilder/graatskjorte.jpg' },
      { id:18, name:'Kortermet skjorte', category: 'topper', size: 'S', price: '150.00', stock:1, image_url: 'bilder/skjorte.jpg' },
      { id:19, name:'Strikket kjole', category: 'kjoler', size: 'S', price: '350.00', stock:1, image_url: 'bilder/strikketkjole.jpg' }
];

async function loadClothing() {
  renderClothing(allClothing);
}

function renderClothing(items) {
  const html = items.map(prodCardHTML).join('');
  const hl = document.getElementById('home-loading');
  const hg = document.getElementById('home-grid');
  if (hl) hl.style.display = 'none';
  if (hg) { hg.innerHTML = html; hg.style.display = 'grid'; }
  const pl = document.getElementById('prod-loading');
  const pg = document.getElementById('prod-grid');
  const pe = document.getElementById('prod-empty');
  if (pl) pl.style.display = 'none';
  if (pg) { pg.innerHTML = html; pg.style.display = items.length ? 'grid' : 'none'; }
  if (pe) pe.style.display = items.length ? 'none' : 'block';
}

function filterProducts() {
  const q    = document.getElementById('p-search').value.toLowerCase();
  const cat  = document.getElementById('p-cat').value;
  const sort = document.getElementById('p-sort').value;
  let items = allClothing.filter(p => {
    const mq  = !q   || p.name.toLowerCase().includes(q) || catLabel(p.category).toLowerCase().includes(q);
    const mc  = !cat || p.category === cat;
    return mq && mc;
  });
  if (sort === 'price-asc')  items = [...items].sort((a,b) => parseFloat(a.price)-parseFloat(b.price));
  if (sort === 'price-desc') items = [...items].sort((a,b) => parseFloat(b.price)-parseFloat(a.price));
  renderClothing(items);
}

async function leggTilProdukt() {
  const body = {
    name:     document.getElementById('np-name').value.trim(),
    category: document.getElementById('np-cat').value,
    size:     document.getElementById('np-size').value.trim(),
    price:    parseFloat(document.getElementById('np-price').value) || 0,
    stock:    parseInt(document.getElementById('np-stock').value)   || 0,
  };
  if (!body.name || !body.size) return showAlert('np-alert', 'Navn og størrelse er påkrevd', false);
  try {
    const res = await fetch(`${DJANGO}/api/clothing/`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    if (res.ok) { showAlert('np-alert', ' Annonse publisert!'); await loadClothing(); }
    else { const e = await res.json(); showAlert('np-alert', 'Feil: ' + JSON.stringify(e), false); }
  } catch { showAlert('np-alert', ` Django ikke tilkoblet`, false); }
}

async function loadMessages() {
  const chatId = document.getElementById('chat-id-input')?.value || 1;
  const box = document.getElementById('chat-messages');
  if (!box) return;
  try {
    const res = await fetch(`${DJANGO}/messages?chat_id=${chatId}`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error();
    const msgs = await res.json();
    if (!msgs.length) {
      box.innerHTML = `<p style="color:#aaa;font-size:12px;text-align:center;margin-top:20px">Ingen meldinger enda.</p>`;
    } else {
      box.innerHTML = msgs.map(m => {
        const mine = m.avsender_id === 1;
        const selger = m.avsender_id === 2;
        const t = new Date(m.opprettet_tid).toLocaleTimeString('nb-NO', { hour:'2-digit', minute:'2-digit' });
        const slettKnapp = mine
          ? `<button onclick="slettMsg(${m.id}, 1)" style="background:transparent;border:none;cursor:pointer;color:#aaa;font-size:12px;margin-left:6px;padding:0"></button>`
          : selger
          ? `<button onclick="slettMsg(${m.id}, 2)" style="background:transparent;border:none;cursor:pointer;color:#888;font-size:12px;margin-left:6px;padding:0"></button>`
          : '';
        return `<div class="msg-row ${mine?'mine':'theirs'}"><div class="msg" style="display:flex;align-items:center;gap:4px">${m.tekst}${slettKnapp}</div><div class="msg-time">${t}</div></div>`;
      }).join('');
      box.scrollTop = box.scrollHeight;
    }
  } catch {
    box.innerHTML = `<p style="color:#aaa;font-size:12px;text-align:center;margin-top:30px"> Django ikke tilkoblet</p>`;
  }
}

async function slettMsg(id, avsenderId) {
  try {
    await fetch(`${DJANGO}/messages/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avsender_id: avsenderId })
    });
    await loadMessages();
  } catch {
    console.error('Kunne ikke slette melding');
  }
}

async function selgerSvar() {
  const input = document.getElementById('selger-input');
  const chatId = document.getElementById('chat-id-input')?.value || 1;
  const tekst = input.value.trim();
  if (!tekst) return;
  input.value = '';
  try {
    await fetch(`${DJANGO}/messages/selger-svar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: tekst, chat_id: Number(chatId) })
    });
    await loadMessages();
  } catch {
    console.error('Kunne ikke sende selgersvar');
  }
}

async function sendMsg() {
  const input = document.getElementById('chat-input');
  const chatId = document.getElementById('chat-id-input')?.value || 1;
  const tekst = input.value.trim();
  if (!tekst) return;
  input.value = '';
  try {
    const res = await fetch(`${DJANGO}/messages/send`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ message:tekst, chat_id:Number(chatId) })
    });
    if (!res.ok) throw new Error();
    await loadMessages();
  } catch {
    const box = document.getElementById('chat-messages');
    box.innerHTML += `<div class="msg-row mine"><div class="msg">${tekst}</div><div class="msg-time">nå (lokal)</div></div>`;
    box.scrollTop = box.scrollHeight;
  }
}

async function sendTilbake() {
  const body = {
    hvem_er_du: document.getElementById('t-hvem').value,
    bestilling:  document.getElementById('t-best').value,
    produkt:     document.getElementById('t-prod').value,
    vurdering:   parseInt(document.getElementById('t-vur').value) || null,
    melding:     document.getElementById('t-msg').value.trim(),
  };
  if (!body.hvem_er_du || !body.melding) return showAlert('t-alert', 'Velg hvem du er og skriv en melding', false);
  try {
    const res = await fetch(`${DJANGO}/api/tilbakemelding/`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    if (res.ok || res.status === 201) {
      showAlert('t-alert', ' Takk for tilbakemeldingen!');
      document.getElementById('t-msg').value = '';
    } else {
      const e = await res.json();
      showAlert('t-alert', 'Feil: ' + JSON.stringify(e), false);
    }
  } catch { showAlert('t-alert', ` Django ikke tilkoblet`, false); }
}

let selectedProduct = null;
let stripeInst = null, cardEl = null;

function initStripe() {
  if (stripeInst) return;
  try {
    stripeInst = Stripe(STRIPE_PK);
    cardEl = stripeInst.elements().create('card', {
      style: { base: { fontSize:'14px', color:'#111', fontFamily:'sans-serif', '::placeholder':{ color:'#aaa' } } }
    });
    const mount = document.getElementById('stripe-card-mount');
    if (mount) { mount.innerHTML = ''; cardEl.mount('#stripe-card-mount'); }
  } catch {}
}

async function loadPayProducts() {
  const loading = document.getElementById('pay-products-loading');
  const list    = document.getElementById('pay-products-list');
  const empty   = document.getElementById('pay-empty');
  try {
    const res = await fetch(`${DJANGO}/api/clothing/`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error();
    const products = await res.json();
    if (loading) loading.style.display = 'none';
    if (!products.length) { if (empty) empty.style.display = 'block'; return; }
    if (list) {
      list.style.display = 'block';
      list.innerHTML = products.map(p => `
        <div class="pay-product-row" id="pp-${p.id}" onclick="selectPayProduct(${p.id},'${p.name.replace(/'/g,"\\'")}',${p.price})">
          <div>
            <div class="pay-product-name">${p.name}</div>
          </div>
          <div class="pay-product-price">${parseFloat(p.price).toLocaleString('nb-NO')} kr</div>
        </div>`).join('');
    }
  } catch {
    if (loading) loading.style.display = 'none';
    if (empty)   empty.style.display   = 'block';
  }
}

function selectPayProduct(id, name, price) {
  selectedProduct = { id, name, price };
  document.getElementById('sel-prod-name').textContent  = name;
  document.getElementById('sel-prod-price').textContent = parseFloat(price).toLocaleString('nb-NO') + ' kr';
  document.querySelectorAll('.pay-product-row').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById('pp-' + id);
  if (el) el.classList.add('selected');
}

async function leggTilPayProdukt() {
  const body = {
    name:  document.getElementById('pay-name').value.trim(),
    price: parseFloat(document.getElementById('pay-price').value) || 0,
    stock: parseInt(document.getElementById('pay-stock').value)   || 0,
  };
  if (!body.name) return showAlert('pay-prod-alert', 'Navn er påkrevd', false);
  try {
    const res = await fetch(`${DJANGO}/api/clothing/`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    if (res.ok || res.status === 201) { showAlert('pay-prod-alert', ' Produkt lagt til!'); await loadPayProducts(); }
    else { const e = await res.json(); showAlert('pay-prod-alert', 'Feil: ' + JSON.stringify(e), false); }
  } catch { showAlert('pay-prod-alert', ` Django ikke tilkoblet`, false); }
}

async function gjennomforBetaling() {
  if (!selectedProduct) return showAlert('betal-alert', 'Velg et produkt fra listen', false);
  if (!stripeInst || !cardEl) return showAlert('betal-alert', 'Stripe ikke initialisert', false);
  const btn = document.getElementById('betal-btn');
  btn.disabled = true; btn.textContent = 'Behandler...';
  try {
    const ir = await fetch(`${NODE}/create-payment-intent`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ amount: Math.round(parseFloat(selectedProduct.price)*100), productName: selectedProduct.name, sellerStripeAccountId:'acct_demo' })
    });
    if (!ir.ok) throw new Error('Server-feil');
    const { clientSecret } = await ir.json();
    const { error, paymentIntent } = await stripeInst.confirmCardPayment(clientSecret, { payment_method:{ card:cardEl } });
    if (error) throw new Error(error.message);
    if (paymentIntent.status === 'succeeded') {
      showAlert('betal-alert', ` Betaling fullført for "${selectedProduct.name}"!`);
      cardEl.clear();
    }
  } catch (err) {
    showAlert('betal-alert', err.message.match(/fetch|Failed|network/i) ? ` Node-server ikke oppe` : ` ${err.message}`, false);
  } finally { btn.disabled = false; btn.textContent = 'Betal nå'; }
}

async function registrerSelger() {
  const epost = document.getElementById('selger-epost').value.trim();
  if (!epost) return showAlert('selger-alert', 'Skriv inn e-post', false);
  try {
    const res = await fetch(`${NODE}/create-seller-account`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ email:epost })
    });
    const data = await res.json();
    if (data.onboardingUrl) { window.open(data.onboardingUrl,'_blank'); showAlert('selger-alert','↗ Stripe onboarding åpnet!'); }
    else showAlert('selger-alert','Feil: '+(data.error||'Ukjent'), false);
  } catch { showAlert('selger-alert', ` Node-server ikke oppe`, false); }
}

async function loadTickets() {
  const loading = document.getElementById('h-loading');
  const list    = document.getElementById('h-list');
  const empty   = document.getElementById('h-empty');
  if (loading) loading.style.display = 'block';
  if (list)    list.style.display    = 'none';
  if (empty)   empty.style.display   = 'none';
  try {
    const res = await fetch(`${HELP_API}/api/help/tickets/`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error();
    const tickets = await res.json();
    if (loading) loading.style.display = 'none';
    if (!tickets.length) { if (empty) empty.style.display = 'block'; return; }
    if (list) {
      list.style.display = 'flex';
      list.innerHTML = tickets.map(t => `
        <div class="ticket-item">
          <div>
            <div class="ticket-title">${t.title}</div>
            <div class="ticket-excerpt">${t.message.substring(0,90)}${t.message.length>90?'…':''}${t.email ? ' · '+t.email : ''}</div>
          </div>
          <div class="ticket-badges">
            <span class="badge badge-${t.status}">${t.status.replace('_',' ')}</span>
            <span class="badge badge-${t.priority}">${t.priority}</span>
          </div>
        </div>`).join('');
    }
  } catch {
    if (loading) loading.style.display = 'none';
    if (empty)   empty.style.display   = 'block';
  }
}

async function sendTicket() {
  const body = {
    title:    document.getElementById('h-title').value.trim(),
    message:  document.getElementById('h-msg').value.trim(),
    email:    document.getElementById('h-email').value.trim(),
    priority: document.getElementById('h-prio').value,
  };
  if (!body.title || !body.message) return showAlert('h-alert', 'Tittel og melding er påkrevd', false);
  if (!body.email) return showAlert('h-alert', 'E-post er påkrevd', false);
  try {
    const res = await fetch(`${HELP_API}/api/help/tickets/`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
    });
    if (res.ok || res.status === 201) {
      showAlert('h-alert', ' Forespørsel sendt!');
      document.getElementById('h-title').value = '';
      document.getElementById('h-msg').value   = '';
      await loadTickets();
    } else {
      const e = await res.json();
      showAlert('h-alert', 'Feil: ' + Object.entries(e).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):v}`).join(' · '), false);
    }
  } catch { showAlert('h-alert', ` Help API ikke oppe. Start: python manage.py runserver 8000`, false); }
}

let valgtRolle = null;
function velgRolle(el) {
  document.querySelectorAll('.rolle-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  valgtRolle = el.dataset.r;
}

async function opprettProfil() {
  if (!valgtRolle) return showAlert('pr-alert', 'Velg en rolle', false);
  const navn     = document.getElementById('pr-navn').value.trim();
  const epost    = document.getElementById('pr-epost').value.trim();
  const passord  = document.getElementById('pr-passord').value;
  const passord2 = document.getElementById('pr-passord2').value;
  if (!navn || !epost) return showAlert('pr-alert', 'Navn og e-post er påkrevd', false);
  if (!passord) return showAlert('pr-alert', 'Du må velge et passord', false);
  if (passord.length < 6) return showAlert('pr-alert', 'Passordet må være minst 6 tegn', false);
  if (passord !== passord2) return showAlert('pr-alert', 'Passordene er ikke like', false);
  try {
    const res = await fetch(`${DJANGO}/api/profil/opprett/`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ navn, epost, passord, beskrivelse:document.getElementById('pr-besk').value, rolle:valgtRolle })
    });
    if (res.ok || res.status === 201) {
      const d = await res.json();
      showAlert('pr-alert', ` Konto opprettet! Velkommen, ${d.navn}.`);
      document.getElementById('pr-navn').value     = '';
      document.getElementById('pr-epost').value    = '';
      document.getElementById('pr-passord').value  = '';
      document.getElementById('pr-passord2').value = '';
    } else {
      const e = await res.json();
      showAlert('pr-alert', Object.entries(e).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):v}`).join(' · '), false);
    }
  } catch { showAlert('pr-alert', ` Django ikke tilkoblet`, false); }
}

async function hentProfil() {
  const el = document.getElementById('profil-data');
  el.textContent = 'Henter...';
  try {
    const res = await fetch(`${DJANGO}/api/profil/meg/`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(res.status===404 ? 'Ingen profil i databasen.' : `HTTP ${res.status}`);
    const d = await res.json();
    el.innerHTML = `<div class="profil-display">
      <div class="profil-row"><label>Navn:</label><span>${d.navn}</span></div>
      <div class="profil-row"><label>E-post:</label><span>${d.epost}</span></div>
      <div class="profil-row"><label>Rolle:</label><span>${d.rolle}</span></div>
      ${d.beskrivelse ? `<div class="profil-row"><label>Om:</label><span>${d.beskrivelse}</span></div>` : ''}
    </div>`;
    showAlert('get-pr-alert', ' Profil lastet!');
  } catch (err) {
    el.textContent = err.message;
    showAlert('get-pr-alert', ` ${err.message}`, false);
  }
}

(async () => {
  sjekkLagretInnlogging(); 
  checkConnections();
  await loadClothing();
  
  const goto = localStorage.getItem('goto');
  if (goto) {
    localStorage.removeItem('goto');
    nav(goto);
  }
})();