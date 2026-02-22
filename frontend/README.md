# SensorHub - Dashboard Futuristic 🚀

O aplicație Angular modernă și futuristică pentru vizualizarea și analiza datelor de la senzori în timp real, cu branding Graphein integrat.

## ✨ Caracteristici

- **Design Futuristic**: Interfață dark mode cu accente neon și efecte de glassmorphism
- **Branding Integrat**: Logo Graphein afișat în navigation, hero section și dashboard
- **Animații Fluide**: Tranziții și animații subtile pentru o experiență premium
- **Vizualizare Interactivă**: Grafice interactive cu ApexCharts și tabele responsive
- **Import CSV**: Încărcare și procesare automată a fișierelor CSV
- **Parametri Dinamici**: Ajustare în timp real a parametrilor de calcul
- **Responsive**: Design adaptat pentru desktop, tabletă și mobil
- **Personalizabil**: Paletă de culori ușor de adaptat la brandul companiei

## 🎨 Design Features

- Logo Graphein integrat în toată aplicația
- Gradient-uri și efecte de glow personalizabile
- Particule animate în fundal
- Glassmorphism și backdrop blur
- Scrollbar personalizat
- Hover effects și micro-interactions
- Iconițe Material Design
- Tipografie Inter pentru un look modern

## 🎨 Personalizare Brand

Pentru a adapta culorile aplicației la logo-ul companiei tale, consultă:
**[BRAND_CUSTOMIZATION.md](./BRAND_CUSTOMIZATION.md)**

Ghidul include:
- Cum să extragi culorile din logo
- Palete pre-configurate
- Ajustări avansate
- Tips pentru cel mai bun rezultat

## 🚀 Development server

Pentru a porni serverul local de dezvoltare:

```bash
cd frontend
npm install
ng serve
```

Deschide browser-ul la `http://localhost:4200/`. Aplicația se va reîncărca automat la modificări.

## 📦 Building

Pentru a construi proiectul pentru producție:

```bash
ng build
```

Build-ul optimizat va fi generat în directorul `dist/`.

## 🛠️ Tehnologii

- **Angular 19** - Framework principal
- **Angular Material** - Componente UI
- **ApexCharts** - Grafice interactive
- **RxJS** - Programare reactivă
- **TypeScript** - Type safety
- **SCSS** - Styling avansat

## 📁 Structura Proiectului

```
src/
├── app/
│   ├── core/              # Servicii și modele
│   ├── features/          # Module funcționale
│   │   ├── import/        # Pagina de import CSV
│   │   └── sensors/       # Dashboard senzori
│   └── shared/            # Componente partajate
├── styles.scss            # Stiluri globale
└── index.html            # Entry point
```

## 🎯 Utilizare

1. **Import Date**: Accesează pagina Import și încarcă un fișier CSV
2. **Vizualizare**: Navighează la Dashboard pentru a vedea graficele
3. **Parametri**: Ajustează parametrii A și B pentru calcule personalizate
4. **Analiză**: Explorează datele cu zoom și filtrare interactivă

## 🌈 Paleta de Culori

- **Primary**: `#00d4ff` (Cyan neon)
- **Secondary**: `#0099ff` (Blue)
- **Background**: `#0a0e27` → `#1a1f3a` (Dark gradient)
- **Text**: `#e0e6ed` (Light gray)
- **Accent**: `#94a3b8` (Muted blue-gray)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Comenzi Utile

```bash
# Instalare dependențe
npm install

# Start development server
ng serve

# Build pentru producție
ng build --configuration production

# Run tests
ng test

# Generate component
ng generate component component-name

# Lint code
ng lint
```

## 📄 Licență

Acest proiect este open source și disponibil sub licența MIT.

---

Creat cu ❤️ folosind Angular și design futuristic
