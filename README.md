# SkaperTorget — README

## Slik åpner du nettsiden
1. Pakk ut zip-filen
2. Dobbeltklikk på `Gruppe9_Skapertorget.html`
3. Logg inn med demobrukeren

## Innlogging
- Brukernavn: `demo`
- Passord: `demo123`

---

## Filer i prosjektet
| Fil | Beskrivelse |
|---|---|
| `Gruppe9_Skapertorget.html` | Hovedside |
| `OmOss_Skapertorget.html` | Om oss-side |
| `skapertorget.css` | Styling |
| `skapertorget.js` | JavaScript |
| `START_BACKEND.command` | Starter backend automatisk (Mac) |
| `START_BACKEND.bat` | Starter backend automatisk (Windows) |
| `gruppe9_api/` | Django backend med alle API-er |
| `bilder/` | Produktbilder |

---

## Start backend automatisk
**Mac:** Høyreklikk på `START_BACKEND.command` → velg **Åpne**

**Windows:** Dobbeltklikk på `START_BACKEND.bat`

---

## Start backend manuelt

### Django (port 8100)
```bash
cd gruppe9_api
pip3 install django djangorestframework django-cors-headers
python3 manage.py migrate
python3 manage.py runserver 8100
```

### Help API (port 8000)
```bash
cd gruppe9_api/help_api/SkaperTorget_HelpAPI
pip3 install django djangorestframework
python3 manage.py migrate
python3 manage.py runserver 8000
```

### Node/Stripe (port 3000)
```bash
cd original_frontend
npm init -y
npm install express stripe dotenv cors
node server.js
```

---

## Opprett profil
1. Trykk på **Min profil** i navigasjonsmenyen
2. Velg rolle — Kjøper, Selger eller Begge
3. Fyll inn navn, e-postadresse, passord og valgfri beskrivelse
4. Trykk **Opprett konto**

### API
| Metode | Endepunkt | Beskrivelse |
|---|---|---|
| POST | `/api/profil/opprett/` | Oppretter ny profil |
| GET | `/api/profil/meg/` | Henter profil |

---

## Tilbakemelding
1. Trykk på **Tilbakemelding** i navigasjonsmenyen
2. Velg hvem du er, bestilling, produkt og vurdering (1–5)
3. Skriv en melding og trykk **Send tilbakemelding**

### Datamodell
| Felt | Beskrivelse |
|---|---|
| `hvem_er_du` | Privatperson eller bedrift |
| `bestilling` | Bestillingen vurderingen gjelder |
| `produkt` | Produktet vurderingen gjelder |
| `vurdering` | Karakter fra 1–5 |
| `melding` | Skriftlig tilbakemelding |
| `opprettet` | Tidsstempel |

### API
| Metode | Endepunkt | Beskrivelse |
|---|---|---|
| POST | `/api/tilbakemelding/` | Lagrer tilbakemelding, returnerer 201 |
| GET | `/api/tilbakemelding/` | Bekrefter at API er oppe |

### Backend
- **models.py** — definerer feltene over
- **serializers.py** — veksler data mellom backend og frontend, validerer at alle felt er fylt ut
- **views.py** — håndterer GET og POST. POST lagrer og returnerer 201, ugyldig data returnerer 400
- **urls.py** — registrerer endepunktet `/api/tilbakemelding/`

---

## Søkefunksjon
Søkefunksjonen lar brukere finne klær basert på navn og beskrivelse.

### Funksjoner
- Tekstsøk i produktnavn og beskrivelse
- Søkehistorikk lagrer de 5 siste søkene
- Søket er optimalisert med 300 ms debounce

### Filtre
- **Kategori** — Genser, Bukse, Sokker
- **Tilstand** — Ny, Som ny, Godt brukt, Brukt med tegn
- **Prisintervall** — Minimums- og maksimumspris
- **Lokasjon** — By eller postnummer

### Sortering
- Relevans
- Pris lav til høy
- Pris høy til lav
- Nyeste / eldste produkter

---

## Chat / Meldinger
Chat-funksjonaliteten lar selger og kjøper sende meldinger til hverandre.

### Teknologier
- Python / Django
- Django REST Framework
- SQLite

### API
| Metode | Endepunkt | Beskrivelse |
|---|---|---|
| GET | `/api/chat/messages?chat_id={id}` | Henter alle meldinger i en chat |
| POST | `/api/chat/messages/send` | Kjøper sender en ny melding (avsender_id = 1) |
| POST | `/api/chat/messages/selger-svar` | Selger sender en melding (avsender_id = 2) |
| DELETE | `/api/chat/messages/delete/{id}` | Sletter en melding |

### Eksempel — sende melding
```json
{
  "message": "Hei, er produktet fortsatt tilgjengelig?",
  "chat_id": 1
}
```

### Slik bruker du chat
1. Trykk på **Meldinger** i navigasjonsmenyen
2. Skriv en melding i tekstfeltet øverst og trykk **Send**
3. Selger kan svare i tekstfeltet nederst og trykke **Svar**
4. Trykk på søppel-ikonet for å slette egne meldinger

---

## Hjelp og support
Brukere kan sende inn hjelpeforespørsler bestående av tittel, beskrivelse, e-post og prioritet.

### Slik bruker du hjelp
1. Trykk på **Hjelp** i navigasjonsmenyen
2. Fyll inn tittel, e-post og beskriv problemet
3. Velg prioritet og trykk **Send forespørsel**

### Datamodell
| Felt | Beskrivelse |
|---|---|
| `title` | Tittel på forespørselen (min. 3 tegn) |
| `message` | Beskrivelse av henvendelsen (min. 10 tegn) |
| `email` | E-postadressen til avsenderen |
| `status` | Åpen, under behandling, løst eller lukket |
| `priority` | Lav, medium, høy eller akutt |

### Backend
- **models.py** — definerer feltene over
- **serializers.py** — validerer at tittel er minst 3 tegn, melding minst 10 tegn, og at e-post er gyldig
- **views.py** — håndterer CRUD. Admin kan se alle tickets og endre status/prioritet. Brukere ser kun sine egne. Returnerer 400 ved ugyldig data
- **urls.py** — registrerer endepunktene

### API
| Metode | Endepunkt | Beskrivelse |
|---|---|---|
| GET | `/api/help/tickets/` | Henter alle forespørsler |
| POST | `/api/help/tickets/` | Oppretter ny forespørsel |
| GET | `/api/help/tickets/<id>/` | Henter én forespørsel |
| PUT | `/api/help/tickets/<id>/` | Oppdaterer forespørsel |
| DELETE | `/api/help/tickets/<id>/` | Sletter forespørsel |

---

## Betaling
Betalingsløsningen bruker Stripe Connect for sikre og automatiserte betalinger mellom kjøpere og selgere.

### For kjøpere
- Sikker betaling med kort (Visa, Mastercard, Amex)
- Umiddelbar bekreftelse på vellykket betaling
- Visning av produkt og pris før betaling

### For selgere
- Registrering som selger med e-post
- Automatisk onboarding via Stripe Connect
- Mottar betaling direkte til sin Stripe-konto

### Teknologier
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Betalingsløsning: Stripe.js v3
- Betalingshåndtering: Stripe Payment Intents
- Selgerhåndtering: Stripe Connect

### Forutsetninger
- Node.js (v14 eller høyere)
- Stripe-konto med API-nøkler
- NPM eller Yarn

### Start Stripe-server
```bash
cd original_frontend
npm init -y
npm install express stripe dotenv cors
node server.js
```
