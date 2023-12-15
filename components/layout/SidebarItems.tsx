import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { FC } from "react";
import { cn } from "@/lib/utils";

interface ISidebarItemsProps {
	isOpen: boolean;
}

export const SidebarItems: FC<ISidebarItemsProps> = ({ isOpen }) => {
	return (
		<Link
			key="Wallets"
			href="/"
			className="items-center relative whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 group flex h-12 justify-start gap-x-3"
		>
			<LayoutDashboard className="h-5 w-5" />
			<span
				className={cn(
					"absolute left-12 text-base duration-1000",
					!isOpen &&
						"text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
				)}
			>
				Wallets
			</span>
		</Link>
	);
};
