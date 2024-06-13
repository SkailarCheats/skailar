import {
	Activity,
	ArrowUpRight,
	CreditCard,
	DollarSign,
	Users
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { getPayloadClient } from "@/get-payload"
import { getServerSideUser } from "@/lib/payload-utils"
import { formatPrice } from "@/lib/utils"
import { formatDistanceToNow, parseISO } from "date-fns"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Product, User } from "@/payload-types"

export async function MainDashboard() {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	if (!user || user.role !== 'admin') {
		return redirect('/')
	}

	const payload = await getPayloadClient()

	const { docs: orders } = await payload.find({
		collection: "orders",
		where: {
			_isPaid: {
				equals: true
			}
		}
	})

	const totalRevenue = orders.reduce((sum, order) => {
		return sum + order.products.reduce((orderSum, product) => {
			return orderSum + (product as Product).price
		}, 0)
	}, 0)

	const numLicenses = orders.reduce((sum, order) => {
		return sum + (order.licenseKey ? 1 : 0);
	}, 0);

	const { docs: customers } = await payload.find({
		collection: 'users',
		depth: 2
	})

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				<Card x-chunk="dashboard-01-chunk-0">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Revenue
						</CardTitle>
						<DollarSign className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
						<p className="text-xs text-muted-foreground">
							+0% from last month
						</p>
					</CardContent>
				</Card>
				<Card x-chunk="dashboard-01-chunk-1">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Subscriptions
						</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+{numLicenses}</div>
						<p className="text-xs text-muted-foreground">
							+0% from last month
						</p>
					</CardContent>
				</Card>
				<Card x-chunk="dashboard-01-chunk-2">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sales</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+{orders?.length ?? 0}</div>
						<p className="text-xs text-muted-foreground">
							+0% from last month
						</p>
					</CardContent>
				</Card>
				<Card x-chunk="dashboard-01-chunk-3">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Active Now</CardTitle>
						<Activity className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+0</div>
						<p className="text-xs text-muted-foreground">
							+0 since last hour
						</p>
					</CardContent>
				</Card>
			</div>
			<div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
				<Card
					className="xl:col-span-2" x-chunk="dashboard-01-chunk-4"
				>
					<CardHeader className="flex flex-row items-center">
						<div className="grid gap-2">
							<CardTitle>Customers</CardTitle>
							<CardDescription>
								Recent customers from your store.
							</CardDescription>
						</div>
						<Button asChild size="sm" className="ml-auto gap-1">
							<Link href="/dashboard/customers" target="_blank">
								View All
								<ArrowUpRight className="h-4 w-4" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Customer</TableHead>
									<TableHead className="hidden xl:table-column">
										ID
									</TableHead>
									<TableHead className="hidden xl:table-column">
										Status
									</TableHead>
									<TableHead className="hidden xl:table-column">
										Role
									</TableHead>
									<TableHead className="text-right">Created</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{customers?.map((customer, index) => (
									<TableRow key={index}>
										<TableCell>
											<div className="hidden text-sm text-muted-foreground md:inline">
												{customer.email}
											</div>
										</TableCell>
										<TableCell className="hidden xl:table-column">
											{customer.id}
										</TableCell>
										<TableCell className="hidden xl:table-column">
											<Badge className="text-xs" variant="outline">
												{customer._verified ? 'Verified' : 'Not Verified'}
											</Badge>
										</TableCell>
										<TableCell className="hidden md:table-cell lg:hidden xl:table-column">
											{customer.role}
										</TableCell>
										<TableCell className="text-right">{formatDistanceToNow(parseISO(customer.createdAt), { addSuffix: true })}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
				<Card x-chunk="dashboard-01-chunk-5">
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-8">
						{orders.map((order, index) => (
							<div className="flex items-center gap-4" key={index}>
								<div className="grid gap-1">
									<p className="text-sm text-muted-foreground">
										{(order.user as User).email}
									</p>
								</div>
								<div className="ml-auto font-medium">
									{order.products.map((product, index) => (
										<p key={index}>
											{formatPrice((product as Product).price)}
										</p>
									))}
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</>
	)
}
