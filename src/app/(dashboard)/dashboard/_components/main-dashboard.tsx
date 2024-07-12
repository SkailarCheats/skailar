import {
	ArrowUpRight,
	CreditCard,
	Euro,
	ShoppingCart
} from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
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
import { cn, formatPrice } from "@/lib/utils"
import { Product, User } from "@/payload-types"
import { endOfMonth, formatDistanceToNow, parseISO, startOfMonth, subMonths } from "date-fns"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ActiveKeys } from "./active-keys"
import { AllLicenses } from "./all-licenses"
import { LineCharts } from "./line-chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export async function MainDashboard() {
	const nextCookies = cookies();
	const { user } = await getServerSideUser(nextCookies)

	if (!user || user.role !== 'admin') {
		return redirect('/')
	}

	const payload = await getPayloadClient()

	const currentMonthStart = startOfMonth(new Date())
	const currentMonthEnd = endOfMonth(new Date())
	const previousMonthStart = startOfMonth(subMonths(new Date(), 1))
	const previousMonthEnd = endOfMonth(subMonths(new Date(), 1))

	const { docs: currentMonthOrders = [] } = await payload.find({
		collection: "orders",
		where: {
			_isPaid: {
				equals: true
			},
			createdAt: {
				greater_than: currentMonthStart.toISOString(),
				less_than: currentMonthEnd.toISOString(),
			}
		}
	})

	const { docs: previousMonthOrders = [] } = await payload.find({
		collection: "orders",
		where: {
			_isPaid: {
				equals: true
			},
			createdAt: {
				greater_than: previousMonthStart.toISOString(),
				less_than: previousMonthEnd.toISOString(),
			}
		}
	})

	const totalRevenueCurrentMonth = currentMonthOrders.reduce((sum, order) => {
		return sum + order.products.reduce((orderSum, product) => {
			return orderSum + (product as Product).price
		}, 0)
	}, 0)

	const totalRevenuePreviousMonth = previousMonthOrders.reduce((sum, order) => {
		return sum + order.products.reduce((orderSum, product) => {
			return orderSum + (product as Product).price
		}, 0)
	}, 0)

	const revenueChangePercent = totalRevenuePreviousMonth === 0
		? 0
		: ((totalRevenueCurrentMonth - totalRevenuePreviousMonth) / totalRevenuePreviousMonth) * 100

	const totalOrdersCurrentMonth = currentMonthOrders.length;
	const totalOrdersPreviousMonth = previousMonthOrders.length;

	const ordersChangePercent = totalOrdersPreviousMonth === 0
		? 0
		: ((totalOrdersCurrentMonth - totalOrdersPreviousMonth) / totalOrdersPreviousMonth) * 100

	const { docs: orders = [] } = await payload.find({
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

	const keys = orders
		.filter(order => order.licenseKey !== null && order.licenseKey !== undefined)
		.map(order => order.licenseKey as string);

	const { docs: customers = [] } = await payload.find({
		collection: 'users',
		where: {
			role: {
				equals: 'customer'
			}
		},
		depth: 2
	})

	const [order] = orders
	const [customer] = customers

	const now = new Date();
	const last12Months = Array.from({ length: 12 }, (_, i) => {
		const date = subMonths(now, i);
		return date.toLocaleString('default', { month: 'short' });
	}).reverse();

	const revenueData = last12Months.reduce((acc, month) => {
		acc[month] = 0;
		return acc;
	}, {} as { [key: string]: number });

	orders.forEach(order => {
		const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
		const revenue = order.products.reduce((sum, product) => sum + (product as Product).price, 0);
		if (revenueData[month] !== undefined) {
			revenueData[month] += revenue;
		}
	});

	const revenueDataChart = Object.keys(revenueData).map(month => ({
		name: month,
		revenue: revenueData[month]
	}));

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
				<Card x-chunk="dashboard-01-chunk-0">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							Total Revenue
						</CardTitle>
						<Euro className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{totalRevenue ? formatPrice(totalRevenue) : '[N/A]'}</div>
						<p className="text-xs text-muted-foreground">
							{totalRevenuePreviousMonth === 0 ? "No data for last month" : `${revenueChangePercent >= 0 ? '+' : ''}${revenueChangePercent.toFixed(2)}% from last month`}
						</p>
						<LineCharts data={revenueDataChart} />
					</CardContent>
				</Card>
				<AllLicenses />
				<Card x-chunk="dashboard-01-chunk-2">
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Sales</CardTitle>
						<CreditCard className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">+{orders?.length ?? 0}</div>
						<p className="text-xs text-muted-foreground">
							{totalOrdersPreviousMonth === 0 ? "No data for last month" : `${ordersChangePercent >= 0 ? '+' : ''}${ordersChangePercent.toFixed(2)}% from last month`}
						</p>
					</CardContent>
				</Card>
				<ActiveKeys />
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
						{customers.length > 0 ? (
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Customer</TableHead>
										<TableHead>
											ID
										</TableHead>
										<TableHead>
											Status
										</TableHead>
										<TableHead className="text-right">Created</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{customers
										.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
										.slice(0, 6)
										.map((customer, index) => (
											<TableRow key={index}>
												<TableCell>
													<div className="hidden text-sm text-muted-foreground md:inline">
														{customer.username}
													</div>
												</TableCell>
												<TableCell>
													{customer.id}
												</TableCell>
												<TableCell>
													<Badge className={cn("text-xs", customer._verified ? 'text-green-500' : 'text-red-500')} variant="outline">
														{customer._verified ? 'Verified' : 'Not Verified'}
													</Badge>
												</TableCell>
												<TableCell className="text-right">{formatDistanceToNow(parseISO(customer.createdAt), { addSuffix: true })}</TableCell>
											</TableRow>
										))}
								</TableBody>
							</Table>
						) : (
							<h1 className="text-center font-bold text-2xl">You have no Customers</h1>
						)}
					</CardContent>
				</Card>
				<Card x-chunk="dashboard-01-chunk-5">
					<CardHeader>
						<CardTitle>Recent Sales</CardTitle>
					</CardHeader>
					{orders.length > 0 ? (
						<CardContent className="grid gap-8">
							{orders.slice(-5).map((order, index) => (
								<div className="flex items-center justify-between gap-4 w-full" key={index}>
									<div className="flex items-center gap-4">
										<Avatar className="hidden h-9 w-9 sm:flex">
											<AvatarImage src="https://cdn.skailar.com/v1/assets/img/placeholder.png?width=453&height=453" />
											<AvatarFallback className="bg-purple-500">
												{(order.user as User).username
													? (order.user as User).username[0].toUpperCase()
													: ''}
											</AvatarFallback>
										</Avatar>
										<div className="grid gap-1">
											<div className="text-sm">
												{(order.user as User).username ? (
													<>
														<p className="text-sm font-medium leading-none">{(order.user as User).username}</p>
														<p className="text-sm text-muted-foreground">{(order.user as User).email}</p>
														<span className="flex gap-1">
															<p className="text-sm text-muted-foreground">
																Purchased:
															</p>
															{(order.products as Product[]).map(product => (
																<Link
																	key={product.id}
																	className={buttonVariants({ variant: 'link', size: 'custom' })}
																	target="_blank"
																	href={`/product/${product.id}`}
																>
																	{product.name}
																</Link>
															))}
														</span>
													</>
												) : '[N/A]'}
											</div>
										</div>
									</div>
									<div className="text-right">
										{order.products.map((product, index) => (
											<p key={index} className="font-medium">
												{(product as Product).price ? formatPrice((product as Product).price) : '[N/A]'}
											</p>
										))}
									</div>
								</div>
							))}
						</CardContent>
					) : (
						<CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
							<ShoppingCart className="w-14 h-14 text-purple-400 mb-4" />
							<h1 className="text-2xl font-bold mb-2">No Recent Sales</h1>
							<p className="text-muted-foreground mb-4">
								It looks like you haven&apos;t made any sales recently.
							</p>
						</CardContent>
					)}
				</Card>
			</div>
		</>
	)
}
