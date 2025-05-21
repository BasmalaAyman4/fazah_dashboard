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
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportsFilters } from "@/components/reports-filters";

export default function DashboardReports() {
  const [reportData, setReportData] = useState(null);
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
        let url = "/api/instructors/reports";
        const params = new URLSearchParams();

        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (filters.instructorId !== "all")
          params.append("instructorId", filters.instructorId);
        if (filters.sport !== "all") params.append("sport", filters.sport);
        if (filters.showOnlyCompleted)
          params.append("showOnlyCompleted", "true");
        if (filters.showOnlyPrivateCompleted)
          params.append("showOnlyPrivateCompleted", "true");
        if (filters.showOnlyCanceled) params.append("showOnlyCanceled", "true");
        if (filters.showOnlyPrivateCanceled)
          params.append("showOnlyPrivateCanceled", "true");
        if (filters.showOnlyDelegated)
          params.append("showOnlyDelegated", "true");
        if (filters.showOnlyReceived) params.append("showOnlyReceived", "true");
        if (filters.showOnlyPrivateDelegated)
          params.append("showOnlyPrivateDelegated", "true");
        if (filters.showOnlyPrivateReceived)
          params.append("showOnlyPrivateReceived", "true");

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setReportData(data);
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
  }, [toast, filters]);

  if (loading) {
    return (
      <div className="space-y-6 container mx-auto px-16 py-8">
        <h1 className="text-3xl font-bold">التقارير</h1>
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex-1 space-y-6 p-8">
        <DashboardHeader title="التقارير" />
        <p className="text-muted-foreground">
          إحصائيات الجلسات والأنشطة لجميع المدربين
        </p>
        <ReportsFilters
          instructors={reportData.instructorStats}
          onFilterChange={setFilters}
          initialFilters={filters}
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
                {reportData.totalStats.completedSessions}
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
                {reportData.totalStats.completedPrivateSessions}
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
                {reportData.totalStats.canceledSessions}
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
                {reportData.totalStats.canceledPrivateSessions}
              </div>
            </CardContent>
          </Card>

          {/* Delegated To Others */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات المفوضة
              </CardTitle>
              <UserMinus className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.totalStats.delegatedToOthers}
              </div>
            </CardContent>
          </Card>

          {/* Private Delegated To Others */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                الجلسات الخاصة المفوضة
              </CardTitle>
              <ArrowRightLeft className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.totalStats.privateDelegatedToOthers}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">إحصائيات المدربين</h2>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="text-sm text-center">
                  <TableHead>الاسم</TableHead>
                  <TableHead>اليوم</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوقت</TableHead>
                  <TableHead className="text-center">جلسة مكتملة </TableHead>
                  <TableHead className="text-center">جلسة مكتملة p</TableHead>
                  <TableHead className="text-center">جلسة ملغاة</TableHead>
                  <TableHead className="text-center">جلسة ملغاة p</TableHead>
                  <TableHead className="text-center">جلسة ⬆️</TableHead>
                  <TableHead className="text-center">جلسة ⬇️</TableHead>
                  <TableHead className="text-center">جلسة ⬆️ p</TableHead>
                  <TableHead className="text-center">جلسة ⬇️ p</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.instructorStats.map((instructor) => (
                  <TableRow key={instructor.instructorId}>
                    <TableCell className="font-medium">
                      {instructor.instructorName}
                    </TableCell>
                    <TableCell>
                      {filters.startDate
                        ? new Date(filters.startDate).toLocaleDateString(
                            "ar-SA",
                            { weekday: "long" }
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {filters.startDate
                        ? new Date(filters.startDate).toLocaleDateString(
                            "ar-SA"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {filters.startDate
                        ? new Date(filters.startDate).toLocaleTimeString(
                            "ar-SA",
                            { hour: "2-digit", minute: "2-digit" }
                          )
                        : "-"}
                    </TableCell>

                    <TableCell>{instructor.completedSessions}</TableCell>
                    <TableCell>{instructor.completedPrivateSessions}</TableCell>
                    <TableCell>{instructor.canceledSessions}</TableCell>
                    <TableCell>{instructor.canceledPrivateSessions}</TableCell>
                    <TableCell>{instructor.delegatedToOthers}</TableCell>
                    <TableCell>{instructor.delegatedFromOthers}</TableCell>
                    <TableCell>{instructor.privateDelegatedToOthers}</TableCell>
                    <TableCell>
                      {instructor.privateDelegatedFromOthers}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
