"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader({ title, description, action }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 md:py-6 border-b">
      <div className="grid gap-1">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-semibold text-lg md:text-2xl">{title}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button asChild>
          <Link href={action.href}>
            <Plus className="mr-2 h-4 w-4" />
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
}
