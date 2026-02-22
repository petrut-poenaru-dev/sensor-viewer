# 🔧 Troubleshooting - SensorViewer

## ❌ Login nu funcționează (admin/admin)

### Cauze posibile:

#### 1. **Backend-ul nu rulează**

**Verificare:**
```bash
# Windows
Test-NetConnection -ComputerName localhost -Port 3000

# Linux/Mac
curl http://localhost:3000/api/health
```

**Soluție:**
```bash
cd backend
npm run dev
```

#### 2. **MongoDB nu rulează**

**Verificare:**
```bash
# Windows
net start | findstr MongoDB

# Linux/Mac
systemctl status mongod
```

**Soluție:**
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

#### 3. **Contul admin nu există în baza de date** ⚠️ (Cauza ta!)

**Verificare:**
```bash
cd backend
node scripts/check-users.js
```

**Soluție:**
```bash
cd backend
npm run seed
```

Output așteptat:
```
✅ Admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Username: admin
Password: admin
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### 4. **CORS errors**

**Verificare:** Deschide Console (F12) și caută erori CORS

**Soluție:** Backend-ul are CORS activat, dar verifică că URL-ul e corect în `auth.service.ts`:
```typescript
private readonly API_URL = 'http://localhost:3000/api/auth';
```

#### 5. **Port-ul 3000 e ocupat**

**Verificare:**
```bash
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000
```

**Soluție:** Modifică `PORT` în `backend/.env` sau oprește procesul:
```bash
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>
```

## 🔍 Comenzi utile de debugging

### Verifică utilizatori în DB
```bash
cd backend
node scripts/check-users.js
```

### Verifică health backend
```bash
curl http://localhost:3000/api/health
```

### Verifică logs backend
Uită-te în terminal-ul unde rulează `npm run dev`

### Verifică logs frontend
Deschide Console (F12) în browser

## 📝 Checklist Login

- [ ] MongoDB pornit
- [ ] Backend pornit (`npm run dev`)
- [ ] Frontend pornit (`ng serve`)
- [ ] Cont admin creat (`npm run seed`)
- [ ] Browser la `http://localhost:4200`
- [ ] Console fără erori (F12)

## 🎯 Test rapid

### 1. Test backend direct
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

Răspuns așteptat:
```json
{
  "success": true,
  "message": "Login reușit",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "lastLogin": "..."
  }
}
```

### 2. Test MongoDB
```bash
mongosh sensorhub
db.users.find()
```

Ar trebui să vezi userul admin.

## 🆘 Erori comune

### "Cannot connect to MongoDB"
- MongoDB nu rulează
- URI incorect în `.env`

### "User not found"
- Rulează `npm run seed`

### "Invalid credentials"
- Verifică username/password
- Verifică că userul există (`node scripts/check-users.js`)

### "CORS error"
- Backend nu rulează
- URL incorect în `auth.service.ts`

### "Network error"
- Backend nu rulează pe port 3000
- Firewall blochează conexiunea

## 💡 Tips

1. **Întotdeauna verifică Console (F12)** pentru erori
2. **Verifică terminal-ul backend** pentru logs
3. **Rulează `check-users.js`** pentru a vedea utilizatorii
4. **Folosește `curl`** pentru a testa API-ul direct
5. **Verifică `.env`** pentru configurare corectă

## 🔄 Reset complet

Dacă nimic nu funcționează:

```bash
# 1. Oprește tot
# Ctrl+C în toate terminalele

# 2. Șterge baza de date
mongosh sensorhub
db.dropDatabase()
exit

# 3. Recreează admin
cd backend
npm run seed

# 4. Repornește backend
npm run dev

# 5. Repornește frontend (în alt terminal)
cd frontend
ng serve
```

---

**Problema ta era:** Contul admin nu exista în baza de date. Acum ar trebui să funcționeze! ✅
