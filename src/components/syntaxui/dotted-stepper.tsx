import { motion } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'

interface FieldProps {
	name: string
	type: string
	placeholder: string
}

interface StepProps {
	label: string
	fields?: FieldProps[]
}

const steps: StepProps[] = [
	{ label: 'Download' },
	{ label: 'Login' },
	{ label: 'Inject' },
]

const StepIndicator: React.FC<{
	currentStep: number
	steps: StepProps[]
}> = ({ currentStep, steps }) => (
	<div className="relative w-full">
		<div className="flex items-center justify-between">
			{steps.map((step, index) => (
				<React.Fragment key={step.label}>
					<div className="flex flex-col items-center">
						<motion.div
							className={`z-10 flex h-8 w-8 items-center justify-center rounded-full ${index <= currentStep
								? 'bg-primary text-white'
								: 'bg-gray-200 text-white dark:bg-gray-800 dark:text-gray-600'
								}`}
							animate={{ scale: 1.02 }}
						>
							{index < currentStep ? (
								<CheckCircle size={17} />
							) : (
								<Circle size={17} fill="currentColor" />
							)}
						</motion.div>
					</div>
					{index < steps.length - 1 && (
						<div className="relative flex-grow">
							<div className="absolute -top-1 h-1.5 w-full bg-gray-100 dark:bg-gray-800" />
							<motion.div
								className="absolute -top-1 h-1.5 w-full bg-primary"
								initial={{ width: '0%' }}
								animate={{
									width: index < currentStep ? '100%' : '0%',
								}}
								transition={{ duration: 0.5, ease: 'easeInOut' }}
							/>
						</div>
					)}
				</React.Fragment>
			))}
		</div>
	</div>
)

const StepContent: React.FC<{ step: StepProps }> = ({ step }) => {
	return (
		<motion.div
			className="my-8 flex min-h-[40vh] w-full flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<motion.h2
				className="mb-4 text-3xl font-bold text-gray-800 dark:text-white"
				initial={{ scale: 0.9 }}
				animate={{ scale: 1 }}
				transition={{ delay: 0.2, duration: 0.3 }}
			>
				{step.label}
			</motion.h2>
			<motion.p
				className="text-lg text-gray-600 dark:text-gray-300"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4, duration: 0.5 }}
			>
				{getStepDescription(step.label)}
			</motion.p>
		</motion.div>
	);
};

const getStepDescription = (label: string): string => {
	switch (label) {
		case 'Download':
			return 'Get started by downloading Loader app from the official store.';
		case 'Login':
			return 'Create an account or sign in to access all features.';
		case 'Inject':
			return 'Customize your experience with our powerful injection system.';
		case 'Dominate':
			return 'Take control and achieve your goals with our advanced tools.';
		default:
			return 'Complete this step to move forward in the process.';
	}
};

const ButtonClasses =
	'rounded-2xl bg-primary px-2 py-1 text-sm font-medium text-white'

const NavigationButtons: React.FC<{
	currentStep: number
	totalSteps: number
	handlePrev: () => void
	handleNext: () => void
}> = ({ currentStep, totalSteps, handlePrev, handleNext }) => (
	<div className="flex justify-end gap-3">
		{currentStep === 0 ? null : (
			<Button onClick={handlePrev} variant='outline'>
				Previous
			</Button>
		)}
		{currentStep === totalSteps - 1 ? null : (
			<Button onClick={handleNext} variant='outline'>
				Next
			</Button>
		)}
	</div>
)

export const Stepper: React.FC = () => {
	const [currentStep, setCurrentStep] = useState(0) // Initialize to 0 to start at the first step

	const handleNext = () => {
		setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
	}

	const handlePrev = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0))
	}

	return (
		<div className="mx-auto w-full max-w-screen-xl px-2.5 md:px-20">
			<StepIndicator currentStep={currentStep} steps={steps} />
			<StepContent step={steps[currentStep]} />
			<NavigationButtons
				currentStep={currentStep}
				totalSteps={steps.length}
				handlePrev={handlePrev}
				handleNext={handleNext}
			/>
		</div>
	)
}

export default Stepper
