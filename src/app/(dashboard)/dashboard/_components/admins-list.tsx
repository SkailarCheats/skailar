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
import { UserDetail } from "@/payload-types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownActions } from "../_components/dropdown-actions"

export default async function AdminsList() {
	const payload = await getPayloadClient()

	const { docs: admins } = await payload.find({
		collection: "users",
		where: {
			role: {
				equals: 'admin'
			}
		}
	})

	const processedAdmins = admins.map(admin => {
		let roleClass = '';
		let verifiedClass = '';

		switch (admin.role) {
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

		switch (admin._verified) {
			case true:
				verifiedClass = 'text-green-500'
				break;
			case false:
				verifiedClass = 'text-red-500'
		}

		return {
			...admin,
			roleClass,
			verifiedClass,
		};
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Admins</CardTitle>
				<CardDescription>
					Manage your admins and view their infos.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Username</TableHead>
							<TableHead className="hidden lg:table-cell">Email</TableHead>
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
						{processedAdmins.map((admin, index) => (
							<TableRow key={index}>
								<TableCell>
									{admin.username}
								</TableCell>
								<TableCell className="hidden lg:table-cell">
									{admin.email}
								</TableCell>
								<TableCell className="font-medium">
									<Badge variant="outline" className={admin.verifiedClass}>{admin._verified ? 'Verified' : 'Not Verified'}</Badge>
								</TableCell>
								<TableCell>
									{(admin.details as UserDetail[]).map(detail => (
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
									<Badge variant="outline" className={admin.roleClass}>{admin.role?.toUpperCase()}</Badge>
								</TableCell>
								<TableCell>{format(parseISO(admin.createdAt), 'dd/MM/yyyy hh:mm a')}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button aria-haspopup="true" size="icon" variant="ghost">
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">Toggle menu</span>
											</Button>
										</DropdownMenuTrigger>

										<DropdownActions customerId={admin.id ? admin.id : ''} customerUser={admin.username} customerEmail={admin.email} customerRole={admin.role!} customerVerified={admin._verified!} />
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="text-xs text-muted-foreground">
					Showing <strong>1-10</strong> of <strong>{admins ? admins.length : '[N/A]'}</strong> admins
				</div>
			</CardFooter>
		</Card>
	)
}
