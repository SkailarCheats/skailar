import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User } from "@/payload-types"; // Assumendo che UserDetails sia il tipo degli oggetti in user.details
import { formatDistanceToNow, parseISO } from "date-fns";
import { ToggleTwoFAForm } from "./forms/toggle-twofa-form";
import { LoginLogs } from "./login-logs";

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
								<p className="text-sm font-medium">Last Login</p>
								<p className="text-sm text-muted-foreground">
									Last login: {formatDistanceToNow(parseISO(user.lastLogin!), { addSuffix: true })}
								</p>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">Two-Factor Auth</p>
								<p className={cn("text-sm font-semibold", user.isTwoFAEnabled ? 'text-green-500' : 'text-red-500')}>
									{user.isTwoFAEnabled ? 'Enabled' : 'Disabled'}
								</p>
							</div>
						</div>
						{user.details !== undefined && user.details?.length! > 0 && (
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium">{user.details?.length === 1 ? 'Device' : 'Devices'}</p>
									<p className="text-sm text-muted-foreground">
										{user.details?.length} {user.details?.length === 1 ? 'device' : 'devices'} connected
									</p>
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
						{[user.passwordChanged, user.usernameChanged, user.emailChanged, user.twoFAToggled]
							.filter(change => change)
							.map(change => ({
								type: change === user.passwordChanged ? 'Password Changed' :
									change === user.usernameChanged ? 'Username Changed' :
										change === user.twoFAToggled ? `Two Factor Auth ${user.isTwoFAEnabled ? 'Enabled' : 'Disabled'}` :
											'Email Changed',
								date: parseISO(change!),
								text: change === user.passwordChanged ? 'Your Password has been changed' :
									change === user.usernameChanged ? 'Your Username has been changed' :
										change === user.twoFAToggled ? `Your 2FA has been ${user.isTwoFAEnabled ? 'Enabled' : 'Disabled'}` :
											'Your Email has been changed'
							}))
							.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())
							.map(change => (
								<div className="flex items-center justify-between" key={change.text}>
									<div>
										<p className="text-sm font-medium">{change.type}</p>
										<p className="text-sm text-muted-foreground">
											{change.text}
										</p>
									</div>
									<div className="text-sm text-muted-foreground">
										{formatDistanceToNow(change.date, { addSuffix: true })}
									</div>
								</div>
							))}
					</CardContent>
				</Card>
			</div>
			<Card className="mt-7">
				<CardHeader>
					<CardTitle>Change Logs</CardTitle>
				</CardHeader>
				<LoginLogs user={user} />
			</Card>
		</>
	)
}

export default Security;
