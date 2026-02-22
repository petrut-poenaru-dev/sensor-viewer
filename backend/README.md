# SensorHub Backend API

Backend API pentru aplicația SensorHub cu autentificare JWT și MongoDB.

## 🚀 Quick Start

```bash
# Instalare dependențe
npm install

# Creare cont admin
npm run seed

# Pornire server development
npm run dev
```

Server va rula pe: `http://localhost:3000`

## 📦 Dependențe

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **express-validator**: Input validation

## 🔧 Comenzi

```bash
# Development (cu auto-reload)
npm run dev

# Production
npm start

# Creare admin user
npm run seed

# Adăugare user nou (interactive)
node scripts/add-user.js
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/login` - Login utilizator
- `GET /api/auth/verify` - Verifică token (protected)
- `POST /api/auth/logout` - Logout (protected)

### Health

- `GET /api/health` - Health check

## 🔐 Securitate

- Parole hash-uite cu bcrypt (10 salt rounds)
- JWT tokens cu expirare 7 zile
- Protected routes cu middleware
- Input validation cu express-validator

## 📝 Environment Variables

Creează fișier `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/sensorhub
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
```

## 👤 Default Admin

După `npm run seed`:
- **Username**: admin
- **Password**: admin

⚠️ Schimbă parola după primul login!

## 📚 Documentație completă

Vezi [AUTH_SETUP.md](../AUTH_SETUP.md) pentru documentație completă.
