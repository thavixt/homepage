import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { getStats, resetStats } from "~/reducers/statsReducer";
import { toast } from "sonner";
import { sortArrayOfObjectsBy } from "~/lib/utils";
import { AlertDialog } from "~/components/dialogs/alertDialog";
import { Fragment } from "react/jsx-runtime";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useTypesafeTranslation } from "~/i18n";
import { Button } from "~/components/ui/button";

export function meta() {
	return [
		{ title: "Homepage - Statistics" },
		{ name: "description", content: "Statistics collected on your home page" },
	];
}

export default function StatsPage() {
	const t = useTypesafeTranslation();
	const stats = useAppSelector(getStats);
	const dispatch = useAppDispatch();
	const [searchValue, setSearchValue] = useState('');
	const sortedStats = sortArrayOfObjectsBy('description', Object.values(stats));
	const filteredStats = sortedStats.filter(stat => stat.description.toLowerCase().includes(searchValue.toLowerCase()));

	const onReset = () => {
		dispatch(resetStats());
		toast.success('All collected stats have been reset');
	}

	return (
		<Card>
			<CardHeader>
				{t('stats.header')}
			</CardHeader>
			<CardContent className="flex flex-col gap-4 w-full px-0">
				<div className="w-full grid grid-cols-[1fr_2fr] px-8">
					<Label htmlFor="stat">{t('stats.searchLabel')}</Label>
					<Input
						type="search"
						name="stat"
						id="stat"
						placeholder={t('common.searchPlaceholder')}
						onChange={(e) => setSearchValue(e.currentTarget.value)}
					/>
				</div>
				<ScrollArea className="h-fit max-h-[350px] w-full px-8">
					<div className="grid grid-cols-[6fr_4fr] lg:grid-cols-[7fr_3fr] gap-y-2 gap-x-4">
						{filteredStats
							.map((stat) => (
								<Fragment key={stat.description}>
									<div title={stat.description} className="truncate">{stat.description}:</div>
									<div>{t('stats.counter', { count: stat.count.toString() })}</div>
								</Fragment>
							))}
					</div>
				</ScrollArea>
			</CardContent>
			<CardFooter>
				<AlertDialog
					trigger={<Button variant="outline" asChild>{t('common.reset')}</Button>}
					onConfirm={onReset}
					title={t('stats.reset.title')}
					description={t('stats.reset.description')}
					confirm={t('stats.reset.confirm')}
				/>
			</CardFooter>
		</Card>
	);
}
