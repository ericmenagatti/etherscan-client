"use client";
import * as z from "zod";
import { FC, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	AlertTriangle,
	ArrowRightLeft,
	Settings2,
	Check,
	X,
	Star,
} from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface IWallet {
	address: string;
	display_name: string;
	favorite: boolean;
	balance: string;
	creation_date: string;
	status: any;
}

export const Wallet: FC<IWallet> = ({
	address,
	display_name,
	favorite,
	balance,
	creation_date,
	status,
}) => {
	const [isFavorite, setIsFavorite] = useState(favorite);
	const [displayName, setDisplayName] = useState(display_name);
	const [displayNameToggle, setDisplayNameToggle] = useState(true);
	const [onEdit, setOnEdit] = useState(false);
	const [currency, setCurrency] = useState("usd");

	const formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency.toUpperCase(),
		minimumFractionDigits: 2,
		maximumFractionDigits: 8,
	});

	const oldWallet = useMemo(() => {
		const now = Math.floor(new Date().getTime() / 1000);
		return now - +creation_date > 31_556_952;
	}, [creation_date]);

	const formSchema = z.object({
		displayName: z.string().max(42, {
			message: "Name can not surpass 42 characters.",
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			displayName: display_name,
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		fetch(`${process.env.NEXT_PUBLIC_API}/wallet/${address}`, {
			method: "PATCH",
			body: JSON.stringify({
				display_name: values.displayName,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data) {
					setDisplayName(values.displayName);
				}
			});
	};

	const handleConfirm = () => {
		form.handleSubmit(onSubmit)();
		setOnEdit(false);
	};

	const toggleOnEdit = () => {
		setOnEdit((prev) => !prev);
	};

	const toggleDisplayedName = () => {
		setDisplayNameToggle((prev) => !prev);
	};

	const toggleFavorite = () => {
		fetch(`${process.env.NEXT_PUBLIC_API}/wallet/${address}`, {
			method: "PATCH",
			body: JSON.stringify({
				favorite: !isFavorite,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data) {
					setIsFavorite((prev) => !prev);
				}
			});
	};

	const handleCurrencyChange = (value: string) => {
		setCurrency(value);
	};

	return (
		<div className="mb-10">
			{oldWallet ? (
				<Alert className="flex p-2" variant="destructive">
					<AlertTriangle className="h-5 w-5 !top-auto" />
					<AlertTitle className="ml-2">Wallet is old!</AlertTitle>
				</Alert>
			) : null}
			<div
				className="grid gap-4 min-[1201px]:grid-flow-col min-[1201px]:grid-cols-[1fr_0.5fr]
        max-[1200px]:grid-rows-2 max-[1200px]:grid-flow-row my-2"
			>
				<Card className="flex flex-col p-2 overflow-auto">
					<div className="flex justify-end">
						{!onEdit ? (
							<div className="flex gap-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												onClick={toggleFavorite}
											>
												<Star
													className={cn(
														"h-5 w-5",
														isFavorite ? "fill-inherit" : ""
													)}
												/>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Add to Favorites</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								{displayName ? (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="outline"
													size="icon"
													onClick={toggleDisplayedName}
												>
													<ArrowRightLeft className="h-5 w-5" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Swap display name</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								) : null}
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												onClick={toggleOnEdit}
											>
												<Settings2 className="h-5 w-5" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Edit</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						) : (
							<div className="flex gap-2">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												onClick={handleConfirm}
											>
												<Check className="h-5 w-5" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Confirm</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												onClick={toggleOnEdit}
											>
												<X className="h-5 w-5" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>Cancel</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						)}
					</div>
					<div className="flex items-center gap-4">
						{!onEdit ? (
							<div className="flex text-ellipsis w-full mt-2">
								{displayNameToggle && displayName !== ""
									? displayName
									: address}
							</div>
						) : (
							<Form {...form}>
								<form className="flex items-center w-full mt-2">
									<FormField
										control={form.control}
										name="displayName"
										render={({ field }) => (
											<FormItem className="w-full">
												<FormControl>
													<Input
														placeholder="Input your display name"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</form>
							</Form>
						)}
					</div>
					<div className="flex items-center gap-4">
						<div className="flex w-full mt-2">{balance} ETH</div>
					</div>
				</Card>
				<Card className="flex flex-col p-2">
					<div className="flex justify-end">
						<Select
							onValueChange={(d) => handleCurrencyChange(d)}
							value={currency}
						>
							<SelectTrigger className="w-[130px]">
								<SelectValue placeholder="USD" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="usd">USD</SelectItem>
									<SelectItem value="eur">EUR</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-1">
						{currency === "usd"
							? formatter.format(+balance * status.eth_usd)
							: formatter.format(+balance * status.eth_eur)}
					</div>
				</Card>
			</div>
		</div>
	);
};
