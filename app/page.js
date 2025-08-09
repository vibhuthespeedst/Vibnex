/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useState } from "react";

export default function Page() {
    const [long, setLong] = useState("");
    const [code, setCode] = useState("");
    const [shortUrl, setShortUrl] = useState(""); // store generated short link
    const [loading, setLoading] = useState({
        state: false,
        message: "Create Short Link 🚀",
    });

    const create = async () => {
        setLoading({ state: true, message: "Crafting your link ✨" });

        const response = await fetch("api/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ long, code }),
        });

        if (response.status === 409) {
            setLoading({ state: true, message: "Short code exists ⚠️" });
        } else if (response.status === 400) {
            setLoading({ state: true, message: "Invalid inputs ⚠️" });
        } else if (response.ok) {
            const base = typeof window !== "undefined" ? window.location.origin : "";
            const url = `${base}/${code}`;
            setShortUrl(url);
            setLoading({ state: true, message: "Link created ✅" });
        }

        setTimeout(
            () => setLoading({ state: false, message: "Create Short Link 🚀" }),
            3000
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4">
            <div className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg transition-all duration-500 hover:scale-[1.02]">
                {/* Branding */}
                <h1 className="text-5xl font-extrabold tracking-tight text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Vibnex
                </h1>
                <p className="mt-2 text-center text-gray-400 text-sm">
                    Minimal. Fast URL Shortener.
                </p>

                {/* Long URL Input */}
                <div className="mt-8">
                    <label className="block text-sm mb-2 text-gray-300">
                        Long URL
                    </label>
                    <input
                        type="text"
                        placeholder="https://your-long-url.com"
                        onChange={(e) => setLong(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 text-sm"
                    />
                </div>

                {/* Short Code Input */}
                <div className="mt-4">
                    <label className="block text-sm mb-2 text-gray-300">
                        Custom Short Code
                    </label>
                    <div className="flex items-center space-x-2">
                        <span className="px-3 py-3 bg-black/40 border border-white/10 rounded-lg text-gray-400 whitespace-nowrap text-sm">
                            {typeof window !== "undefined" ? window.location.origin + "/" : ""}
                        </span>
                        <input
                            type="text"
                            placeholder="cool-name"
                            onChange={(e) => setCode(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 outline-none placeholder-gray-500 text-sm"
                        />
                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    `${typeof window !== "undefined" ? window.location.origin : ""}/${code}`
                                )
                            }
                            className="px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                {/* Create Button */}
                <button
                    onClick={create}
                    disabled={loading.state}
                    className={`mt-6 w-full py-3 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 ${loading.state ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    {loading.message}
                </button>

                {/* Preview Section */}
                {shortUrl && (
                    <div className="mt-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-300">{shortUrl}</span>
                            <button
                                onClick={() => window.open(shortUrl, "_blank")}
                                className="px-3 py-2 text-xs rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                            >
                                Open in New Tab
                            </button>
                        </div>
                        {/* <iframe
                            src={shortUrl}
                            className="w-full h-64 rounded-lg border border-white/10"
                        ></iframe> */}
                    </div>
                )}
            </div>
        </div>
    );
}
