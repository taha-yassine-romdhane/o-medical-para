# O'Medical - Plateforme de Parapharmacie en Ligne

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

O'Medical est une plateforme e-commerce moderne pour une parapharmacie tunisienne, développée avec Next.js, PostgreSQL et Prisma. Cette application offre une expérience d'achat en ligne fluide pour les produits de parapharmacie, avec des fonctionnalités avancées pour les clients et les administrateurs.

## ✨ Fonctionnalités

- **Interface utilisateur moderne et réactive**
- **Catalogue de produits complet** avec filtres avancés
- **Gestion des commandes** en temps réel
- **Espace client** avec historique des commandes
- **Tableau de bord administrateur** complet
- **Système d'authentification** sécurisé
- **Paiement en ligne** (à venir)
- **Gestion des stocks** en temps réel

## 🚀 Technologies Utilisées

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de données**: PostgreSQL avec Prisma ORM
- **Authentification**: NextAuth.js
- **Déploiement**: Vercel
- **Autres**: React Hook Form, Zod pour la validation, React Hot Toast pour les notifications

## 🛠 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/taha-yassine-romdhane/o-medical-para.git
   cd o-medical-para
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine du projet et ajoutez les variables nécessaires (voir `.env.example`)

4. **Migrations de la base de données**
   ```bash
   npx prisma migrate dev
   ```

5. **Lancer l'application en mode développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

   L'application sera disponible Sur Port 3000 as default 

## 📁 Structure du Projet

```
src/
├── app/                  # Routes de l'application
├── components/           # Composants réutilisables
├── lib/                  # Utilitaires et configurations
├── prisma/               # Schémas et migrations Prisma
├── public/               # Fichiers statiques
└── types/                # Définitions TypeScript
```

## 🌍 Environnements

- **Développement**: `http://localhost:3000`
- **Production**: [À définir]

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Contact

- **Email**: [taha.romdhane1999@gmail.com](mailto:taha.romdhane1999@gmail.com)
- **Site Web**: [omedical-para.tn](https://omedical-para.tn)

---

<div align="center">
  Développé avec ❤️ par [Taha Yassine Romdhane](https://taha-yassine-romdhane.github.io) - © 2025 O'Medical
</div>
