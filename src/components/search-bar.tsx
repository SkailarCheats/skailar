'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";

export function SearchBar() {
	const router = useRouter();
	const pathname = usePathname();
	const [query, setQuery] = useState('');
	const [placeholder, setPlaceholder] = useState('Search...');

	useEffect(() => {
		if (pathname.includes('/dashboard/orders')) {
			setPlaceholder('Search order...');
		} else if (pathname.includes('/dashboard/products')) {
			setPlaceholder('Search product...');
		} else {
			setPlaceholder('Search...');
		}
	}, [pathname]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (pathname.includes('/dashboard/orders')) {
			if (query === "") {
				router.push(`/dashboard/orders`);
			} else {
				router.push(`/dashboard/orders?search=${query}`);
			}
		} else if (pathname.includes('/dashboard/products')) {
			if (query === "") {
				router.push(`/dashboard/products`);
			} else {
				router.push(`/dashboard/products?search=${query}`);
			}
		}
	};

	return (
		<form onSubmit={handleSearch}>
			<div className="relative">
				<SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					type="search"
					placeholder={placeholder}
					autoComplete="off"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
				/>
			</div>
		</form>
	);
}

function SearchIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<path d="m21 21-4.3-4.3" />
		</svg>
	);
}