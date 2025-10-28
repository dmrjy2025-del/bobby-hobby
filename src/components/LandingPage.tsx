import { HeroCarousel } from './HeroCarousel';
import { ProductCategorySection } from './ProductCategorySection';
import { FeaturedProducts } from './FeaturedProducts';

interface LandingPageProps {
  onNavigate: (page: string, categoryFilter?: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <>
      <HeroCarousel />
      <ProductCategorySection onNavigate={onNavigate} />
      <FeaturedProducts onNavigate={onNavigate} />
    </>
  );
}
