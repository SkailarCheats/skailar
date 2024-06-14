import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
							<TableHead>Email</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="hidden md:table-cell">Created at</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{resellers.map(async (reseller, index) => {
							let role = '';
							let verified = '';

							switch (reseller.role) {
								case 'admin':
									role = 'text-red-500'
									break;
								case 'reseller':
									role = 'text-yellow-500'
									break;
								case 'customer':
									role = 'text-muted-foreground'
									break;
								default:
									role = ''
									break;
							}

							switch (reseller._verified) {
								case true:
									verified = 'text-green-500'
									break;
								case false:
									verified = 'text-red-500'
							}

							return (
								<TableRow key={index}>
									<TableCell className="hidden sm:table-cell">
										{reseller.username}
									</TableCell>
									<TableCell className="hidden sm:table-cell">
										{reseller.email}
									</TableCell>
									<TableCell className="font-medium">
										<Badge variant="outline" className={verified}>{reseller._verified ? 'Verified' : 'Not Verified'}</Badge>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className={role}>{reseller.role?.toUpperCase()}</Badge> {/* ADMIN | RESELLER | USER */}
									</TableCell>
									<TableCell className="hidden md:table-cell">{format(parseISO(reseller.createdAt), 'dd/MM/yyyy hh:mm a')}</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button aria-haspopup="true" size="icon" variant="ghost">
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>

											<DropdownActions customerId={reseller.id ? reseller.id : ''} customerUser={reseller.username} customerEmail={reseller.email} />
										</DropdownMenu>
									</TableCell>
								</TableRow>
							)
						})}
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
