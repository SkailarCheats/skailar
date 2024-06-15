'use client';

import {
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip as RechartsTooltip,
} from 'recharts';

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"

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
									return (
										<Tooltip>
											<TooltipTrigger>
												<div>Revenue: ${value}</div>
											</TooltipTrigger>
											<TooltipContent>
												Revenue: ${value}
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
