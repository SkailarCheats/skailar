import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export const TeamMembers = () => {
	const team = [
		{ id: '1017875194599190599', name: 'AmTriiX', img: '1017875194599190599/351a9d7b49338085cf79f35164186281', role: 'Owner' },
		{ id: '1044344751547240468', name: 'Steveyx', img: '1044344751547240468/ecde6a42aca7e1aec11d32dc04778fb9', role: 'Owner' },
		{ id: '1163614739998461952', name: 'AlessReturn', img: '1163614739998461952/e1aa81fb8929b2589dafb2661b37d676', role: 'Graphic Designer' }
	]

	return (
		<div className="container px-4 md:px-6">
			<div className="flex flex-col items-center justify-center space-y-4 text-center">
				<div className="space-y-2">
					<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Our Team</div>
					<h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Meet the Skailar Team</h2>
					<p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
						At Skailar, our team is dedicated to providing you with top-tier gaming enhancements and support. Composed of passionate
						gamers and skilled developers, we work tirelessly to ensure our cheats are cutting-edge, reliable, and tailored to your
						needs. Get to know the talented individuals behind Skailar who make your gaming experience extraordinary.
					</p>
				</div>
			</div>
			<div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
				{team.map(member => {
					let roleColor = '';

					switch (member.role) {
						case 'Owner':
							roleColor = "text-[#e74c3c]";
							break;
						case 'Graphic Designer':
							roleColor = "text-[#3498db]";
							break;
						default:
							roleColor = "text-white"
					}

					return (
						<Link
							key={member.id}
							href={`https://discord.com/users/${member.id}`}
							target="_blank"
							className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
						>
							<div className="p-6">
								<div className="flex items-center space-x-4">
									<Avatar className="w-16 h-16">
										<AvatarImage
											src={`https://cdn.discordapp.com/avatars/${member.img}`}
											alt={member.name}
											className="object-cover"
										/>
										<AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
											{member.name.charAt(0)}
										</AvatarFallback>
									</Avatar>
									<div>
										<h3 className="text-lg font-semibold text-gray-800 dark:text-white">
											{member.name}
										</h3>
										<p className={`text-sm ${roleColor} mt-1`}>{member.role}</p>
									</div>
								</div>
							</div>
						</Link>
					)
				})}
			</div>
		</div>
	)
}