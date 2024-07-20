"use client"

import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Announcement = () => {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		const isDismissed = localStorage.getItem('announcementDismissed')

		if (isDismissed) setIsVisible(false)
	}, [])

	const handleDismiss = () => {
		localStorage.setItem('announcementDismissed', 'true');
		setIsVisible(false)
	}

	const text = '🎉 Register on Skailar and get 50% off when it officially launches 🎉'

	return (
		<>
			<div
				className={`absolute left-0 right-0 top-0 z-50 transition-all duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
					}`}
			>
				<div className="flex w-full items-center gap-x-6 bg-primary px-6 py-3 sm:px-3.5 sm:before:flex-1">
					<div className="flex items-center text-sm font-medium leading-6 text-white">
						<p>{text.toUpperCase()}</p>
					</div>
					<div className="flex flex-1 justify-end">
						<button
							type="button"
							onClick={handleDismiss}
							aria-label="Dismiss"
						>
							<X className="h-5 w-5 text-white" />
						</button>
					</div>
				</div>
			</div>
			{isVisible && <div className="h-[52px]" />}
		</>
	)
}