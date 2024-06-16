import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { User } from "@/payload-types"
import { formatDistanceToNow, parseISO } from "date-fns"
import { ToggleTwoFAForm } from "./forms/toggle-twofa-form"

interface SecurityProps {
	user: User;
}

export const Security = ({ user }: SecurityProps) => {
	return (
		<>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Account Security</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Login Activity</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Last login: {formatDistanceToNow(parseISO(user.lastLogin!), { addSuffix: true })}
								</p>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Two-Factor Auth</p>
								<p className={cn("text-sm font-semibold", user.isTwoFAEnabled ? 'text-green-500' : 'text-red-500')}>{user.isTwoFAEnabled ? 'Enabled' : 'Disabled'}</p>
							</div>
						</div>
						{false && (
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">Devices</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">3 devices connected</p>
								</div>
							</div>
						)}
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Update Security Settings</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						<ToggleTwoFAForm userId={user.id} isTwoFactorEnabled={user.isTwoFAEnabled!} />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Recent Security Events</CardTitle>
					</CardHeader>
					<CardContent className="grid gap-4">
						{[user.lastLogin, user.twoFAToggled]
							.filter(change => change)
							.map(change => ({
								type: change === user.lastLogin ? 'New Login' :
									`Two-Factor ${user.isTwoFAEnabled ? "Enabled" : "Disabled"}`,
								date: parseISO(change!),
								text: change === user.lastLogin ? 'Logged in from a new device' :
									`Two-factor Auth was ${user.isTwoFAEnabled ? 'Enabled' : 'Disabled'}`
							}))
							.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())
							.map(change => (
								<div className="flex items-center justify-between" key={change.text}>
									<div>
										<p className="text-sm font-medium">{change.type}</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{change.text}
										</p>
									</div>
									<div className="text-sm text-gray-500 dark:text-gray-400">
										{formatDistanceToNow(change.date, { addSuffix: true })}
									</div>
								</div>
							))
						}
					</CardContent>
				</Card>
			</div>
			<Card className="mt-7">
				<CardHeader>
					<CardTitle>Change Logs</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4">
					{[user.passwordChanged, user.usernameChanged, user.emailChanged]
						.filter(change => change)
						.map(change => ({
							type: change === user.passwordChanged ? 'Password Changed' :
								change === user.usernameChanged ? 'Username Changed' :
									'Email Changed',
							date: parseISO(change!),
							text: change === user.passwordChanged ? 'Your account Password has been changed' :
								change === user.usernameChanged ? 'Your account Username has been changed' :
									'Your account Email has been changed'
						}))
						.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())
						.map(change => (
							<div className="flex items-center justify-between" key={change.text}>
								<div>
									<p className="text-sm font-medium">{change.type}</p>
									<p className="text-sm text-gray-500 dark:text-gray-400">
										{change.text}
									</p>
								</div>
								<div className="text-sm text-gray-500 dark:text-gray-400">
									{formatDistanceToNow(change.date, { addSuffix: true })}
								</div>
							</div>
						))}
				</CardContent>
			</Card>
		</>
	)
}