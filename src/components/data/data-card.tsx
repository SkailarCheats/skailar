import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const DataCard = ({ title, value, Icon }: { title: string, value: number | string, Icon: LucideIcon }) => (
	<Card>
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
			<Icon className="h-5 w-5 text-[#8c04ba]" />
		</CardHeader>
		<CardContent>
			<div className="text-2xl font-bold text-purple-600">{value}</div>
		</CardContent>
	</Card>
);