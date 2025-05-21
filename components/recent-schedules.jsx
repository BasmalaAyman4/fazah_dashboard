"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function RecentSchedules() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>الجداول الحديثة</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اليوم</TableHead>
              <TableHead>الوقت</TableHead>
              <TableHead>الرياضة</TableHead>
              <TableHead>الفئة الفرعية</TableHead>
              <TableHead>الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>الإثنين</TableCell>
              <TableCell>10:00 ص - 11:00 ص</TableCell>
              <TableCell>يوجا</TableCell>
              <TableCell>يوجا القوة</TableCell>
              <TableCell>
                <Badge>نشط</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>الثلاثاء</TableCell>
              <TableCell>2:00 م - 3:30 م</TableCell>
              <TableCell>بيلاتس</TableCell>
              <TableCell>بيلاتس مات</TableCell>
              <TableCell>
                <Badge>نشط</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>الأربعاء</TableCell>
              <TableCell>9:00 ص - 10:00 ص</TableCell>
              <TableCell>يوجا</TableCell>
              <TableCell>يوجا ساخنة</TableCell>
              <TableCell>
                <Badge>نشط</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>الخميس</TableCell>
              <TableCell>6:00 م - 7:00 م</TableCell>
              <TableCell>بيلاتس</TableCell>
              <TableCell>بيلاتس ريفورمر</TableCell>
              <TableCell>
                <Badge>نشط</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>الجمعة</TableCell>
              <TableCell>5:00 م - 6:00 م</TableCell>
              <TableCell>يوجا</TableCell>
              <TableCell>يوجا ين</TableCell>
              <TableCell>
                <Badge>نشط</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
