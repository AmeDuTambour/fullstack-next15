/**
 * Libellés de l'espace d'administration.
 *
 * Note de périmètre : la traduction est littérale. Le rapport d'audit
 * interrogeait la pertinence d'un vocabulaire de logiciel de gestion — « Tableau
 * de bord », « Chiffre d'affaires » — pour un artisan seul. Repenser ce
 * vocabulaire est une décision produit, hors de cette spécification.
 */
export const admin = {
  // Navigation
  nav: {
    overview: "Vue d'ensemble",
    products: "Produits",
    orders: "Commandes",
    users: "Utilisateurs",
    articles: "Articles",
  },

  // Vue d'ensemble
  overviewTitle: "Vue d'ensemble",
  totalRevenue: "Chiffre d'affaires",
  salesCount: "Ventes",
  customersCount: "Clients",
  productsCount: "Produits",
  recentSales: "Ventes récentes",
  buyer: "Acheteur",
  deletedUser: "Utilisateur supprimé",

  // Produits
  reference: "Référence",
  productsTitle: "Produits",
  createProduct: "Créer un produit",
  category: "Catégorie",
  stock: "Stock",
  published: "Publié",
  draft: "Brouillon",
  filteredBy: (query: string) => `Filtré sur « ${query} »`,
  clearFilter: "Retirer le filtre",

  // Commandes
  ordersTitle: "Commandes",
  paid: "Paiement",
  delivered: "Expédition",
  notPaid: "En attente",
  notDelivered: "Pas encore expédiée",

  // Utilisateurs
  usersTitle: "Utilisateurs",
  updateUser: "Modifier l'utilisateur",
  roleAdmin: "Administrateur",
  roleUser: "Client",
  selectRole: "Choisir un rôle",

  // Articles
  articlesTitle: "Articles",
  newArticle: "Nouvel article",
  createdAt: "Créé le",
  updatedAt: "Modifié le",

  // Éditeurs — étapes
  steps: {
    createProduct: "Créer le produit",
    addSpecifications: "Ajouter les caractéristiques",
    publishProduct: "Publier le produit",
    enterTitle: "Saisir le titre",
    addSections: "Ajouter les sections",
    publishArticle: "Publier l'article",
  },

  // Éditeur produit
  createProductTitle: "Créer un produit",
  addSpecificationsTitle: "Ajouter les caractéristiques",
  publishProductTitle: "Publier le produit",
  featureProduct: "Mettre en avant sur l'accueil",
  returnToProducts: "Retour aux produits",
  productName: "Nom",
  productNamePlaceholder: "Nom du produit",
  slug: "Lien",
  slugPlaceholder: "lien-du-produit",
  description: "Description",
  descriptionPlaceholder: "Description du produit",
  price: "Prix",
  pricePlaceholder: "0,00",
  stockPlaceholder: "Quantité en stock",
  images: "Images",
  selectCategory: "Choisir une catégorie",
  qrCodeValue: "Code produit (QR)",
  qrCodePlaceholder: "Code imprimé sur l'étiquette",
  downloadQrCode: "Télécharger le QR code",
  generate: "Générer",
  section: (n: number) => `Section ${n}`,

  // Caractéristiques
  skinType: "Type de peau",
  dimensions: "Dimensions",
  selectSkinType: "Choisir un type de peau",
  selectDimensions: "Choisir des dimensions",
  color: "Couleur",
  material: "Matière",
  size: "Taille",
  colorPlaceholder: "Couleur",
  materialPlaceholder: "Matière",
  sizePlaceholder: "Taille",
  saveSpecifications: "Enregistrer les caractéristiques",

  // Éditeur article
  createArticleTitle: "Créer un article",
  addSectionsTitle: "Ajouter les sections",
  publishArticleTitle: "Publier l'article",
  featureArticle: "Mettre en avant sur l'accueil",
  returnToArticles: "Retour aux articles",
  articleTitle: "Titre",
  articleTitlePlaceholder: "Titre de l'article",
  thumbnail: "Vignette",
  banner: "Bannière",
  addSection: "Ajouter une section",
  sectionTitle: "Titre de la section",
  sectionBody: "Paragraphe",
  media: "Média (facultatif)",
  mediaNone: "Aucun",
  mediaImage: "Image",
  mediaVideo: "Vidéo YouTube",
  videoUrl: "Adresse de la vidéo",
  videoUrlPlaceholder: "Adresse YouTube",

  // Catégories d'articles
  categoryName: "Nom de la catégorie",
  createCategory: "Créer la catégorie",
  updateCategory: "Modifier la catégorie",
  requiredField: "Ce champ est obligatoire",

  // Recherche
  formHasErrors:
    "Certains champs sont incomplets ou invalides. Corrigez-les avant d'enregistrer.",
  searchPlaceholder: "Rechercher…",
} as const;
