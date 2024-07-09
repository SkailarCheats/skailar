'use client'

import { useState, useEffect } from 'react'
import { Key } from 'lucide-react'
import { DataCard } from './data-card'

export const LicensesDataCard = () => {
	const [licenseCount, setLicenseCount] = useState<number | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchLicenses = async () => {
			try {
				setIsLoading(true)
				const response = await fetch('https://api.skailar.com/api/seller/?sellerkey=d9f4c224a6835b0fb6ee68a46ee2d37a&type=fetchallkeys&format=json')
				if (!response.ok) {
					throw new Error('Failed to fetch licenses')
				}
				const data = await response.json()
				setLicenseCount(data.keys.length)
			} catch (error) {
				console.error('Error fetching licenses:', error)
				setError('Failed to load licenses')
			} finally {
				setIsLoading(false)
			}
		}

		fetchLicenses()
	}, [])

	let displayValue: string | number = '0'
	if (!isLoading) {
		if (error) {
			displayValue = 'Error'
		} else if (licenseCount !== null) {
			displayValue = licenseCount
		}
	}

	return (
		<DataCard
			title="License Keys"
			value={displayValue}
			Icon={Key}
		/>
	)
}