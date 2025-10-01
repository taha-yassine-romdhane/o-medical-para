import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PromotionsSection from "@/components/PromotionsSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import NewsletterSection from "@/components/NewsletterSection";
import { sampleProducts } from "@/lib/products";

export default function Home() {
  const featuredProducts = sampleProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <PromotionsSection products={sampleProducts} />
      <FeaturedProductsSection products={featuredProducts} />
      <NewsletterSection />
    </div>
  );
}