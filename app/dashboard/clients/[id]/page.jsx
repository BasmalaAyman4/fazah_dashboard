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
import styles from '@/styles/client.module.css'
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
export default function ClientForm({ params }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const { id } = use(params);
  const [active, setActive] = useState("باقة الصيف")

  const fetchInstructor = async () => {
    setFetching(true);
    try {
      const [instructorResponse] = await Promise.all([
        fetch(`/api/clients/${id}`)
      ]);

      if (!instructorResponse.ok) throw new Error("فشل في جلب بيانات العميل");

      const [instructorData] = await Promise.all([
        instructorResponse.json()      ]);

      setData(instructorData);
    } catch (error) {
      toast.error("خطأ في تحميل بيانات العميل");
      router.push("/dashboard/clients");
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
        title="بروفايل العميل"
        action={{
          href: `/dashboard/clients/${id}/edit`,
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
            <h2 className="text-xl font-bold">اسم العميل: {data?.name} </h2>
            <p className=" text-muted-foreground">
              البريد الإلكتروني: {data?.email}
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
          <CardTitle>عن العميل</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{data?.description}</p>
        </CardContent>
      </Card>
     <div className={styles.client__packages}>
      <div>
      <p className={`${styles.filter__para}`}>تفاصيل باقات الاشتراكات</p>
                                <div>
                                    <div>
                                        <div className={`${active === "باقة الصيف" ? styles.style__link : styles.view__link} ${styles.filter__body}`} onClick={() => { setActive("باقة الصيف") }}>
                                            <p>باقة الصيف</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`${active === "باقة المبتدئين" ? styles.style__link : styles.view__link} ${styles.filter__body}`} onClick={() => { setActive("باقة المبتدئين") }}>
                                            <p>باقة المبتدئين</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`${active === "باقة اليوجا" ? styles.style__link : styles.view__link} ${styles.filter__body}`} onClick={() => { setActive("باقة اليوجا") }}>
                                            <p>باقة اليوجا</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className={`${active === "باقة الاشتراكات" ? styles.style__link : styles.view__link} ${styles.filter__body}`} onClick={() => { setActive("باقة الاشتراكات") }}>
                                            <p>باقة الاشتراكات</p>
                                        </div>
                                    </div>
                                </div>
      </div>
      <div>
      <div className="mt-6 bg-neutral-50 p-6 rounded-lg relative overflow-hidden flex justify-between">
          <div className="absolute top-0 left-0 w-2 h-full "></div>
          <div className="w-2/5 p-5">
            <h3 className="text-xl font-semibold mb-2 text-primary">
           {active}
            </h3>
            <p className="text-gray-600 mb-6">
            تمتع بجلسات يوجا متقدمة مع أفضل المدربين
            </p>
            <div className="space-y-2 w-full">
              <p className="w-full flex justify-between">
                <span className="font-semibold">الرياضة:</span>{" "}
                يوجا
              </p>
              <p className="w-full flex justify-between">
                <span className="font-semibold">عدد الجلسات الكلي:</span>{" "}
             12
              </p>
              <p className="w-full flex justify-between">
                <span className="font-semibold">الجلسات المتبقية:</span>{" "}
8
              </p>
              <p className="w-full flex justify-between">
                <span className="font-semibold">الخطة:</span>{" "}
                باقة شهرية
              </p>
              <p className="w-full flex justify-between">
                <span className="font-semibold">السعر:</span>{" "}
                360 ريال
              </p>
            </div>
            <p className="w-full flex justify-between">
              <span className="font-semibold">تاريخ البدء:</span>{" "}
              2025-05-01
            </p>
            <p className="w-full flex justify-between">
              <span className="font-semibold">تاريخ الانتهاء المتوقع:</span>{" "}
              2025-08-01
            </p>
          </div>
        
        </div>
      </div>
     </div>
    </div>
  );
}
