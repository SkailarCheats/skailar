"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/payload-types";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getPayloadClient } from '@/get-payload';

export const DeleteUser = ({ user }: { user: User }) => {
	const [confirmInput, setConfirmInput] = useState('');
	const [isDeleting, setIsDeleting] = useState(false);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmInput(e.target.value);
	};

	const isInputValid = confirmInput === user.username;
	const isDeleteDisabled = !isInputValid || isDeleting;

	const router = useRouter();

	const handleDelete = async () => {
		setIsDeleting(true);
		let apiUrl;

		if (user.role === 'reseller') {
			apiUrl = `https://api.skailar.com/api/seller/?sellerkey=d9f4c224a6835b0fb6ee68a46ee2d37a&type=deleteAccount&user=${user.username}`;
		} else {
			apiUrl = `https://api.skailar.com/api/seller/?sellerkey=d9f4c224a6835b0fb6ee68a46ee2d37a&type=deluser&user=${user.username}`;
		}

		try {
			const externalResponse = await fetch(apiUrl);
			if (!externalResponse.ok) {
				throw new Error('Failed to delete user from external API');
			}

			const internalResponse = await fetch(`/api/users/${user.id}`, {
				method: 'DELETE',
			});

			if (!internalResponse.ok) {
				throw new Error('Failed to delete user');
			}

			toast.success(`User ${user.username} deleted successfully`);
			router.refresh();
			router.push('/login');
		} catch (error) {
			toast.error('Error deleting user');
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Delete Account</CardTitle>
				<CardDescription>Deleting your account is a permanent action and cannot be undone.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-4">
					<p>
						Deleting your account will permanently remove all your data, including your profile, orders, and any
						other information associated with your account. This action cannot be undone.
					</p>
					<div className="grid gap-2">
						<Label htmlFor="confirm-delete">To confirm, please type &quot;{user.username}&quot; in the input below:</Label>
						<Input id="confirm-delete" className='mt-5' autoComplete='off' placeholder={`${user.username}`} value={confirmInput} onChange={handleInputChange} />
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-end gap-2">
				<Button variant="destructive" onClick={handleDelete} disabled={isDeleteDisabled}>
					{isDeleting ? 'Deleting...' : 'Delete Account'}
				</Button>
			</CardFooter>
		</Card>
	)
};
