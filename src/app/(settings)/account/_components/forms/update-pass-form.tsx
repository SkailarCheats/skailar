"use client";

import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdatePasswordMutation } from '@/trpc/client';
import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormData {
	newpassword: string;
	confirmpassword: string;
}

interface Props {
	userId: string;
}

const UpdatePasswordForm: React.FC<Props> = ({ userId }) => {
	const { register, handleSubmit, watch, setError, formState: { errors } } = useForm<FormData>();

	const updatePasswordMutation = useUpdatePasswordMutation();

	const onSubmit: SubmitHandler<FormData> = async (data) => {
		const { newpassword, confirmpassword } = data;

		if (newpassword !== confirmpassword) {
			toast.error('Passwords do not match')
			return;
		}

		try {
			const result = await updatePasswordMutation.mutateAsync({
				id: userId,
				newPassword: newpassword
			});

			if (result.success) {
				toast.success('Password updated successfully.')
			}
		} catch (error: any) {
			toast.error('An error occurred.')
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="newpassword">New Password</Label>
					<Input id="newpassword" {...register('newpassword', { required: 'New password is required' })} placeholder="••••••••" type="password" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="confirmpassword">Confirm New Password</Label>
					<Input id="confirmpassword" {...register('confirmpassword', { required: 'Confirm new password is required' })} placeholder="••••••••" type="password" />
					{errors.confirmpassword && <p>{errors.confirmpassword.message}</p>}
				</div>
			</CardContent>
			<CardFooter>
				<Button type="submit" className="ml-auto">Update</Button>
			</CardFooter>
		</form>
	);
};

export default UpdatePasswordForm;
