"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Dumbbell, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentSchedules } from "@/components/recent-schedules";
import { DashboardHeader } from "@/components/dashboard-header";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function DashboardPage() {
  return (
    <SessionProvider>
      <div className="flex flex-col relative">
        <DashboardHeader
          title="لوحة التحكم"
          description="نظرة عامة على الأنشطة الرياضية والجداول."
        />
        <div className="w-screen h-screen top-0 left-0 bg-white opacity-90 z-10 absolute flex items-center justify-center">
          <h1 className="text-black text-6xl mr-64 " dir="ltr">
            Coming soon!
          </h1>
        </div>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 relative">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  إجمالي الرياضات
                </CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 عن الشهر الماضي
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  الجلسات الأسبوعية
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48</div>
                <p className="text-xs text-muted-foreground">
                  +8 عن الأسبوع الماضي
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  المدربين النشطين
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +4 عن الشهر الماضي
                </p>
              </CardContent>
            </Card>
          </div>
          <Tabs defaultValue="recent" className="space-y-4">
            <TabsList>
              <TabsTrigger value="recent">الجداول الحديثة</TabsTrigger>
              <TabsTrigger value="upcoming">الجلسات القادمة</TabsTrigger>
            </TabsList>
            <TabsContent value="recent" className="space-y-4">
              <RecentSchedules />
            </TabsContent>
            <TabsContent value="upcoming" className="space-y-4">
              <RecentSchedules />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SessionProvider>
  );
}
