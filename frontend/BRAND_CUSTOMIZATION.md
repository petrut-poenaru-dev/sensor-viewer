# 🎨 Ghid Personalizare Brand - Logo Graphein

## 📋 Cum să adaptezi culorile la logo-ul companiei

### Pasul 1: Extrage culorile din logo

1. Deschide `frontend/src/app/assets/logo-graphein.jpeg` într-un editor de imagini
2. Folosește un color picker pentru a identifica culorile principale:
   - Culoarea primară (cea mai dominantă)
   - Culoarea secundară (complementară)
   - Culoarea accent (pentru detalii)

**Tool-uri recomandate pentru extragere culori:**
- Adobe Color (color.adobe.com)
- Coolors.co
- ImageColorPicker.com
- Chrome DevTools Eyedropper

### Pasul 2: Actualizează paleta de culori

Editează fișierul `frontend/src/styles/_brand-colors.scss`:

```scss
// Înlocuiește cu culorile extrase din logo
$brand-primary: #TUA_CULOARE_PRIMARA;
$brand-secondary: #TUA_CULOARE_SECUNDARA;
$brand-accent: #TUA_CULOARE_ACCENT;
```

### Pasul 3: Importă culorile în styles.scss

La începutul fișierului `frontend/src/styles.scss`, adaugă:

```scss
@import 'styles/brand-colors';
```

Apoi înlocuiește toate instanțele de `#00d4ff` și `#0099ff` cu variabilele:
- `#00d4ff` → `$brand-primary`
- `#0099ff` → `$brand-secondary`
- `#00ff88` → `$brand-accent`

### Pasul 4: Testează și ajustează

1. Rulează aplicația: `ng serve`
2. Verifică contrastul textului pe fundal
3. Ajustează opacitatea dacă e necesar
4. Testează hover states și animații

## 🎨 Exemple de palete pre-configurate

### Opțiunea 1: Blue Corporate (Professional)
```scss
$brand-primary: #0066cc;
$brand-secondary: #004999;
$brand-accent: #0088ff;
```
**Potrivit pentru:** Companii tech, consultanță, servicii financiare

### Opțiunea 2: Purple Tech (Modern)
```scss
$brand-primary: #7c3aed;
$brand-secondary: #5b21b6;
$brand-accent: #a78bfa;
```
**Potrivit pentru:** Startups, software, creative agencies

### Opțiunea 3: Green Innovation (Eco-friendly)
```scss
$brand-primary: #10b981;
$brand-secondary: #059669;
$brand-accent: #34d399;
```
**Potrivit pentru:** Energie, sustenabilitate, health tech

### Opțiunea 4: Orange Energy (Dynamic)
```scss
$brand-primary: #f59e0b;
$brand-secondary: #d97706;
$brand-accent: #fbbf24;
```
**Potrivit pentru:** Retail, food & beverage, entertainment

### Opțiunea 5: Red Dynamic (Bold)
```scss
$brand-primary: #ef4444;
$brand-secondary: #dc2626;
$brand-accent: #f87171;
```
**Potrivit pentru:** Media, sports, emergency services

## 🖼️ Logo-ul în aplicație

Logo-ul Graphein este acum integrat în:

1. **Navigation Bar** (`page-shell.component.ts`)
   - Poziție: Top-left
   - Dimensiune: 45px height (desktop), 36px (mobile)
   - Hover effect: Glow shadow

2. **Import Page** (`import.page.ts`)
   - Poziție: Hero section center
   - Dimensiune: 120px container
   - Animație: Float effect

3. **Dashboard** (`sensors.page.ts`)
   - Poziție: Header left
   - Dimensiune: 80px container
   - Animație: Float effect

## 🔧 Ajustări avansate

### Modifică dimensiunea logo-ului

**Navigation:**
```scss
.company-logo {
  height: 50px; // Mărește sau micșorează
}
```

**Hero Section:**
```scss
.hero-icon {
  width: 150px;  // Ajustează dimensiunea
  height: 150px;
}
```

### Modifică efectele de glow

```scss
// Glow mai puternic
box-shadow: 0 6px 30px rgba($brand-primary, 0.6);

// Glow mai subtil
box-shadow: 0 4px 15px rgba($brand-primary, 0.2);

// Fără glow
box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
```

### Modifică animația float

```scss
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px); // Mărește pentru mai multă mișcare
  }
}
```

## 📱 Responsive Design

Logo-ul se adaptează automat pe diferite device-uri:

- **Desktop (>768px)**: Logo full size
- **Tablet (768px)**: Logo medium size
- **Mobile (<768px)**: Logo compact size

## ✅ Checklist Personalizare

- [ ] Extrage culorile din logo
- [ ] Actualizează `_brand-colors.scss`
- [ ] Importă în `styles.scss`
- [ ] Înlocuiește hardcoded colors cu variabile
- [ ] Testează contrastul textului
- [ ] Verifică hover states
- [ ] Testează pe mobile
- [ ] Verifică animațiile
- [ ] Optimizează dimensiunea logo-ului
- [ ] Deploy și testează în producție

## 🎯 Tips pentru cel mai bun rezultat

1. **Contrast**: Asigură-te că textul este lizibil pe toate fundalurile
2. **Consistență**: Folosește aceleași culori în toată aplicația
3. **Accesibilitate**: Verifică WCAG contrast ratios (minimum 4.5:1)
4. **Performance**: Optimizează imaginea logo-ului (WebP, dimensiune mică)
5. **Branding**: Păstrează identitatea vizuală a companiei

## 🚀 Next Steps

După personalizare, consideră:
- Adaugă favicon cu logo-ul companiei
- Creează splash screen pentru PWA
- Adaugă logo în email templates
- Creează variante dark/light ale logo-ului
- Exportă style guide pentru echipă

---

**Need help?** Contactează echipa de design sau consultă documentația Angular Material pentru mai multe opțiuni de customizare.
