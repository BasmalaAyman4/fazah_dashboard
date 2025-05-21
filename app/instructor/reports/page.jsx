"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  CalendarCheck,
  CalendarX,
  UserPlus,
  UserMinus,
  Users,
  UserCheck,
  UserX,
  ArrowRightLeft,
} from "lucide-react";
import { DailyStatsTable } from "@/components/daily-stats-table";
import { ReportsFilters } from "@/components/reports-filters";

export default function InstructorReports() {
  const [reportData, setReportData] = useState(null);
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    instructorId: "all",
    sport: "all",
    showOnlyCompleted: false,
    showOnlyPrivateCompleted: false,
    showOnlyCanceled: false,
    showOnlyPrivateCanceled: false,
    showOnlyDelegated: false,
    showOnlyReceived: false,
    showOnlyPrivateDelegated: false,
    showOnlyPrivateReceived: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          startDate.setUTCHours(0, 0, 0, 0);
          queryParams.append("startDate", startDate.toISOString());
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setUTCHours(23, 59, 59, 999);
          queryParams.append("endDate", endDate.toISOString());
        }
        if (filters.instructorId !== "all")
          queryParams.append("instructorId", filters.instructorId);
        if (filters.sport !== "all") queryParams.append("sport", filters.sport);
        if (filters.showOnlyCompleted)
          queryParams.append("showOnlyCompleted", "true");
        if (filters.showOnlyPrivateCompleted)
          queryParams.append("showOnlyPrivateCompleted", "true");
        if (filters.showOnlyCanceled)
          queryParams.append("showOnlyCanceled", "true");
        if (filters.showOnlyPrivateCanceled)
          queryParams.append("showOnlyPrivateCanceled", "true");
        if (filters.showOnlyDelegated)
          queryParams.append("showOnlyDelegated", "true");
        if (filters.showOnlyReceived)
          queryParams.append("showOnlyReceived", "true");
        if (filters.showOnlyPrivateDelegated)
          queryParams.append("showOnlyPrivateDelegated", "true");
        if (filters.showOnlyPrivateReceived)
          queryParams.append("showOnlyPrivateReceived", "true");

        const [reportResponse, dailyStatsResponse] = await Promise.all([
          fetch(`/api/instructors/me/reports?${queryParams.toString()}`),
          fetch(`/api/instructors/me/daily-stats?${queryParams.toString()}`),
        ]);

        if (!reportResponse.ok || !dailyStatsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [reportData, dailyStatsData] = await Promise.all([
          reportResponse.json(),
          dailyStatsResponse.json(),
        ]);

        setReportData(reportData);
        setDailyStats(dailyStatsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل البيانات",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, toast]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">التقارير</h1>
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="flex-1 space-y-6 p-6">
        <h1 className="text-3xl font-bold">التقارير</h1>
        <p className="text-muted-foreground">إحصائيات الجلسات والأنشطة</p>
        <ReportsFilters
          instructors={[]} // You might want to fetch instructors list if needed
          onFilterChange={handleFilterChange}
          initialFilters={filters}
          isInstructor
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Completed Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات المكتملة
              </CardTitle>
              <CalendarCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.completedSessions || 3}
              </div>
            </CardContent>
          </Card>

          {/* Completed Private Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات الخاصة المكتملة
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.completedPrivateSessions}
              </div>
            </CardContent>
          </Card>

          {/* Canceled Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات الملغاة
              </CardTitle>
              <CalendarX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.canceledSessions}
              </div>
            </CardContent>
          </Card>

          {/* Canceled Private Sessions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات الخاصة الملغاة
              </CardTitle>
              <UserX className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.canceledPrivateSessions}
              </div>
            </CardContent>
          </Card>

          {/* Delegated To Others */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الجلسات ⬆️</CardTitle>
              <UserMinus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.delegatedToOthers}
              </div>
            </CardContent>
          </Card>

          {/* Delegated From Others */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">الجلسات ⬇️</CardTitle>
              <UserPlus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.delegatedFromOthers}
              </div>
            </CardContent>
          </Card>

          {/* Private Delegated To Others */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات الخاصة ⬆️
              </CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.privateDelegatedToOthers}
              </div>
            </CardContent>
          </Card>

          {/* Private Delegated From Others */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات الخاصة ⬇️
              </CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.privateDelegatedFromOthers}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Statistics Table */}
        <DailyStatsTable data={dailyStats} />
      </div>
    </div>
  );
}
