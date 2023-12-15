"use client";
import { useMemo, useEffect, useState } from "react";
import { WalletForm } from "@/components/wallets/WalletForm";
import { Euro, DollarSign } from "lucide-react";
import { Wallet } from "@/components/wallets/Wallet";
import { IStatus } from "@/types/Status";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { IWallet } from "@/types/Wallet";

const HomePage = () => {
	const [wallets, setWallets] = useState<IWallet[]>();
	const [sort, setSort] = useState("asc");
	const [status, setStatus] = useState<IStatus>();
	const [loading, setLoading] = useState(true);
	const [reload, setReload] = useState(0);

	const formatter = new Intl.NumberFormat("en-US", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 3,
	});

	const sortedWallets = useMemo(() => {
		if (wallets) {
			const sortedData: IWallet[] = wallets!.sort((a: any, b: any) => {
				if (sort === "asc") {
					return b.favorite - a.favorite;
				}
				return a.favorite - b.favorite;
			});
			return sortedData;
		}
	}, [sort, wallets]);

	useEffect(() => {
		loadWallets();
		loadStatus();
		refreshWallets();
		refreshStatus();
	}, [reload, sort]);

	const loadWallets = () => {
		setLoading(true);
		fetch(`${process.env.NEXT_PUBLIC_API}/wallet`)
			.then((response) => response.json())
			.then((data) => {
				setWallets(data);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const loadStatus = () => {
		setLoading(true);
		fetch(`${process.env.NEXT_PUBLIC_API}/status`)
			.then((response) => response.json())
			.then((data) => {
				setStatus(data);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const refreshWallets = () => {
		fetch(`${process.env.NEXT_PUBLIC_API}/wallet`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		}).finally(() => {
			setLoading(false);
		});
	};

	const refreshStatus = () => {
		fetch(`${process.env.NEXT_PUBLIC_API}/status`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		}).finally(() => {
			setLoading(false);
		});
	};

	const reloadTrigger = () => {
		setReload(reload + 1);
	};

	if (loading) {
		return (
			<main className="flex flex-col h-full p-4">
				<div className="text-xl font-semibold px-4 py-3 mb-4 rounded border">
					Loading...
				</div>
			</main>
		);
	}

	return (
		<main className="flex flex-col h-full p-4">
			<div className="text-xl font-semibold px-4 py-3 mb-4 rounded border">
				<WalletForm reload={reloadTrigger} />
			</div>
			<div className="flex flex-row max-[700px]:flex-col place-content-between items-center text-xl font-semibold px-4 py-3 mb-4 rounded border">
				<div className="flex">Wallet List</div>
				{status ? (
					<div className="flex items-center">
						<DollarSign className="h-5 w-5" />
						{formatter.format(+status.eth_usd)} /
						<Euro className="h-5 w-5" />
						{formatter.format(+status.eth_eur)}
					</div>
				) : null}
				<div className="flex justify-end">
					<Select onValueChange={(d) => setSort(d)} value={sort}>
						<SelectTrigger className="w-[130px]">
							<SelectValue placeholder="Select sort" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem value="asc">ASC</SelectItem>
								<SelectItem value="desc">DESC</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>
			<div className="text-xl font-semibold px-4 py-3 mb-4 rounded border">
				{status &&
					sortedWallets?.map((wallet) => (
						<Wallet key={wallet._id} {...wallet} status={status} />
					))}
			</div>
		</main>
	);
};

export default HomePage;
