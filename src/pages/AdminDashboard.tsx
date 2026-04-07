import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Users, Map, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventRow {
  event_type: string;
  event_data: Record<string, unknown> | null;
  session_id: string | null;
  created_at: string;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)",
  "hsl(0, 72%, 51%)",
  "hsl(200, 80%, 50%)",
  "hsl(330, 70%, 50%)",
];

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("user_events")
      .select("event_type, event_data, session_id, created_at")
      .order("created_at", { ascending: false })
      .limit(1000)
      .then(({ data, error }) => {
        if (!error && data) setEvents(data as EventRow[]);
        setLoading(false);
      });
  }, []);

  // Event counts
  const eventCounts = events.reduce<Record<string, number>>((acc, e) => {
    acc[e.event_type] = (acc[e.event_type] || 0) + 1;
    return acc;
  }, {});
  const eventCountData = Object.entries(eventCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Sessions over time (by day)
  const sessionsByDay = events.reduce<Record<string, Set<string>>>((acc, e) => {
    const day = e.created_at.slice(0, 10);
    if (!acc[day]) acc[day] = new Set();
    if (e.session_id) acc[day].add(e.session_id);
    return acc;
  }, {});
  const sessionData = Object.entries(sessionsByDay)
    .map(([day, sessions]) => ({ day, sessions: sessions.size }))
    .sort((a, b) => a.day.localeCompare(b.day));

  // Popular biomes
  const biomeCounts = events
    .filter((e) => e.event_type === "biome_entered")
    .reduce<Record<string, number>>((acc, e) => {
      const id = (e.event_data as any)?.biomeId || "unknown";
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
  const biomeData = Object.entries(biomeCounts)
    .map(([name, visits]) => ({ name, visits }))
    .sort((a, b) => b.visits - a.visits);

  // Avg time per biome
  const biomeTimes = events
    .filter((e) => e.event_type === "biome_time")
    .reduce<Record<string, number[]>>((acc, e) => {
      const id = (e.event_data as any)?.biomeId || "unknown";
      const sec = (e.event_data as any)?.timeSpentSec || 0;
      if (!acc[id]) acc[id] = [];
      acc[id].push(sec);
      return acc;
    }, {});
  const avgBiomeTime = Object.entries(biomeTimes)
    .map(([name, times]) => ({
      name,
      avgSeconds: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    }))
    .sort((a, b) => b.avgSeconds - a.avgSeconds);

  const uniqueSessions = new Set(events.map((e) => e.session_id).filter(Boolean)).size;

  const chartConfig = {
    count: { label: "Count", color: "hsl(var(--primary))" },
    sessions: { label: "Sessions", color: "hsl(var(--primary))" },
    visits: { label: "Visits", color: "hsl(var(--primary))" },
    avgSeconds: { label: "Avg Seconds", color: "hsl(var(--accent))" },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg animate-pulse">Loading analytics…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">Player Analytics</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <BarChart3 className="h-4 w-4" /> Total Events
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{events.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" /> Sessions
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{uniqueSessions}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Map className="h-4 w-4" /> Biomes Visited
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{biomeData.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" /> Event Types
            </CardTitle>
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">{eventCountData.length}</p></CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Event Counts Bar */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Events by Type</CardTitle></CardHeader>
          <CardContent>
            {eventCountData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[260px] w-full">
                <BarChart data={eventCountData} layout="vertical" margin={{ left: 100 }}>
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={95} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-sm">No events yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Sessions Over Time */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Sessions Over Time</CardTitle></CardHeader>
          <CardContent>
            {sessionData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[260px] w-full">
                <LineChart data={sessionData}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" strokeWidth={2} dot />
                </LineChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-sm">No session data yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Popular Biomes Pie */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Popular Biomes</CardTitle></CardHeader>
          <CardContent>
            {biomeData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[260px] w-full">
                <PieChart>
                  <Pie data={biomeData} dataKey="visits" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {biomeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-sm">No biome visits recorded yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Avg Time per Biome */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Avg Time per Biome (seconds)</CardTitle></CardHeader>
          <CardContent>
            {avgBiomeTime.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[260px] w-full">
                <BarChart data={avgBiomeTime}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgSeconds" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-muted-foreground text-sm">No biome time data yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Events Table */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Recent Events</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.slice(0, 20).map((e, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{e.event_type}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[200px] truncate">
                    {JSON.stringify(e.event_data)}
                  </TableCell>
                  <TableCell className="text-xs">{e.session_id?.slice(0, 8)}…</TableCell>
                  <TableCell className="text-xs">{new Date(e.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
