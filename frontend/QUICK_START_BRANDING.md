# 🚀 Quick Start - Personalizare Brand

## Logo-ul Graphein este acum integrat! ✅

Logo-ul tău (`logo-graphein.jpeg`) apare acum în:
- ✅ Navigation bar (top-left)
- ✅ Import page (hero section)
- ✅ Dashboard (header)

## 🎨 Vrei să adaptezi culorile la logo?

### Opțiunea 1: Rapid (5 minute)

1. Deschide `frontend/src/styles/_brand-colors.scss`
2. Alege una din paletele pre-configurate (decomentează liniile)
3. Salvează și reîncarcă aplicația

**Palete disponibile:**
- Blue Corporate (professional)
- Purple Tech (modern)
- Green Innovation (eco-friendly)
- Orange Energy (dynamic)
- Red Dynamic (bold)

### Opțiunea 2: Custom (15 minute)

1. Extrage culorile din logo cu un color picker:
   - https://imagecolorpicker.com/
   - Sau Adobe Color: https://color.adobe.com/

2. Editează `frontend/src/styles/_brand-colors.scss`:
```scss
$brand-primary: #TUA_CULOARE;
$brand-secondary: #TUA_CULOARE_2;
$brand-accent: #TUA_CULOARE_3;
```

3. Salvează și vezi rezultatul!

## 📁 Fișiere importante

- `frontend/src/app/assets/logo-graphein.jpeg` - Logo-ul tău
- `frontend/src/styles/_brand-colors.scss` - Configurare culori
- `frontend/BRAND_CUSTOMIZATION.md` - Ghid complet

## 🎯 Ce să faci acum?

1. **Testează aplicația**: `cd frontend && ng serve`
2. **Verifică logo-ul**: Deschide http://localhost:4200
3. **Personalizează culorile**: Urmează pașii de mai sus
4. **Citește ghidul complet**: `BRAND_CUSTOMIZATION.md`

## 💡 Tips

- Logo-ul se adaptează automat pe mobile
- Toate animațiile sunt optimizate pentru performance
- Design-ul este WCAG compliant pentru accesibilitate
- Poți ajusta dimensiunea logo-ului în fișierele component

## ❓ Întrebări frecvente

**Q: Logo-ul nu se vede?**
A: Verifică calea: `frontend/src/app/assets/logo-graphein.jpeg`

**Q: Vreau logo mai mare/mic?**
A: Editează `.company-logo { height: 45px; }` în `page-shell.component.ts`

**Q: Cum schimb culorile?**
A: Editează `_brand-colors.scss` și înlocuiește valorile hex

**Q: Pot avea logo diferit pentru dark/light mode?**
A: Da! Adaugă `logo-graphein-light.jpeg` și folosește CSS media queries

## 🎉 Gata!

Aplicația ta are acum:
- ✅ Logo Graphein integrat
- ✅ Design futuristic
- ✅ Animații fluide
- ✅ Responsive design
- ✅ Personalizare ușoară

**Enjoy your branded dashboard! 🚀**
