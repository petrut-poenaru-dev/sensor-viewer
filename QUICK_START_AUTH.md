# 🚀 Quick Start - Autentificare SensorHub

## Pornire Rapidă (5 minute)

### 1. Pornește MongoDB

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### 2. Setup Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

✅ Backend pornit pe `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend
ng serve
```

✅ Frontend pornit pe `http://localhost:4200`

### 4. Login

Deschide browser la `http://localhost:4200`

**Credențiale default:**
- Username: `admin`
- Password: `admin`

## 🎯 Ce ai acum?

✅ Pagină de login futuristică cu logo Graphein  
✅ Autentificare JWT securizată  
✅ Protected routes (Import & Dashboard)  
✅ Logout button în navigation  
✅ MongoDB pentru utilizatori  
✅ CLI pentru adăugare utilizatori  

## 👤 Adaugă utilizatori noi

```bash
cd backend
node scripts/add-user.js
```

Introdu username și password când ești întrebat.

## 🎨 Design Features

- Logo Graphein animat (float effect)
- Background cu gradient orbs rotative
- Glassmorphism card cu backdrop blur
- Animații smooth (fadeIn, glow, shake)
- "Powered by Graphein" footer
- Responsive design (mobile/tablet/desktop)

## 🔧 Configurare

Toate setările sunt în:
- Backend: `backend/.env`
- Frontend: `frontend/src/app/core/services/auth.service.ts`

## 📚 Documentație

Vezi [AUTH_SETUP.md](./AUTH_SETUP.md) pentru detalii complete.

## ❓ Probleme?

### MongoDB nu pornește
```bash
mongod --dbpath C:\data\db
```

### Port 3000 ocupat
Modifică `PORT` în `backend/.env`

### CORS errors
Backend-ul are CORS activat pentru toate originile

---

**Enjoy your secure SensorHub! 🎉**
