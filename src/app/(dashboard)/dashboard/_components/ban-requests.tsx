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
import { Banrequest, User } from "@/payload-types"
import { MoreHorizontal } from "lucide-react"

import { format, parseISO } from 'date-fns'
import { Badge } from "@/components/ui/badge"

export const BanRequests = ({ allBanRequests }: { allBanRequests: Banrequest[] }) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Ban Requests</CardTitle>
				<CardDescription>
					Manage your ban requests and view their infos.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="hidden lg:table-cell">ID</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Key</TableHead>
							<TableHead>Reason</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{allBanRequests.map(request => (
							<TableRow key={request.id}>
								<TableCell className="hidden lg:table-cell">
									{request.id}
								</TableCell>
								<TableCell>
									<Badge variant="outline" className="text-primary">
										{(request.username as User).username}
									</Badge>
								</TableCell>
								<TableCell>
									{(request.username as User).email}
								</TableCell>
								<TableCell>
									{request.key}
								</TableCell>
								<TableCell>
									{request.reason}
								</TableCell>
								<TableCell>
									{format(parseISO(request.createdAt), 'dd/MM/yyyy hh:mm a')}
								</TableCell>

								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button aria-haspopup="true" size="icon" variant="ghost">
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">Toggle menu</span>
											</Button>
										</DropdownMenuTrigger>

										{/* <DropdownActions customerId={reseller.id ? reseller.id : ''} customerUser={reseller.username} customerEmail={reseller.email} /> */}
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<CardFooter>
				<div className="text-xs text-muted-foreground">
					Showing <strong>1-10</strong> of <strong>{allBanRequests ? allBanRequests.length : '[N/A]'}</strong> Requests
				</div>
			</CardFooter>
		</Card>
	)
}