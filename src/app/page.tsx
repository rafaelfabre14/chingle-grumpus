import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import HeroSection from '@/components/sections/HeroSection';
import LiveGiveawayBanner from '@/components/sections/LiveGiveawayBanner';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import ShopByCategory from '@/components/sections/ShopByCategory';
import WhyChingle from '@/components/sections/WhyChingle';
import GiveawayCallout from '@/components/sections/GiveawayCallout';
import NewsletterStrip from '@/components/sections/NewsletterStrip';

export default async function HomePage() {
  const supabase = await createClient();
  const { data: featured } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(3);

  return (
    <>
      <HeroSection />
      <LiveGiveawayBanner />
      <FeaturedProducts products={(featured ?? []) as Product[]} />
      <ShopByCategory />
      <WhyChingle />
      <GiveawayCallout />
      <NewsletterStrip />
    </>
  );
}
