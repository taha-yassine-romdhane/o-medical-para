'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, BookOpen, Heart, Sparkles, Baby, Pill, Leaf, Sun, Shield, ChevronRight } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string | null;
  slug: string;
}

interface Tip {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function ConseilsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Sample articles data
  const articles: Article[] = [
    {
      id: '1',
      title: 'Comment choisir la bonne crème hydratante pour votre peau',
      excerpt: 'Découvrez les critères essentiels pour sélectionner une crème adaptée à votre type de peau et aux besoins spécifiques de votre épiderme.',
      category: 'Soins de la peau',
      readTime: '5 min',
      image: null,
      slug: 'choisir-creme-hydratante'
    },
    {
      id: '2',
      title: 'Les vitamines essentielles pour renforcer votre immunité',
      excerpt: 'Un guide complet sur les vitamines et minéraux qui jouent un rôle crucial dans le maintien d\'un système immunitaire fort.',
      category: 'Nutrition & Compléments',
      readTime: '7 min',
      image: null,
      slug: 'vitamines-immunite'
    },
    {
      id: '3',
      title: 'Routine de soins pour bébé : les indispensables',
      excerpt: 'Les produits et gestes essentiels pour prendre soin de la peau délicate de votre bébé au quotidien.',
      category: 'Bébé & Maman',
      readTime: '6 min',
      image: null,
      slug: 'routine-soins-bebe'
    },
    {
      id: '4',
      title: 'Protection solaire : mythes et réalités',
      excerpt: 'Tout ce que vous devez savoir sur la protection solaire efficace et les idées reçues à éviter.',
      category: 'Prévention',
      readTime: '8 min',
      image: null,
      slug: 'protection-solaire'
    },
    {
      id: '5',
      title: 'Les bienfaits des cosmétiques naturels',
      excerpt: 'Pourquoi choisir des cosmétiques naturels et comment identifier les vrais produits bio.',
      category: 'Beauté',
      readTime: '5 min',
      image: null,
      slug: 'cosmetiques-naturels'
    },
    {
      id: '6',
      title: 'Gérer les allergies saisonnières naturellement',
      excerpt: 'Des solutions naturelles et des conseils pratiques pour mieux vivre avec les allergies saisonnières.',
      category: 'Santé',
      readTime: '6 min',
      image: null,
      slug: 'allergies-saisonnieres'
    }
  ];

  // Quick tips
  const tips: Tip[] = [
    {
      id: '1',
      title: 'Hydratation quotidienne',
      description: 'Buvez au moins 1,5L d\'eau par jour pour maintenir une peau hydratée et éclatante.',
      icon: 'droplet'
    },
    {
      id: '2',
      title: 'Protection UV',
      description: 'Appliquez une crème solaire SPF 30+ même en hiver pour protéger votre peau.',
      icon: 'sun'
    },
    {
      id: '3',
      title: 'Routine régulière',
      description: 'Nettoyez votre visage matin et soir avec des produits adaptés à votre type de peau.',
      icon: 'sparkles'
    },
    {
      id: '4',
      title: 'Compléments alimentaires',
      description: 'Consultez un professionnel avant de commencer une cure de compléments alimentaires.',
      icon: 'pill'
    }
  ];

  // FAQs
  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'Quelle est la différence entre une pharmacie et une parapharmacie ?',
      answer: 'La pharmacie vend des médicaments sur ordonnance et sans ordonnance, tandis que la parapharmacie propose des produits de santé, beauté et bien-être sans prescription médicale : cosmétiques, compléments alimentaires, soins du corps, etc.',
      category: 'Général'
    },
    {
      id: '2',
      question: 'Comment conserver mes produits parapharmaceutiques ?',
      answer: 'Conservez vos produits dans un endroit frais et sec, à l\'abri de la lumière directe. Respectez les dates de péremption et les conditions de conservation indiquées sur l\'emballage.',
      category: 'Général'
    },
    {
      id: '3',
      question: 'Puis-je utiliser des produits périmés ?',
      answer: 'Non, il est déconseillé d\'utiliser des produits périmés car leur efficacité diminue et ils peuvent provoquer des réactions cutanées ou allergiques.',
      category: 'Sécurité'
    },
    {
      id: '4',
      question: 'Comment choisir un complément alimentaire adapté ?',
      answer: 'Identifiez vos besoins spécifiques, vérifiez la composition, préférez des marques reconnues et consultez un professionnel de santé si vous avez des doutes ou des conditions médicales particulières.',
      category: 'Compléments'
    },
    {
      id: '5',
      question: 'Les produits bio sont-ils vraiment meilleurs ?',
      answer: 'Les produits bio contiennent moins d\'ingrédients synthétiques et de pesticides. Ils sont souvent mieux tolérés par les peaux sensibles, mais l\'efficacité dépend de la formulation globale du produit.',
      category: 'Produits'
    },
    {
      id: '6',
      question: 'Quelle routine de soins pour peau sensible ?',
      answer: 'Utilisez des produits hypoallergéniques, nettoyez en douceur, hydratez régulièrement avec des formules adaptées et évitez les produits parfumés ou contenant de l\'alcool.',
      category: 'Soins'
    }
  ];

  const categories = ['all', 'Soins de la peau', 'Nutrition & Compléments', 'Bébé & Maman', 'Beauté', 'Prévention', 'Santé'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Soins de la peau': return <Sparkles className="h-5 w-5" />;
      case 'Nutrition & Compléments': return <Pill className="h-5 w-5" />;
      case 'Bébé & Maman': return <Baby className="h-5 w-5" />;
      case 'Beauté': return <Heart className="h-5 w-5" />;
      case 'Prévention': return <Shield className="h-5 w-5" />;
      case 'Santé': return <Leaf className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  const getTipIcon = (icon: string) => {
    switch(icon) {
      case 'sun': return <Sun className="h-8 w-8" style={{ color: '#7ED321' }} />;
      case 'sparkles': return <Sparkles className="h-8 w-8" style={{ color: '#7ED321' }} />;
      case 'pill': return <Pill className="h-8 w-8" style={{ color: '#7ED321' }} />;
      default: return <Leaf className="h-8 w-8" style={{ color: '#7ED321' }} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: 'calc(100vh - 200px)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1F2937', marginBottom: '1rem' }}>
            Conseils & Guides Parapharmacie
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
            Découvrez nos conseils d'experts, guides pratiques et réponses à vos questions sur la santé et le bien-être
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
          <div style={{
            position: 'relative',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            padding: '0.75rem 1rem'
          }}>
            <Search style={{ width: '1.25rem', height: '1.25rem', color: '#9CA3AF', marginRight: '0.75rem' }} />
            <input
              type="text"
              placeholder="Rechercher un conseil, guide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.9375rem',
                color: '#1F2937'
              }}
            />
          </div>
        </div>

        {/* Quick Tips Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
            Conseils Rapides
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          >
            {tips.map((tip) => (
              <div
                key={tip.id}
                style={{
                  backgroundColor: 'white',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  {getTipIcon(tip.icon)}
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1F2937', marginBottom: '0.5rem' }}>
                  {tip.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6B7280', lineHeight: '1.5' }}>
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #E5E7EB',
                  backgroundColor: selectedCategory === category ? '#7ED321' : 'white',
                  color: selectedCategory === category ? 'white' : '#4B5563',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = '#7ED321';
                    e.currentTarget.style.color = '#7ED321';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.color = '#4B5563';
                  }
                }}
              >
                {category === 'all' ? 'Tous' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
            Articles & Guides
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem'
          }}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/conseils/${article.slug}`}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Article Image */}
                <div style={{ position: 'relative', paddingTop: '60%', backgroundColor: '#F3F4F6' }}>
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#F3F4F6'
                    }}>
                      {getCategoryIcon(article.category)}
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#7ED321',
                      fontWeight: '600',
                      backgroundColor: 'rgba(126, 211, 33, 0.1)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem'
                    }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      {article.readTime} de lecture
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    color: '#1F2937',
                    marginBottom: '0.5rem',
                    lineHeight: '1.4'
                  }}>
                    {article.title}
                  </h3>

                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    lineHeight: '1.5',
                    marginBottom: '1rem'
                  }}>
                    {article.excerpt}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#7ED321',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    Lire la suite
                    <ChevronRight style={{ width: '1rem', height: '1rem', marginLeft: '0.25rem' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #E5E7EB'
            }}>
              <p style={{ color: '#6B7280' }}>Aucun article trouvé</p>
            </div>
          )}
        </div>

        {/* FAQ Section */}
        <div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1F2937', marginBottom: '1.5rem' }}>
            Questions Fréquentes
          </h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq) => (
              <div
                key={faq.id}
                style={{
                  backgroundColor: 'white',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #E5E7EB',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  style={{
                    width: '100%',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: expandedFAQ === faq.id ? '#F9FAFB' : 'white',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontSize: '0.75rem',
                      color: '#7ED321',
                      fontWeight: '600',
                      marginBottom: '0.25rem',
                      display: 'block'
                    }}>
                      {faq.category}
                    </span>
                    <span style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#1F2937'
                    }}>
                      {faq.question}
                    </span>
                  </div>
                  <ChevronRight
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      color: '#9CA3AF',
                      transform: expandedFAQ === faq.id ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                </button>
                {expandedFAQ === faq.id && (
                  <div style={{
                    padding: '0 1.25rem 1.25rem',
                    fontSize: '0.9375rem',
                    color: '#6B7280',
                    lineHeight: '1.6'
                  }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
