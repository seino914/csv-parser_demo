import { NextRequest, NextResponse } from "next/server";
import csv from "csv-parser";
import { Readable } from "stream";

type CSVRow = Record<string, string>;

interface UploadResponse {
  rows: CSVRow[];
  error?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function parseCSV(buffer: Buffer): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const results: CSVRow[] = [];
    Readable.from(buffer)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
}

// POST /api/upload
export async function POST(
  req: NextRequest
): Promise<NextResponse<UploadResponse>> {
  try {
    const file = (await req.formData()).get("file") as File;

    if (!file) {
      return NextResponse.json(
        { rows: [], error: "ファイルを選択してください" },
        { status: 400 }
      );
    }

    // ファイル形式の検証
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { rows: [], error: "CSVファイルのみアップロード可能です" },
        { status: 400 }
      );
    }

    // ファイルサイズの検証
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { rows: [], error: "ファイルサイズは5MB以下にしてください" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rows = await parseCSV(buffer);

    // 空のCSVファイルのチェック
    if (rows.length === 0) {
      return NextResponse.json(
        { rows: [], error: "CSVファイルが空です" },
        { status: 400 }
      );
    }

    return NextResponse.json({ rows });
  } catch (error) {
    console.error("CSV処理エラー:", error);
    return NextResponse.json(
      { rows: [], error: "ファイルの処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
