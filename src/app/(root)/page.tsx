import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import ClientSection from "@/components/client-section";
import { CTA } from "@/components/cta";
import { DataLength } from "@/components/data/data-length";
import { Jumbotron } from "@/components/jumbotron";
import { ProductReel } from "@/components/product-reel";
import { SphereMask } from "@/components/sphere-mask";
import { Separator } from "@/components/ui/separator";
import { PRODUCT_CATEGORY } from "@/config";
import { ArrowDownToLine, HeadphonesIcon, RefreshCw } from "lucide-react";

const PERKS = [
  {
    name: "Instant Delivery",
    Icon: ArrowDownToLine,
    description: "Receive your cheats immediately after purchase for uninterrupted gameplay.",
  },
  {
    name: "Regular Updates",
    Icon: RefreshCw,
    description: "Stay ahead with frequent updates to ensure compatibility with the latest game versions.",
  },
  {
    name: "24/7 Support",
    Icon: HeadphonesIcon,
    description: "Our dedicated team is always available to assist you with any technical issues or queries.",
  },
] as const;

export default function Home() {
  const getRandomCategory = (() => {
    let lastCategory: string | null = null;
    return () => {
      const categories = PRODUCT_CATEGORY.map(category => category.value);
      if (categories.length === 0) return 'rust';

      let newCategory;
      do {
        newCategory = categories[Math.floor(Math.random() * categories.length)];
      } while (newCategory === lastCategory);

      lastCategory = newCategory;
      return newCategory;
    };
  })();

  const category = getRandomCategory();

  return (
    <>
      <Jumbotron />
      <ClientSection />
      <SphereMask />
      <MaxWidthWrapper>
        <ProductReel
          query={{ limit: 4, category }}
          title="Our Most Popular Cheats"
          href="/products"
        />
      </MaxWidthWrapper>

      <PerkSection perks={PERKS} />

      <MaxWidthWrapper className="py-20">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl mb-4">
          Skailar Statistics
        </h1>
        <DataLength />
      </MaxWidthWrapper>

      <Separator />
      <CTA />
    </>
  );
}

function PerkSection({ perks }: { perks: typeof PERKS }) {
  return (
    <section className="border-t border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <MaxWidthWrapper className="py-20">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
          {perks.map((perk) => (
            <PerkItem key={perk.name} {...perk} />
          ))}
        </div>
      </MaxWidthWrapper>
    </section>
  );
}

function PerkItem({ name, Icon, description }: (typeof PERKS)[number]) {
  return (
    <div className="text-center md:flex md:items-start md:text-left lg:block lg:text-center">
      <div className="md:flex-shrink-0 flex justify-center">
        <div className="h-16 w-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100">
          <Icon className="w-1/3 h-1/3" />
        </div>
      </div>
      <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">{name}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}