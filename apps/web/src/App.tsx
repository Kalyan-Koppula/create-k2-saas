import React, { useState } from "react";
import type { PostPayload, PostResponse } from "@k2-saas/shared-types";
import { apiClient } from "./utils/api";

const App: React.FC = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<PostResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const payload: PostPayload = { name, message: message || undefined };

    try {
      const result = await apiClient<PostResponse>("post", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setResult(result);
    } catch (err: any) {
      setError(err?.message ?? "Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h1 className="text-2xl font-semibold mb-4">Send a Post</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              className="w-full rounded border px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              className="w-full rounded border px-3 py-2"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              type="submit"
            >
              Send
            </button>
          </div>
        </form>

        {error && <div className="mt-4 text-red-600">Error: {error}</div>}

        {result && (
          <div className="mt-4 p-3 border rounded bg-slate-50">
            <div className="text-sm text-gray-600">Response:</div>
            <pre className="text-sm mt-2">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
