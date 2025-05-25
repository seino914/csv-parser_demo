"use client";

import { useState } from "react";

export default function Home() {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;

    if (!fileInput?.files?.[0]) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      setCsvData(data.rows);
      form.reset();
    } catch (error) {
      alert("エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            CSVファイルアップロード
          </h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CSVファイルを選択
              </label>
              <input
                type="file"
                name="file"
                accept=".csv"
                required
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  cursor-pointer"
                disabled={isLoading}
              />
              <p className="mt-2 text-sm text-gray-500">
                CSVファイルをアップロードしてください
              </p>
            </div>
            <div>
              <button
                type="submit"
                className={`w-full sm:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm
                  ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                disabled={isLoading}
              >
                {isLoading ? "アップロード中..." : "アップロード"}
              </button>
            </div>
          </form>
        </div>

        {csvData.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(csvData[0]).map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvData.map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {Object.values(row).map((value, j) => (
                        <td
                          key={j}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {value as string}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
