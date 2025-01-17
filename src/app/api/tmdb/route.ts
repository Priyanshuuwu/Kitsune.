import { NextRequest, NextResponse } from "next/server";
import { TMDB_URI } from "@/utils/constants";

const API = {
  search: TMDB_URI + "/search/tv?query=",
  logo: TMDB_URI + "/tv",
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const res = await fetch(API.search + searchParams.get("query"), {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMjkxNjliYzQzOTYwMjM0Mjk1MzdhZmJhZTA1OTdhMSIsInN1YiI6IjY1MjJhZDNhMDcyMTY2MDExYzA1ZTkwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.otg_ClaImVTBZVXywTB1l2E9WlLUYfnMR12uNkacmCM`,
      accept: "application/json",
    },
  });

  const infoData = await res.json();
  if (infoData.results.length <= 0)
    return NextResponse.json(
      { message: "Empty", result: { logos: [] } },
      { status: 404 }
    );
  const result = await getTMDBLogo(infoData.results[0].id);
  return NextResponse.json({ result }, { status: 200 });
}

async function getTMDBLogo(id: number) {
  const res = await fetch(`${API.logo}/${id}/images`, {
    headers: {
      Authorization: `Bearer ${process.env.TMDB_ACCESS_KEY}`,
      accept: "application/json",
    },
  });
  const infoData = await res.json();
  return infoData;
}
