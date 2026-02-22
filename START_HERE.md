# 🚀 START HERE - SensorViewer

## Pornire Rapidă (Prima dată)

### Pasul 1: Pornește MongoDB

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Pasul 2: Setup Backend

```bash
cd backend

# Instalează dependențe (doar prima dată)
npm install

# Creează contul admin (IMPORTANT!)
npm run seed

# Pornește backend
npm run dev
```

✅ Backend pornit pe `http://localhost:3000`

### Pasul 3: Setup Frontend (în alt terminal)

```bash
cd frontend

# Instalează dependențe (doar prima dată)
npm install

# Pornește frontend
ng serve
```

✅ Frontend pornit pe `http://localhost:4200`

### Pasul 4: Login

Deschide browser la `http://localhost:4200`

**Credențiale:**
- Username: `admin`
- Password: `admin`

## 🔄 Pornire Zilnică (după prima configurare)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
ng serve
```

## ✅ Verificare

### Verifică dacă backend rulează:
```bash
curl http://localhost:3000/api/health
```

### Verifică utilizatori în DB:
```bash
cd backend
npm run check-users
```

## ❌ Probleme?

### Login nu funcționează?

1. **Verifică dacă backend rulează:**
   - Ar trebui să vezi în terminal: `🚀 Server running on http://localhost:3000`

2. **Verifică dacă admin există:**
   ```bash
   cd backend
   npm run check-users
   ```
   
   Dacă vezi "No users found", rulează:
   ```bash
   npm run seed
   ```

3. **Verifică Console în browser (F12)**
   - Caută erori de tip "Network error" sau "CORS"

### MongoDB nu pornește?

```bash
# Windows - pornește manual
mongod --dbpath C:\data\db

# Linux/Mac
sudo systemctl start mongod
```

## 📚 Documentație

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Rezolvare probleme
- **[AUTH_SETUP.md](./AUTH_SETUP.md)** - Documentație completă autentificare
- **[QUICK_START_AUTH.md](./QUICK_START_AUTH.md)** - Ghid rapid

## 👤 Adaugă utilizatori noi

```bash
cd backend
npm run add-user
```

Sau:
```bash
node scripts/add-user.js
```

## 🎯 Comenzi utile

```bash
# Backend
npm run dev          # Pornește backend (development)
npm start            # Pornește backend (production)
npm run seed         # Creează admin user
npm run check-users  # Verifică utilizatori
npm run add-user     # Adaugă user nou

# Frontend
ng serve             # Pornește frontend
ng build             # Build pentru producție
```

## 🔐 Securitate

⚠️ **IMPORTANT**: Schimbă parola admin după primul login!

Pentru producție:
1. Schimbă `JWT_SECRET` în `.env`
2. Folosește parole puternice
3. Configurează HTTPS
4. Restricționează CORS

---

**Acum ar trebui să funcționeze! Dacă ai probleme, vezi [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** 🎉
