import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PacksCarousel from "@/components/PacksCarousel";
import PromotionsSection from "@/components/PromotionsSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import BrandsSection from "@/components/BrandsSection";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch promotion products (isOnPromo = true)
  const promotionProducts = await prisma.product.findMany({
    where: {
      isOnPromo: true,
      isActive: true,
    },
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      images: {
        where: { isPrimary: true },
        select: {
          url: true,
        },
        take: 1,
      },
    },
    take: 8,
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch featured products (isFeatured = true)
  const featuredProducts = await prisma.product.findMany({
    where: {
      isFeatured: true,
      isActive: true,
    },
    include: {
      brand: {
        select: {
          name: true,
        },
      },
      images: {
        where: { isPrimary: true },
        select: {
          url: true,
        },
        take: 1,
      },
    },
    take: 8,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <PacksCarousel />
      <PromotionsSection products={promotionProducts} />
      <FeaturedProductsSection products={featuredProducts} />
      <BrandsSection />
    </div>
  );
}