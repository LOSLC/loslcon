import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function SummaryStats({ totalRegs, confirmedRegs, unconfirmedRegs, attendedRegs, attendanceConfirmedRegs }: {
  totalRegs: number;
  confirmedRegs: number;
  unconfirmedRegs: number;
  attendedRegs: number;
  attendanceConfirmedRegs: number;
}) {
  return (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Total registrations</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold">{totalRegs.toLocaleString()}</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Confirmed</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-emerald-500">{confirmedRegs.toLocaleString()}</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Unconfirmed</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-amber-500">{unconfirmedRegs.toLocaleString()}</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Will Attend</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-purple-500">{attendanceConfirmedRegs.toLocaleString()}</CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Attended</CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-bold text-sky-500">{attendedRegs.toLocaleString()}</CardContent>
      </Card>
    </div>
  );
}

export function PerTicketTable({ perTicket }: {
  perTicket: Array<{ t: { id: string; name: string; price: number }; total: number; confirmed: number; unconfirmed: number; attended: number }>;
}) {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between p-3">
        <h2 className="text-lg font-semibold">By ticket</h2>
      </div>
      {/* Mobile: card list */}
      <div className="grid gap-3 p-3 sm:hidden">
        {perTicket.map(({ t, total, confirmed, unconfirmed, attended }) => (
          <Card key={t.id}>
            <div className="p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{t.name}</div>
                  <div className="text-xs opacity-80">
                    {new Intl.NumberFormat(undefined, { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(t.price)}
                  </div>
                </div>
                <div className="text-sm font-semibold">{total}</div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-md bg-emerald-500/10 px-2 py-1 text-emerald-600">Conf: {confirmed}</div>
                <div className="rounded-md bg-amber-500/10 px-2 py-1 text-amber-600">Unconf: {unconfirmed}</div>
                <div className="rounded-md bg-sky-500/10 px-2 py-1 text-sky-600">Attd: {attended}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* >= sm: table */}
      <div className="overflow-x-auto hidden sm:block">
        <Table className="min-w-[720px]">
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Confirmed</TableHead>
              <TableHead>Unconfirmed</TableHead>
              <TableHead>Attended</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {perTicket.map(({ t, total, confirmed, unconfirmed, attended }) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "XOF",
                    maximumFractionDigits: 0,
                  }).format(t.price)}
                </TableCell>
                <TableCell>{total}</TableCell>
                <TableCell className="text-emerald-600">{confirmed}</TableCell>
                <TableCell className="text-amber-600">{unconfirmed}</TableCell>
                <TableCell className="text-sky-600">{attended}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
