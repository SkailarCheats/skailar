"use client";

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/trpc/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface User {
	id: string;
	username: string;
	email: string;
}

interface FormData {
	username?: string;
	email?: string;
}

const UpdateUserForm: React.FC<{ user: User }> = ({ user }) => {
	const { register, handleSubmit } = useForm<FormData>({
		defaultValues: {
			username: user?.username,
			email: user?.email,
		},
	});

	const router = useRouter();

	const updateUserMutation = trpc.auth.updateUser.useMutation();

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		try {
			const { username, email } = data;
			const result = await updateUserMutation.mutateAsync({ id: user.id, newUsername: username, newEmail: email });
			if (result?.success) {
				toast.success('User updated successfully.');
				router.push(`/account/${username}`)
				router.refresh()
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error('An error occurred.')
			} else {
				toast.error('An unknown error occurred.')
			}
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="username">Username</Label>
					<Input id="username" {...register('username')} placeholder="Choose a new Username" autoComplete="off" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input id="email" {...register('email')} placeholder="Enter new email" type="email" />
				</div>
			</CardContent>
			<CardFooter>
				<Button type='submit' className="ml-auto">Update</Button>
			</CardFooter>
		</form>
	);
};

export default UpdateUserForm;
