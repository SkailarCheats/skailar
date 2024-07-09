import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export const DataCard = ({ title, value, Icon }: { title: string, value: number | string, Icon: LucideIcon }) => (
	<Card>
		<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
			<CardTitle className="text-sm font-medium">{title}</CardTitle>
			<Icon className="h-4 w-4 text-muted-foreground" />
		</CardHeader>
		<CardContent>
			<div className="text-2xl font-bold text-purple-600">{value}</div>
		</CardContent>
	</Card>
);