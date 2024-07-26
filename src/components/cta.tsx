import Marquee from "@/components/magicui/marquee";
import { buttonVariants } from "@/components/ui/button";
import { PRODUCT_CATEGORY } from "@/config";
import { cn } from "@/lib/utils";
import { ChevronRight, Package2 } from "lucide-react";
import Image from "next/image";

const ReviewCard = ({
	name,
	category,
	img
}: {
	name: string;
	category: string;
	img: string;
}) => {
	return (
		<figure
			className={cn(
				"relative w-64 cursor-pointer overflow-hidden rounded-3xl border p-4 transition-shadow hover:shadow-lg",
				// light styles
				"border-gray-200 bg-white hover:bg-gray-100",
				// dark styles
				"dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700",
			)}
		>
			<div className="relative h-40 w-full overflow-hidden rounded-xl">
				<Image className="object-cover" src={img} alt={name} layout="fill" />
			</div>
			<div className="mt-4 flex flex-col items-start">
				<figcaption className="text-base font-semibold dark:text-white">
					{name}
				</figcaption>
				<p className="text-sm font-medium text-gray-500 dark:text-gray-400">{category}</p>
			</div>
		</figure>
	);
};

export async function CTA() {
	const products = PRODUCT_CATEGORY.flatMap(category =>
		category.featured.map(product => ({
			...product,
			category: category.label,
			img: category.img,
			id: `${category.value}-${product.name}`
		}))
	);

	const firstRow = products.slice(0, products.length / 2);
	const secondRow = products.slice(products.length / 2);

	return (
		<section id="cta">
			<div className="py-14">
				<div className="container flex w-full flex-col items-center justify-center p-4">
					<div className="relative flex w-full max-w-[1000px] flex-col items-center justify-center overflow-hidden rounded-[2rem] border p-10 py-14">
						<div className="absolute rotate-[35deg]">
							<Marquee pauseOnHover className="[--duration:20s]" repeat={3}>
								{firstRow.map((product) => (
									<ReviewCard key={product.id} {...product} />
								))}
							</Marquee>
							<Marquee
								reverse
								pauseOnHover
								className="[--duration:20s]"
								repeat={3}
							>
								{secondRow.map((product) => (
									<ReviewCard key={product.id} {...product} />
								))}
							</Marquee>
							<Marquee pauseOnHover className="[--duration:20s]" repeat={3}>
								{firstRow.map((product) => (
									<ReviewCard key={product.id} {...product} />
								))}
							</Marquee>
							<Marquee
								reverse
								pauseOnHover
								className="[--duration:20s]"
								repeat={3}
							>
								{secondRow.map((product) => (
									<ReviewCard key={product.id} {...product} />
								))}
							</Marquee>
							<Marquee pauseOnHover className="[--duration:20s]" repeat={3}>
								{firstRow.map((product) => (
									<ReviewCard key={product.id} {...product} />
								))}
							</Marquee>
							<Marquee
								reverse
								pauseOnHover
								className="[--duration:20s]"
								repeat={3}
							>
								{secondRow.map((product) => (
									<ReviewCard key={product.id} {...product} />
								))}
							</Marquee>
						</div>
						<div className="z-10 mx-auto size-24 rounded-[2rem] border bg-white/10 p-3 shadow-2xl backdrop-blur-md dark:bg-black/10 lg:size-32">
							<Package2 className="mx-auto size-16 text-black dark:text-white lg:size-24" />
						</div>
						<div className="z-10 mt-4 flex flex-col items-center text-center text-black dark:text-white">
							<h1 className="text-3xl font-bold lg:text-4xl">
								Skailar - Your Ultimate Gaming Partner.
							</h1>
							<p className="mt-2">
								Elevate your gaming experience with Skailar. Start your journey today.
							</p>
							<a
								href="/products"
								className={cn(
									buttonVariants({
										size: "lg",
										variant: "outline",
									}),
									"group mt-4 px-6",
								)}
							>
								Discover Products
								<ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
							</a>
						</div>
						<div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-white to-70% dark:to-black" />
					</div>
				</div>
			</div>
		</section>
	);
}
