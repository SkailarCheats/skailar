import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { PRODUCT_CATEGORY } from "@/config";
import Image from "next/image";
import Link from "next/link";

export default function Category() {
	return (
		<MaxWidthWrapper>
			<div className="container p-5">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
					{PRODUCT_CATEGORY.map(category => (
						<Link href={`/products/${category.value}`} key={category.value} className="block bg-black rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
							<Image
								src={category.img}
								alt={category.label}
								className="w-full h-48 object-cover"
								width={192}
								height={192}
							/>
							<div className="p-4">
								<h3 className="text-lg font-semibold">{category.label}</h3>
							</div>
						</Link>
					))}
				</div>
			</div>
		</MaxWidthWrapper >
	)
}