import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { CTA } from "@/components/cta";
import { DataLength } from "@/components/data/data-length";
import { ProductReel } from "@/components/product-reel";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowDownToLine, Headphones, RefreshCcw } from "lucide-react";
import Link from "next/link";

const perks = [
  {
    name: "Instant Delivery",
    Icon: ArrowDownToLine,
    description:
      "Receive your cheats immediately after purchase for uninterrupted gameplay.",
  },
  {
    name: "Secure Payments",
    Icon: RefreshCcw,
    description:
      "All transactions are encrypted to ensure your personal and payment information is safe.",
  },
  {
    name: "Customer Support",
    Icon: Headphones,
    description:
      "Our support team is available around the clock to assist you with any issues or questions.",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
            Your one-stop shop for premium{" "}
            <span className="text-purple-600">cheats</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to Skailar. Our team rigorously tests each cheat to
            guarantee top-notch quality and reliability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/products" className={buttonVariants()}>
              Explore Popular Cheats
            </Link>
            <Link
              href="https://discord.gg/skailar"
              target="_blank"
              className={buttonVariants({ variant: "outline" })}
            >
              Connect on Discord &rarr;
            </Link>
          </div>
        </div>

        <ProductReel
          query={{ sort: "desc", limit: 4 }}
          title="Brand New"
          href="/products"
        />
      </MaxWidthWrapper>

      {/* TODO: Uncomment for new launch
      
      <Jumbotron />

      <SphereMask />

      <MaxWidthWrapper>
        <ProductReel
          query={{ sort: "desc", limit: 4 }}
          title="Brand New"
          href="/products"
        />
      </MaxWidthWrapper> */}

      <section className="border-t border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:items-start md:text-left lg:block lg:text-center"
              >
                <div className="md:flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100">
                    {<perk.Icon className="w-1/3 h-1/3" />}
                  </div>
                </div>

                <div className="mt-6 md:ml-4 md:mt-0 lg:ml-0 lg:mt-6">
                  <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                    {perk.name}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>

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
