'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { SearchIcon } from 'lucide-react';

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

	if (pathname.includes('/dashboard/licenses')) {
		return (
			<div>
				<div className='relative'>
					<h1 className='font-bold text-xl'>License Keys</h1>
				</div>
			</div>
		)
	}

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
