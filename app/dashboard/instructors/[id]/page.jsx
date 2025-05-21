"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import * as z from "zod";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard-header";
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

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>
      ))}
      <div className="flex gap-4">
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        <div className="h-10 w-24 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}
export default function InstructorForm({ params }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const { id } = use(params);

  const fetchInstructor = async () => {
    setFetching(true);
    try {
      const [instructorResponse, reportResponse] = await Promise.all([
        fetch(`/api/instructors/${id}`),
        fetch(`/api/instructors/${id}/reports`),
      ]);

      if (!instructorResponse.ok) throw new Error("فشل في جلب بيانات المدرب");
      if (!reportResponse.ok) throw new Error("فشل في جلب إحصائيات المدرب");

      const [instructorData, reportData] = await Promise.all([
        instructorResponse.json(),
        reportResponse.json(),
      ]);

      setData(instructorData);
      setReportData(reportData);
    } catch (error) {
      toast.error("خطأ في تحميل بيانات المدرب");
      router.push("/dashboard/instructors");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInstructor();
    }
  }, [id, router]);

  if (fetching) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="container mx-auto px-16 py-8">
      <DashboardHeader
        title="بروفايل المدرب"
        action={{
          href: `/dashboard/instructors/${id}/edit`,
          label: "تعديل البيانات",
        }}
      />
      <Card className="mt-10 p-5">
        <div className="flex items-center gap-10">
          <Image
            src={data?.image || "/placeholder-avatar.webp"}
            alt="instructor-avatar"
            width={200}
            height={200}
            className="rounded-full"
          />
          <div className="space-y-2">
            <h2 className="text-xl font-bold">اسم المدرب: {data?.name} </h2>
            <p className=" text-muted-foreground">
              البريد الإلكتروني: {data?.email}
            </p>
            <p className="text-muted-foreground">
              الرياضات: {data?.sports?.map((sport) => sport.name).join(", ")}
            </p>
            <p className="text-muted-foreground">
              الحالة: {data?.status === "active" ? "نشط" : "غير نشط"}
            </p>
            <p className="text-muted-foreground">
              تاريخ التسجيل: {data?.joinDate.slice(0, 10)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-10 p-5">
        <CardHeader>
          <CardTitle>عن المدرب</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data?.description}</p>
        </CardContent>
      </Card>
      {/* Statistics Section */}
      {reportData && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">إحصائيات المدرب</h2>
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
                  {reportData.completedSessions}
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
                <CardTitle className="text-sm font-medium">
                  الجلسات المفوضة
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  الجلسات المستلمة
                </CardTitle>
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
                  الجلسات الخاصة المفوضة
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
                  الجلسات الخاصة المستلمة
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
        </div>
      )}
    </div>
  );
}
