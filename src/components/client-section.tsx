import Image from "next/image";

export default function ClientSection() {
	return (
		<section
			id="clients"
			className="text-center mx-auto max-w-[80rem] px-6 md:px-8"
		>
			<div className="py-14">
				<div className="mx-auto max-w-screen-xl px-4 md:px-8">
					<h2 className="text-center text-sm font-semibold text-gray-600">
						SUPPORTED GAMES ACROSS ALL MAJOR PLATFORMS
					</h2>
					<div className="mt-6">
						<ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-16 [&_path]:fill-white">
							<li>
								<Image
									src={'https://cdn.skailar.com/v1/assets/upload/rainbow.svg'}
									className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
									width={112}
									height={32}
									alt="Rainbow Six Image"
								/>
							</li>
							<li>
								<Image
									src={'https://cdn.skailar.com/v1/assets/upload/cs2.svg'}
									className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
									width={112}
									height={32}
									alt="CS2 Image"
								/>
							</li>
							<li>
								<Image
									src={'https://cdn.skailar.com/v1/assets/upload/valorant.svg'}
									className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
									width={112}
									height={32}
									alt="Valorant Image"
								/>
							</li>
							<li>
								<Image
									src={'https://cdn.skailar.com/v1/assets/upload/fortnite.svg'}
									className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
									width={112}
									height={32}
									alt="Fortnite Image"
								/>
							</li>
							{/* TODO: ADD APEX */}
							<li>
								<Image
									src={'https://cdn.skailar.com/v1/assets/upload/rust.svg'}
									className="h-8 w-28 px-2 dark:brightness-0 dark:invert"
									width={112}
									height={32}
									alt="Rust Image"
								/>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
}