import { NextResponse } from "next/server";

const fetchMonthEvents = async (year: number, month: number) => {
  const url = `https://in-the-sky.org/newscal.php?year=${year}&month=${month}&feed=js`;
  const res = await fetch(url);
  const text = await res.text();
  const match = text.match(/eventsCallback\((.*?)\);/s);
  if (!match) return [];

  const parsed = JSON.parse(match[1]);

  return parsed.map((event: any, idx: number) => ({
    id: `${year}-${month}-${idx}`,
    title: event.title,
    date: event.date,
    time: event.time,
    type: event.type,
    description: event.desc,
    visibility: "Varies",
    observationTips: "Find a clear, dark sky away from light pollution.",
  }));
};

export async function GET() {
  const year = 2025;
  const monthsToFetch = [3, 4, 5, 6, 7, 8]; // March to August

  const allEvents: any[] = [];

  for (const month of monthsToFetch) {
    const monthlyEvents = await fetchMonthEvents(year, month);
    allEvents.push(...monthlyEvents);
  }

  return NextResponse.json(allEvents);
}
