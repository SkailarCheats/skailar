import { CTA } from "@/components/cta";
import { Jumbotron } from "@/components/jumbotron";
import { SphereMask } from "@/components/sphere-mask";
import { TeamMembers } from "@/components/team-members";
import Image from "next/image";

export default function AboutUs() {
	return (
		<>
			<Jumbotron />
			{/* <ClientSection /> */}
			<SphereMask />
			<TeamMembers />
			<SphereMask reverse />
			<section className="w-full py-12 md:py-24 lg:py-32">
				<div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
					<div className="space-y-3">
						<h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Why Skailar?</h2>
						<p className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Skailar provides the ultimate tools for gamers looking to elevate their gameplay. With our advanced cheats and hacks,
							you can gain the upper hand, improve your performance, and dominate your favorite games like never before.
						</p>
					</div>
					<div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
						<div className="flex flex-col justify-center space-y-4">
							<div className="grid gap-1">
								<h3 className="text-xl font-bold">Game-Changing Features</h3>
								<p className="text-muted-foreground">
									Unlock game-changing features with Skailar. Our cheats are designed to enhance your gaming experience and give
									you a competitive edge.
								</p>
							</div>
							<div className="grid gap-1">
								<h3 className="text-xl font-bold">Easy Integration</h3>
								<p className="text-muted-foreground">
									Seamlessly integrate our cheats with your favorite games. Skailar offers easy-to-use tools that are compatible
									with a wide range of titles.
								</p>
							</div>
							<div className="grid gap-1">
								<h3 className="text-xl font-bold">Secure and Reliable</h3>
								<p className="text-muted-foreground">
									Enjoy peace of mind with Skailar’s secure and reliable cheats. Our tools are crafted to provide the best
									performance while ensuring your safety and anonymity.
								</p>
							</div>
						</div>
						<Image
							src="https://cdn.skailar.com/v1/assets/img/logo.png"
							width="550"
							height="550"
							alt="Skailar Cheats"
							className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
						/>
					</div>
				</div>
			</section>
			<CTA />
		</>
	)
}