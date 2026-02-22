# 🔐 Sistem de Autentificare - SensorHub

## 📋 Overview

Sistem complet de autentificare cu:
- **Backend**: Express + MongoDB + JWT
- **Frontend**: Angular cu design futuristic
- **Security**: Bcrypt pentru parole, JWT pentru sesiuni
- **User Management**: CLI pentru adăugare utilizatori

## 🚀 Setup Backend

### 1. Instalare dependențe

```bash
cd backend
npm install
```

### 2. Configurare MongoDB

Asigură-te că MongoDB rulează local:

```bash
# Windows (dacă ai MongoDB instalat ca serviciu)
net start MongoDB

# Sau pornește manual
mongod
```

### 3. Configurare environment

Fișierul `.env` este deja creat cu:
```env
MONGODB_URI=mongodb://localhost:27017/sensorhub
JWT_SECRET=graphein-sensorhub-secret-key-2024
PORT=3000
NODE_ENV=development
```

### 4. Creare cont admin

```bash
npm run seed
```

Output:
```
✅ Admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Username: admin
Password: admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 5. Pornire server

```bash
# Development (cu auto-reload)
npm run dev

# Production
npm start
```

Server va rula pe: `http://localhost:3000`

## 🎨 Setup Frontend

Frontend-ul este deja configurat! Doar pornește aplicația:

```bash
cd frontend
ng serve
```

Aplicația va rula pe: `http://localhost:4200`

## 👤 Adăugare utilizatori noi

### Opțiunea 1: CLI Interactive

```bash
cd backend
node scripts/add-user.js
```

Vei fi întrebat:
```
Username: john
Password: password123

✅ User creat cu succes!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Username: john
Password: password123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Opțiunea 2: MongoDB Direct

```bash
mongosh sensorhub

# Adaugă user (parola va fi hash-uită automat de pre-save hook)
db.users.insertOne({
  username: "john",
  password: "$2a$10$...", // Hash bcrypt
  createdAt: new Date()
})
```

## 🔒 Securitate

### Parole

- **Hashing**: Bcrypt cu salt rounds = 10
- **Minimum length**: 4 caractere (poți modifica în `models/User.js`)
- **Storage**: Doar hash-ul este salvat în DB

### JWT Tokens

- **Expirare**: 7 zile
- **Secret**: Configurat în `.env`
- **Storage**: localStorage în browser
- **Header**: `Authorization: Bearer <token>`

### API Protection

Toate route-urile (exceptând `/login`) sunt protejate cu:
- `authGuard` în frontend
- `authMiddleware` în backend

## 📡 API Endpoints

### POST /api/auth/login

Login utilizator

**Request:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login reușit",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Username sau parolă incorectă"
}
```

### GET /api/auth/verify

Verifică token valid (necesită autentificare)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "admin",
    "lastLogin": "2024-01-15T10:30:00.000Z"
  }
}
```

### POST /api/auth/logout

Logout (opțional, doar pentru logging)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout reușit"
}
```

### GET /api/health

Health check (nu necesită autentificare)

**Response:**
```json
{
  "success": true,
  "message": "SensorHub API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🎨 Design Features - Login Page

### Visual Elements

- **Logo Graphein**: Centrat cu animație float
- **Brand Title**: "SensorHub" cu gradient text și glow effect
- **Glassmorphism Card**: Backdrop blur și border neon
- **Animated Background**: Gradient orbs rotative
- **Form Fields**: Material Design cu iconițe
- **Error Messages**: Animație shake cu culori roșii
- **Loading State**: Spinner în buton
- **Powered by Graphein**: Footer elegant

### Animații

- `fadeInUp`: Card-uri și conținut
- `fadeInDown`: Logo și titlu
- `float`: Logo animat
- `glow`: Text cu pulsație
- `rotate`: Background orbs
- `shake`: Mesaje de eroare

### Responsive

- Desktop: Layout complet
- Tablet: Adaptat
- Mobile: Stack vertical, logo mai mic

## 🔧 Configurare

### Backend Port

Modifică în `.env`:
```env
PORT=3000
```

### MongoDB URI

Pentru MongoDB Atlas sau alt server:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sensorhub
```

### JWT Secret

**IMPORTANT**: Schimbă în producție!
```env
JWT_SECRET=your-super-secret-key-here
```

### JWT Expiration

Modifică în `routes/auth.js`:
```javascript
const token = jwt.sign(
  { userId: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '30d' } // Schimbă aici
);
```

## 🐛 Troubleshooting

### MongoDB nu pornește

```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

### Port 3000 ocupat

Modifică `PORT` în `.env` sau oprește procesul:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### CORS Errors

Backend-ul are CORS activat pentru toate originile. Pentru producție, restricționează:

```javascript
// server.js
app.use(cors({
  origin: 'https://your-domain.com'
}));
```

### Token expirat

Token-ul expiră după 7 zile. User-ul va fi redirecționat automat la login.

## 📁 Structura Fișiere

```
backend/
├── models/
│   └── User.js              # Model MongoDB pentru utilizatori
├── routes/
│   └── auth.js              # Route-uri autentificare
├── middleware/
│   └── auth.js              # Middleware verificare JWT
├── scripts/
│   ├── seed-admin.js        # Creare cont admin
│   └── add-user.js          # Adăugare utilizatori CLI
├── .env                     # Configurare environment
├── .env.example             # Template configurare
├── package.json             # Dependențe
└── server.js                # Entry point

frontend/src/app/
├── core/
│   ├── services/
│   │   └── auth.service.ts  # Serviciu autentificare
│   ├── guards/
│   │   └── auth.guard.ts    # Guard protecție route-uri
│   └── interceptors/
│       └── auth.interceptor.ts  # Interceptor JWT
├── features/
│   └── auth/
│       └── login.page.ts    # Pagină login
└── shared/
    └── ui/
        └── page-shell.component.ts  # Navigation cu logout
```

## ✅ Checklist Setup

- [ ] MongoDB instalat și pornit
- [ ] Backend dependencies instalate (`npm install`)
- [ ] `.env` configurat
- [ ] Admin user creat (`npm run seed`)
- [ ] Backend pornit (`npm run dev`)
- [ ] Frontend pornit (`ng serve`)
- [ ] Test login cu admin/admin
- [ ] Adăugat utilizatori noi (opțional)

## 🎯 Next Steps

1. **Schimbă parola admin** după primul login
2. **Adaugă utilizatori** pentru echipă
3. **Configurează MongoDB Atlas** pentru producție
4. **Schimbă JWT_SECRET** în producție
5. **Activează HTTPS** în producție
6. **Adaugă rate limiting** pentru securitate extra

## 🔐 Best Practices

1. **Nu commit-a `.env`** în Git (e deja în `.gitignore`)
2. **Folosește parole puternice** în producție
3. **Rotește JWT_SECRET** periodic
4. **Monitorizează failed login attempts**
5. **Implementează 2FA** pentru securitate extra (viitor)

---

**Status**: ✅ Complet funcțional | 🎨 Design futuristic | 🔒 Securizat cu JWT
