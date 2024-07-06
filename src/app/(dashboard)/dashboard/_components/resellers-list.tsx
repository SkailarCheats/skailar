import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	DropdownMenu,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

import { getPayloadClient } from "@/get-payload"

import { format, parseISO } from 'date-fns'
import { DropdownActions } from "./dropdown-actions"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { UserDetail } from "@/payload-types"
import Link from "next/link"

export default async function ResellersList() {
	const payload = await getPayloadClient()

	const { docs: resellers } = await payload.find({
		collection: "users",
		where: {
			role: {
				equals: 'reseller'
			}
		}
	})

	const processedResellers = resellers.map(reseller => {
		let roleClass = '';
		let verifiedClass = '';

		switch (reseller.role) {
			case 'admin':
				roleClass = 'text-red-500'
				break;
			case 'reseller':
				roleClass = 'text-yellow-500'
				break;
			case 'customer':
				roleClass = 'text-muted-foreground'
				break;
			default:
				roleClass = ''
				break;
		}

		switch (reseller._verified) {
			case true:
				verifiedClass = 'text-green-500'
				break;
			case false:
				verifiedClass = 'text-red-500'
		}

		return {
			...reseller,
			roleClass,
			verifiedClass,
		};
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Resellers</CardTitle>
				<CardDescription>
					Manage your resellers and view their infos.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Username</TableHead>
							<TableHead className="hidden lg:table-cell">Email</TableHead>
							<TableHead>Store</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>ISP</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Created at</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{processedResellers.map((reseller, index) => (
							<TableRow key={index}>
								<TableCell>
									{reseller.username}
								</TableCell>
								<TableCell className="hidden lg:table-cell">
									{reseller.email}
								</TableCell>
								<TableCell>
									<Link href={`${reseller?.resellerStore}`} className={buttonVariants({ variant: 'link' })} target="_blank">{reseller?.resellerStore}</Link>
								</TableCell>
								<TableCell className="font-medium">
									<Badge variant="outline" className={reseller.verifiedClass}>{reseller._verified ? 'Verified' : 'Not Verified'}</Badge>
								</TableCell>
								<TableCell>
									{(reseller.details as UserDetail[]).map(detail => (
										<TooltipProvider key={detail.id}>
											<Tooltip>
												<TooltipTrigger>
													{detail.org}
												</TooltipTrigger>
												<TooltipContent>
													<p className="text-sm font-medium px-2 py-1 rounded-md shadow-sm">
														IP: {detail.ip}
													</p>
													<p className="text-sm font-medium px-2 py-1 rounded-md shadow-sm">
														Loc: {detail.region} ({detail.country})
													</p>
													<p className="text-sm font-medium px-2 py-1 rounded-md shadow-sm">
														Timezone: {detail.timezone}
													</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									))}
								</TableCell>
								<TableCell>
									<Badge variant="outline" className={reseller.roleClass}>{reseller.role?.toUpperCase()}</Badge>
								</TableCell>
								<TableCell>{format(parseISO(reseller.createdAt), 'dd/MM/yyyy hh:mm a')}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button aria-haspopup="true" size="icon" variant="ghost">
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">Toggle menu</span>
											</Button>
										</DropdownMenuTrigger>

										<DropdownActions customerId={reseller.id ? reseller.id : ''} customerUser={reseller.username} customerEmail={reseller.email} customerRole={reseller.role!} customerVerified={reseller._verified!} />
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="text-xs text-muted-foreground">
					Showing <strong>1-10</strong> of <strong>{resellers ? resellers.length : '[N/A]'}</strong> customers
				</div>
			</CardFooter>
		</Card>
	)
}
