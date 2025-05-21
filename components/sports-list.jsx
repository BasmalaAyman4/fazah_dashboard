"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

function LoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الوصف</TableHead>
              <TableHead>الحالة</TableHead>
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
                  <div className="h-6 w-20 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function SportsList() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await fetch("/api/sports");
      if (!response.ok) throw new Error("فشل في جلب الرياضات");
      const data = await response.json();
      setSports(data);
    } catch (error) {
      toast.error("خطأ في تحميل الرياضات");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الرياضة؟")) return;

    try {
      const response = await fetch(`/api/sports/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("فشل في حذف الرياضة");
      toast.success("تم حذف الرياضة بنجاح");
      fetchSports();
    } catch (error) {
      toast.error("خطأ في حذف الرياضة");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table dir="ltr">
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الوصف</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sports.map((sport) => (
              <TableRow key={sport._id}>
                <TableCell className="font-medium">{sport.name}</TableCell>
                <TableCell className="max-w-[250px] truncate">
                  {sport.description || "لا يوجد وصف"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      sport.status === "active" ? "default" : "secondary"
                    }
                  >
                    {sport.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">فتح القائمة</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link
                          href={`/dashboard/sports/${sport._id}/edit`}
                          className="flex items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          تعديل
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(sport._id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
