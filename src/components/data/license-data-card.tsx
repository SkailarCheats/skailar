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
				const response = await fetch('/api/all-licenses')
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