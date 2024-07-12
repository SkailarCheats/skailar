"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/payload-types';
import Image from 'next/image';
import React, { useState } from 'react';

const UpdateAvatarForm: React.FC<{ user: User }> = ({ user }) => {
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setAvatarFile(file);
			setAvatarPreview(URL.createObjectURL(file));
		}
	};

	return (
		<form>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="avatar">Avatar</Label>
					<div className="flex items-center gap-4">
						{avatarPreview ? (
							<Image
								src={avatarPreview}
								alt="Avatar Preview"
								className="h-20 w-20 rounded-full object-cover"
								width='80'
								height='80'
							/>
						) : (
							<Avatar className="h-20 w-20">
								<AvatarImage src={`${avatarFile ? avatarFile : 'https://cdn.skailar.com/v1/assets/img/placeholder.png?width=453&height=453'}`} />
								<AvatarFallback>
									{user.username ? user.username[0].toUpperCase() : ''}
								</AvatarFallback>
							</Avatar>
						)}
						<Input id="avatar" type="file" accept="image/*" onChange={handleAvatarUpload} />
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button type='submit' className="ml-auto" disabled={!avatarFile || true}>Save</Button>
			</CardFooter>
		</form>
	);
};

export default UpdateAvatarForm;
