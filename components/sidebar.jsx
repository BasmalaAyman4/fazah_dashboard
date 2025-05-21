"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import {
  Calendar,
  Users,
  Settings,
  LogOut,
  Home,
  Activity,
  BookOpen,
  Award,
  File,
  BarChart,
  User,
} from "lucide-react";

const adminNavItems = [
  {
    title: "الرئيسية",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "الجدول",
    href: "/dashboard/schedules",
    icon: Calendar,
  },
  {
    title: "الرياضات",
    href: "/dashboard/sports",
    icon: Activity,
  },
  {
    title: "الورش",
    href: "/dashboard/workshops",
    icon: BookOpen,
  },
  {
    title: "البرامج الخاصة",
    href: "/dashboard/special-programs",
    icon: Award,
  },
  {
    title: "المستخدمين",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "الإعدادات",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

const instructorNavItems = [
  {
    title: "الرئيسية",
    href: "/instructor",
    icon: Home,
  },
  {
    title: "الجدول",
    href: "/instructor/schedules",
    icon: Calendar,
  },

  {
    title: "التقارير",
    href: "/instructor/reports",
    icon: File,
  },
];

export function Sidebar({ userRole = "admin" }) {
  const pathname = usePathname();
  const navItems = userRole === "admin" ? adminNavItems : instructorNavItems;

  return (
    <div className="flex w-full items-center  border-l bg-background border-b">
      <div className="flex h-14 items-center  px-4">
        <Link href={userRole === "admin" ? "/dashboard" : "/instructor"}>
          <span className="font-bold">لوحة التحكم</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="flex gap-5 items-center px-2 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                pathname === item.href
                  ? "bg-muted text-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </div>
  );
}
