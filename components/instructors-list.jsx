"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

function LoadingSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>الرياضات</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-40 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function InstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const [sports, setSports] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSports();
    fetchInstructors();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await fetch("/api/sports");
      if (!response.ok) throw new Error("فشل في جلب الرياضات");
      const data = await response.json();
      const sportsMap = data.reduce((acc, sport) => {
        acc[sport._id] = sport.name;
        return acc;
      }, {});
      setSports(sportsMap);
    } catch (error) {
      toast.error("خطأ في تحميل الرياضات");
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch("/api/instructors");
      if (!response.ok) throw new Error("فشل في جلب المدربين");
      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      toast.error("خطأ في تحميل المدربين");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المدرب؟")) return;

    try {
      const response = await fetch(`/api/instructors/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("فشل في حذف المدرب");
      toast.success("تم حذف المدرب بنجاح");
      fetchInstructors();
    } catch (error) {
      toast.error("خطأ في حذف المدرب");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (instructors.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        لم يتم العثور على مدربين. أضف أول مدرب للبدء.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>الرياضات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instructors.map((instructor) => (
            <TableRow key={instructor._id}>
              <TableCell>{instructor.name}</TableCell>
              <TableCell>{instructor.email}</TableCell>
              <TableCell>{instructor.phone}</TableCell>
              <TableCell>
                {instructor.sports && instructor.sports.length > 0
                  ? instructor.sports
                      .map((sportId) => sports[sportId] || sportId)
                      .join("، ")
                  : "لا توجد رياضات"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/instructors/${instructor._id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/dashboard/instructors/${instructor._id}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild></Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(instructor._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
