"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PRODUCT_CATEGORY } from "@/config"
import { cn, formatPrice } from "@/lib/utils"
import { Order, Product, User } from "@/payload-types"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000
const ORDERS_PER_PAGE = 10

export const OrderList = ({ user, orders }: { user: User, orders: Order[] }) => {
	const [timeRemaining, setTimeRemaining] = useState<string | null>(null)
	const [isDisabled, setIsDisabled] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(() => {
		const checkRemainingTime = () => {
			const lastRequestTime = localStorage.getItem('lastHwidResetTime')
			if (lastRequestTime) {
				const timeSinceLastRequest = new Date().getTime() - parseInt(lastRequestTime)
				if (timeSinceLastRequest < ONE_WEEK_IN_MS) {
					const remainingTime = ONE_WEEK_IN_MS - timeSinceLastRequest
					const days = Math.floor(remainingTime / (24 * 60 * 60 * 1000))
					const hours = Math.floor((remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
					const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000))
					setTimeRemaining(`${days}d ${hours}h ${minutes}m`)
					setIsDisabled(true)
				} else {
					setTimeRemaining(null)
					setIsDisabled(false)
				}
			}
		}

		checkRemainingTime()
		const interval = setInterval(checkRemainingTime, 60000)

		return () => clearInterval(interval)
	}, [])

	const resetHwid = async () => {
		if (isDisabled) return

		try {
			const response = await fetch(`https://api.skailar.com/api/seller/?sellerkey=d9f4c224a6835b0fb6ee68a46ee2d37a&type=resetuser&user=${user.username}`)
			const data = await response.json()

			if (data.success) {
				console.log(user.username)
				toast.success("HWID reset successfully!")
				localStorage.setItem('lastHwidResetTime', new Date().getTime().toString())
				setIsDisabled(true)
			} else {
				console.log(user.username)
				console.error("API Response Error:", data)
				toast.error(data.message || "Failed to reset HWID!")
			}
		} catch (error) {
			console.log(user.username)
			console.error("Network or Server Error:", error)
			toast.error("An error occurred while resetting HWID!")
		}
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			toast.success("License key copied to clipboard!")
		}).catch(() => {
			toast.error("Failed to copy license key")
		})
	}

	const totalPages = Math.ceil(orders.length / ORDERS_PER_PAGE)
	const paginatedOrders = orders.slice(
		(currentPage - 1) * ORDERS_PER_PAGE,
		currentPage * ORDERS_PER_PAGE
	)

	return (
		<div className="flex-1 p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold invisible">Customer Dashboard</h1>
				<div>
					<Button onClick={resetHwid} disabled={isDisabled}>
						{timeRemaining ? timeRemaining : 'HWID Reset'}
					</Button>
				</div>
			</div>
			<div className="grid gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Recent Orders</CardTitle>
					</CardHeader>
					<CardContent>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>ID</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Product</TableHead>
									<TableHead>License</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Total</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedOrders.map(order => (
									<TableRow key={order.id}>
										<TableCell className="font-medium">{order.id}</TableCell>
										<TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
										<TableCell>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger>
														{(order?.products[0] as Product).name}
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-sm font-medium px-2 py-1 rounded-md shadow-sm">
															{PRODUCT_CATEGORY.find((c) => c.value === (order.products[0] as Product).category)?.label}
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</TableCell>
										<TableCell>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger onClick={() => copyToClipboard(order.licenseKey || '[N/A]')}>
														{order?.licenseKey ? order.licenseKey : '[N/A]'}
													</TooltipTrigger>
													<TooltipContent>
														<p className="text-sm font-medium px-2 py-1 rounded-md shadow-sm">
															Click to copy
														</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</TableCell>
										<TableCell>
											<Badge variant="outline" className={cn(order._isPaid ? 'text-green-500' : 'text-yellow-500')}>
												{order._isPaid ? 'Paid' : 'Pending'}
											</Badge>
										</TableCell>
										<TableCell>{formatPrice((order.products[0] as Product).price)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
					<CardFooter className="flex justify-between items-center">
						<div className="text-xs text-muted-foreground">
							Showing <strong>{paginatedOrders.length}</strong> of <strong>{orders.length}</strong> orders
						</div>
						<div className="flex gap-2">
							<Button
								onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
								disabled={currentPage === 1}
								variant="outline"
								size="sm"
							>
								Previous
							</Button>
							<Button
								onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
								disabled={currentPage === totalPages}
								variant="outline"
								size="sm"
							>
								Next
							</Button>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}