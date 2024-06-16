import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "@/payload-types"
import UpdatePasswordForm from "./forms/update-pass-form"
import UpdateUserForm from "./forms/update-user-form"

interface PersonalInfosProps {
	user: User
}

export const PersonalInfos = ({ user }: PersonalInfosProps) => {
	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Personal Information</CardTitle>
					<CardDescription>Update your personal details, such as name, email</CardDescription>
				</CardHeader>
				<UpdateUserForm user={user} />
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Security Settings</CardTitle>
					<CardDescription>
						Manage your account security, including password and two-factor authentication.
					</CardDescription>
				</CardHeader>
				<UpdatePasswordForm userId={user.id!} />
			</Card>
		</div>
	)
}