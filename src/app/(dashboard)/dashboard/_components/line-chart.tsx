'use client';

import {
	Line,
	LineChart,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
} from 'recharts';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const italianMonthsToEnglish: { [key: string]: string } = {
	'gen': 'January',
	'feb': 'February',
	'mar': 'March',
	'apr': 'April',
	'mag': 'May',
	'giu': 'June',
	'lug': 'July',
	'ago': 'August',
	'set': 'September',
	'ott': 'October',
	'nov': 'November',
	'dic': 'December'
};

export const LineCharts = ({ data }: { data: object[] }) => {
	return (
		<TooltipProvider>
			<div className="question mt-2">
				<div className="question-container">
					<ResponsiveContainer>
						<LineChart
							data={data}
							margin={{ right: 30 }}
						>
							<Line type='monotone' dataKey='revenue' stroke='#8c04ba' />
							<RechartsTooltip content={({ active, payload }) => {
								if (active && payload && payload.length) {
									const value = payload[0].value;
									const monthAbbrev = payload[0].payload.name;
									const month = italianMonthsToEnglish.hasOwnProperty(monthAbbrev) ? italianMonthsToEnglish[monthAbbrev] : '';

									return (
										<Tooltip>
											<TooltipTrigger>
												<div className="custom-tooltip">
													<div>Date: {month}</div>
													<div>Revenue: ${value}</div>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<div>Date: {month}</div>
												<div>Revenue: ${value}</div>
											</TooltipContent>
										</Tooltip>
									);
								}
								return null;
							}} />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</TooltipProvider>
	);
}
