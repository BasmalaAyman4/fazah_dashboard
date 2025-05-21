"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DailyStatsTable({ data }) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>إحصائيات الجلسات اليومية</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="text-end">
          <TableHeader>
            <TableRow>
              <TableHead>اليوم</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الوقت</TableHead>
              <TableHead>النشاط</TableHead>
              <TableHead>جلسة مكتملة</TableHead>
              <TableHead>جلسة خاصة مكتملة</TableHead>
              <TableHead>جلسة ملغاه</TableHead>
              <TableHead>جلسة خاصة ملغاه</TableHead>
              <TableHead>جلسة ⬆️</TableHead>
              <TableHead>جلسة ⬇️</TableHead>
              <TableHead>جلسة خاصة ⬆️</TableHead>
              <TableHead>جلسة خاصة ⬇️</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((day) => (
              <TableRow key={day.date}>
                <TableCell>{day.day}</TableCell>
                <TableCell>{day.date.slice(2, 10)}</TableCell>
                <TableCell>{day.time || "-"}</TableCell>
                <TableCell>
                  {day.sport || "-"} <br /> {day.activityType || "-"}
                </TableCell>
                <TableCell>{day.totalSessions}</TableCell>
                <TableCell>{day.privateSessions}</TableCell>
                <TableCell>{day.canceledSessions}</TableCell>
                <TableCell>{day.canceledPrivateSessions}</TableCell>
                <TableCell>{day.delegatedToOthers}</TableCell>
                <TableCell>{day.delegatedFromOthers}</TableCell>
                <TableCell>{day.privateDelegatedToOthers}</TableCell>
                <TableCell>{day.privateDelegatedFromOthers}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
