import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import Image from "next/image";
import Link from "next/link";
import { BorderBeam } from "@/components/magicui/border-beam";
import IconCloud from "@/components/magicui/icon-cloud";

const buildFrameworks = [
	{ id: 1, href: 'https://nextjs.org/', name: 'NextJS', image: 'https://cdn.skailar.com/v1/assets/frameworks/nextjs.png', description: 'A framework for React that enables server-side rendering and effortless deployment.' },
	{ id: 2, href: 'https://www.typescriptlang.org/', name: 'TypeScript', image: 'https://cdn.skailar.com/v1/assets/frameworks/typescript.png', description: 'A typed superset of JavaScript that enhances code maintainability and scalability.' },
	{ id: 3, href: 'https://tailwindcss.com/docs/installation', name: 'Tailwind CSS', image: 'https://cdn.skailar.com/v1/assets/frameworks/tailwind.png', description: 'A utility-first CSS framework for building custom designs with ease.' },
	{ id: 4, href: 'https://ui.shadcn.com/docs', name: 'Shadcn UI', image: 'https://cdn.skailar.com/v1/assets/frameworks/shadcn.png', description: 'Beautifully designed components by Shadcn.' },
	{ id: 5, href: 'https://trpc.io/docs', name: 'TRPC', image: 'https://cdn.skailar.com/v1/assets/frameworks/trpc.svg', description: 'A TypeScript RPC framework for building efficient, type-safe APIs with minimal boilerplate.' },
	{ id: 6, href: 'https://nodejs.org/en', name: 'NodeJS', image: 'https://cdn.skailar.com/v1/assets/frameworks/nodejs.png', description: 'A powerful JavaScript runtime built on Chrome\'s V8 JavaScript engine for building scalable network applications.' },
	{ id: 7, href: 'https://lucide.dev/guide/', name: 'Lucide', image: 'https://cdn.skailar.com/v1/assets/frameworks/lucide.svg', description: 'A library of simply beautiful icons for React, designed to be easily customizable and accessible.' },
	{ id: 8, href: 'https://magicui.design/', name: 'MagicUI', image: 'https://cdn.skailar.com/v1/assets/frameworks/magicui.png', description: 'Beautifully designed components by Magic UI.' },
	{ id: 9, href: 'https://syntaxui.com/', name: 'Syntax UI', image: 'https://cdn.skailar.com/v1/assets/frameworks/syntaxui.svg', description: 'Beautifully designed components by Syntax UI.' },
]

const slugs = [
	"typescript",
	"react",
	"nodedotjs",
	"express",
	"nextdotjs",
	"nginx",
	"git",
	"github",
	"visualstudiocode",
	"mongodb"
]

export default async function BuiltWith() {
	return (
		<MaxWidthWrapper className="flex flex-col my-14 p-2 w-full justify-center items-center">
			<div className="flex flex-col mb-[3rem]">
				<h1 className="scroll-m-20 text-3xl sm:text-xl md:text-3xl font-semibold tracking-tight lg:text-4xl text-center max-w-[700px]">
					Built with the best
				</h1>
				<p className="mx-auto max-w-[500px] md:text-lg text-center mt-2">
					Our customers deserve a product built with the best technologies
				</p>
			</div>

			<div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{buildFrameworks.map(framework => (
					<div key={framework.id} className="relative overflow-hidden rounded-lg border bg-background">
						<Link href={`${framework.href}`} rel="noopener noreferrer" target="_blank">
							<div className="p-6">
								<Image
									alt={`${framework.name}`}
									loading="lazy"
									width='40'
									height='30'
									decoding="async"
									className="mb-3 rounded"
									src={`${framework.image}`}
								/>
								<div className="mb-1 text-sm font-medium">{framework.name}</div>
								<div className="max-w-[250px] text-sm font-normal text-gray-500">
									{framework.description}
								</div>
							</div>
						</Link>
						<BorderBeam size={150} duration={5} colorFrom={framework.id === 1 ? '#8A2BE2' : framework.id === 2 ? '#9540e4' : framework.id === 3 ? '#a155e7' : '#fff'} colorTo="#9370DB" />
					</div>
				))}
			</div>

			<IconCloud iconSlugs={slugs} />
		</MaxWidthWrapper>
	)
}
