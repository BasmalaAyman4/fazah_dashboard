"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Calendar,
  Dumbbell,
  Home,
  Settings,
  User,
  Users,
  Package,
  BookOpen,
  Clock,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardSidebar() {
  const pathname = usePathname();
  const session = useSession();

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <Sidebar className="border-l">
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold mt-2 text-xl text-primary"
        >
          <span>Fazah</span>
        </Link>
        <SidebarTrigger className="ml-auto md:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-5 space-y-3">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
              <Link href="/dashboard">
                <Home className="h-4 w-4" />
                <span className="text-lg">لوحة التحكم</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard/sports")}>
              <Link href="/dashboard/sports">
                <Dumbbell className="h-4 w-4" />
                <span className="text-lg">النشاطات</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard/instructors")}
            >
              <Link href="/dashboard/instructors">
                <Users className="h-4 w-4" />
                <span className="text-lg">المدربين</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard/specialists2")}
            >
              <Link href="/dashboard/specialists2">
                <Users className="h-4 w-4" />
                <span className="text-lg">المتخصصين</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard/schedules")}
            >
              <Link href="/dashboard/schedules">
                <Calendar className="h-4 w-4" />
                <span className="text-lg">الجدول الاسبوعي</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard/packages")}
            >
              <Link href="/dashboard/packages">
                <Package className="h-4 w-4" />
                <span className="text-lg">الباقات</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard/special-programs")}
            >
              <Link href="/dashboard/special-programs">
                <BookOpen className="h-4 w-4" />
                <span className="text-lg">البرامج الخاصة</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard/workshops")}
            >
              <Link href="/dashboard/workshops">
                <Clock className="h-4 w-4" />
                <span className="text-lg">ورش العمل</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard/reports")}
            >
              <Link href="/dashboard/reports">
                <BarChart3 className="h-4 w-4" />
                <span className="text-lg">التقارير</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/dashboard/clients")}
            >
              <Link href="/dashboard/clients">
              <Users className="h-4 w-4" />
                <span className="text-lg">العملاء</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2">
              <Avatar className="h-6 w-6 ml-2">
                <AvatarImage src="/placeholder-user.jpg" alt="المستخدم" />
                <AvatarFallback>م</AvatarFallback>
              </Avatar>
              <span>{session?.data?.user?.name || "المدير"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="ml-2 h-4 w-4" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="ml-2 h-4 w-4" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
