import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { SidebarItems } from "@/components/layout/SidebarItems";

interface SidebarProps {
	className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
	const [isOpen, setOpen] = useState(true);
	const [switchState, setSwitchState] = useState(false);

	const handleToggle = () => {
		setSwitchState(true);
		setOpen((prev) => !prev);
		setTimeout(() => setSwitchState(false), 500);
	};

	return (
		<nav
			className={cn(
				`relative hidden h-screen border-r pt-16 md:block`,
				switchState && "duration-500",
				isOpen ? "w-48" : "w-[78px]",
				className
			)}
		>
			<div className="space-y-4 py-0">
				<div className="px-3 py-2">
					<div className="mt-3 space-y-1">
						<SidebarItems isOpen={isOpen} />
					</div>
				</div>
			</div>
			<div className="mt-30 absolute bottom-5 w-full space-y-2 px-3">
				<Separator />
				<Button
					onClick={handleToggle}
					className={cn("h-10 w-full bg-foreground", isOpen && "rotate-180")}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</nav>
	);
};
