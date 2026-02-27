# Veb aplikacija za prodaju pozorišnih ulaznica

Ovaj repozitorijum sadrži seminarski rad iz predmeta Internet Tehnologije. Projektno rešenje se zasniva na modernoj web arhitekturi koja odvaja frontend (React) i backend (Laravel) slojeve, uz potpunu dockerizaciju okruženja.

## O Projektu

Aplikacija je dizajnirana da digitalizuje proces rada jednog savremenog pozorišta. Glavni cilj je da se posetiocima omogući jednostavan uvid u repertoar i brza rezervacija ulaznica, dok administracija dobija efikasan alat za upravljanje predstavama i prodajom.

## Ključne Funkcionalnosti

### Za Posetioce (Goste):
- **Pregled repertoara:** Dinamički prikaz aktuelnih predstava sa detaljima o opisu, trajanju i žanru.
- **Pretraga i filtriranje:** Mogućnost pretrage po nazivu predstave i filtriranje po žanru, reditelju ili nazivu.
- **Registracija:** Opcija kreiranja korisničkog naloga kako bi se omogućile napredne funkcije poput rezervacija.

### Za Registrovane Korisnike (Klijente):
- **Prijava na sistem:** Opcija pristupa svom već kreiranom korisničkom nalogu.
- **Sistem rezervacija:** Interaktivni odabir termina i dostupnih sedišta u sali (funkcija dostupna isključivo ulogovanim korisnicima).
- **Korisnički profil:** Personalizovani uvid u istoriju svih rezervisanih i kupljenih ulaznica.

### Za Administratore:
- **Upravljanje predstavama (CRUD):** Dodavanje novih predstava, ažuriranje postojećih i brisanje starih.
- **Upravljanje repertoarom:** Kreiranje, brisanje, dodavanje i izmena samih izvođenja predstava.
- **Upravljanje rezervacijama:** Pregled prodatih ulaznica i ažuriranje statusa.

## Tehnološki Stack

- **Frontend:** React.js (Node v20-alpine)
- **Backend:** Laravel Framework (PHP 8.2)
- **Baza podataka:** MySQL 8.0
- **Web Server:** Nginx
- **Infrastruktura:** Docker, Docker Compose  
- **Alati:** Docker Desktop, Git, VS Code  
- **Verziona kontrola:** GitHub

---

## Struktura Projekta

- docker-compose.yml: Glavna konfiguracija za orkestraciju svih servisa.
- /docker: Sadrži Dockerfile za Laravel i konfiguraciju za Nginx server.
- /pozoristefront: React aplikacija (Frontend).
- /pozoristeback: Laravel aplikacija (Backend API).
- /database: SQL skripte za inicijalizaciju i ažuriranje baze podataka.

---

## Instalacija i Pokretanje

Da bi se aplikacija pokrenula u lokalnom okruženju, potrebno je imati instaliran Docker Desktop i Git.

### 1. Kloniranje repozitorijuma
```bash
git clone https://github.com/elab-development/internet-tehnologije-2025-aplikacijazaprodajuulaznica_2022_0291.git

cd internet-tehnologije-2025-aplikacijazaprodajuulaznica_2022_0291
```
### 2. Podizanje Docker Kontejnera
Iz korenskog foldera pokrenuti komandu:
```bash
docker compose up -d --build
```
### 3. Konfiguracija Backend-a (Laravel)
Nakon što kontejneri postanu aktivni, potrebno je izvršiti instalaciju zavisnosti:
```bash
docker compose exec app composer install
docker compose exec app cp .env.example .env
docker compose exec app php artisan key:generate
```
### 4. Podešavanje Baze Podataka
Potrebno je uraditi import priloženog SQL fajla kako bi imali i strukturu i početne podatke:
1. Otvorite Database Client (Host: 127.0.0.1, Port: 3307).
2. Uvezite (Import) fajl: `db_sql/prodaja_ulaznica.sql`.

---

## Pristup Aplikaciji i Servisima

Nakon uspešnog pokretanja, aplikaciji se moze pristupiti putem sledećih adresa:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Pristup Bazi Podataka
Za eksterni pristup bazi (putem VS Code Database Client-a ili drugog alata), koristiti sledeca podesavanja:
- Host: 127.0.0.1
- Port: 3307
- Username: root
- Password: root
- Database: prodaja_ulaznica

---

## Autori (Tim)
- Una Ilić 2022/0291
- Anja Perović 2022/0174
- Iva Vučković 2022/0041