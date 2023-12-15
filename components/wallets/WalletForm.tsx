"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FC } from "react";

interface IWalletForm {
	reload: () => void;
}

export const WalletForm: FC<IWalletForm> = ({ reload }) => {
	const formSchema = z.object({
		address: z
			.string()
			.length(42, {
				message: "Address must have 42 characters.",
			})
			.regex(/^0x/, {
				message: "Please input a correct ethereum address.",
			}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			address: "",
		},
	});

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		fetch(`${process.env.NEXT_PUBLIC_API}/wallet`, {
			method: "POST",
			body: JSON.stringify(values),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data) {
					form.reset();
				}
			})
			.finally(() => {
				reload();
			});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex items-center space-x-2"
			>
				<FormField
					control={form.control}
					name="address"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormControl>
								<Input placeholder="Input your wallet address..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					className={cn(form.formState.errors.address && "!mb-7")}
					type="submit"
					size="sm"
				>
					ADD
				</Button>
			</form>
		</Form>
	);
};
