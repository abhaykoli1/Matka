// FULL FRONTEND CODE — CONNECTED TO BACKEND
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import TodayResultMarketHistory from "./TodayMarketResultHistory";

export default function ResultDeclareMarket() {
  const token = localStorage.getItem("accessToken");
  const headers = { Authorization: `Bearer ${token}` };
  const [refreshHistoryFlag, setRefreshHistoryFlag] = useState(0);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState("");

  console.log(games);
  const [session, setSession] = useState("Open");

  const [openPanna, setOpenPanna] = useState("");
  const [openDigit, setOpenDigit] = useState("");
  const [closePanna, setClosePanna] = useState("");
  const [closeDigit, setCloseDigit] = useState("");

  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingGames, setLoadingGames] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load games
  const fetchGames = async () => {
    setLoadingGames(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/market/`, { headers });

      const list = (res.data?.data || []).map((g) => ({
        id: g._id?.$oid,
        name: g.name,
        open_time: g.open_time,
        close_time: g.close_time,
      }));

      setGames(list);
      if (!selectedGameId && list.length) setSelectedGameId(list[0].id);
    } catch (err) {
      console.error("Markets load error:", err);
    }
    setLoadingGames(false);
  };

  // Load history for date
  const fetchHistory = async (forDate = date) => {
    setLoadingHistory(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/admin/results?date=${forDate}`,
        { headers }
      );
      setHistory(res.data?.data || []);
    } catch (err) {
      console.error("History load error:", err);
      setHistory([]);
    }
    setLoadingHistory(false);
  };

  useEffect(() => {
    fetchGames();
    fetchHistory();
  }, []);

  useEffect(() => {
    fetchHistory(date);
  }, [date]);

  const handleGo = async () => {
    if (!selectedGameId) return alert("Select a game");

    try {
      const res = await axios.get(
        `${API_URL}/api/admin/result/find?date=${date}&game_id=${selectedGameId}&session=${session}`,
        { headers }
      );
      const r = res.data?.data;

      if (!r) {
        alert("No result found");
        return;
      }

      if (session === "Open") {
        setOpenPanna(r.open_panna || "");
        setOpenDigit(r.open_digit || "");
      } else {
        setClosePanna(r.close_panna || "");
        setCloseDigit(r.close_digit || "");
      }
    } catch (err) {
      alert("Error fetching previous result");
    }
  };

  const handleDeclare = async () => {
    if (!selectedGameId) return alert("Select game");

    if (session === "Open" && !openPanna && !openDigit)
      return alert("Enter Open Panna or Digit");

    if (session === "Close" && !closePanna && !closeDigit)
      return alert("Enter Close Panna or Digit");

    const payload = {
      date,
      game_id: selectedGameId,
      session: session.toLowerCase(),
      open_panna: session === "Open" ? openPanna : undefined,
      open_digit: session === "Open" ? openDigit : undefined,
      close_panna: session === "Close" ? closePanna : undefined,
      close_digit: session === "Close" ? closeDigit : undefined,
    };

    setSubmitting(true);

    try {
      const res = await axios.post(
        `${API_URL}/api/admin/result/declare`,
        payload,
        { headers }
      );
      setRefreshHistoryFlag((prev) => prev + 1);

      alert(res.data?.message || "Result Declared");
      fetchHistory(date);
    } catch (err) {
      alert(err.response?.data?.detail || "Error declaring result");
    }
    setSubmitting(false);
  };

  const handleDeleteResult = async (resultId) => {
    if (!window.confirm("Delete this result?")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/result/${resultId}`, {
        headers,
      });
      fetchHistory(date);
    } catch {
      alert("Delete failed");
    }
  };

  const formatDateTime = (val) => {
    if (!val) return "-";
    try {
      const d = new Date(val);
      if (isNaN(d)) return val;
      return d.toLocaleString();
    } catch {
      return val;
    }
  };

  // Calculate single digit from panna
  const calcDigit = (panna) => {
    if (!panna || panna.length !== 3) return "";
    const sum = panna
      .split("")
      .map(Number)
      .reduce((a, b) => a + b, 0);
    return String(sum % 10);
  };

  return (
    <div className="lg:p-6 md:p-5 p-3">
      {/* TOP CONTROLS */}
      <section className="bg-white/5 lg:p-6 md:p-5 p-4 rounded-xl">
        <h3 className="text-lg font-bold mb-4">Declare Result</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm">Date</label>
            <input
              type="date"
              className="p-2 border w-full rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Game</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
            >
              <option value="">All Games</option>

              {/* Existing game list */}
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.open_time}-{g.close_time})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Session</label>

            <select
              className="w-full p-2 border rounded"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            >
              <option>Open</option>
              <option>Close</option>
            </select>
          </div>

          {/* <div>
            <button
              onClick={handleGo}
              className="w-full bg-blue-600 text-white p-3 rounded"
            >
              Go
            </button>
          </div> */}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 items-end">
          {session === "Open" ? (
            <>
              <div>
                <label className="text-sm">Open Panna</label>
                <input
                  className="w-full p-2 border rounded"
                  value={openPanna}
                  onChange={(e) => {
                    const val = e.target.value;
                    setOpenPanna(val);

                    // auto-set digit
                    if (val.length === 3) {
                      setOpenDigit(calcDigit(val));
                    } else {
                      setOpenDigit("");
                    }
                  }}
                />
              </div>

              <div>
                <label className="text-sm">Open Digit</label>
                <input
                  className="w-full p-2 border rounded"
                  value={openDigit}
                  readOnly
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm">Close Panna</label>
                <input
                  className="w-full p-2 border rounded"
                  value={closePanna}
                  onChange={(e) => {
                    const val = e.target.value;
                    setClosePanna(val);

                    // auto-set digit
                    if (val.length === 3) {
                      setCloseDigit(calcDigit(val));
                    } else {
                      setCloseDigit("");
                    }
                  }}
                />
              </div>

              <div>
                <label className="text-sm">Close Digit</label>
                <input
                  className="w-full p-2 border rounded"
                  value={closeDigit}
                  readOnly
                />
              </div>
            </>
          )}

          <div>
            <button
              onClick={handleDeclare}
              disabled={submitting}
              className="bg-green-600 text-white px-5 py-2 rounded w-full"
            >
              {submitting ? "Declaring..." : "DECLARE"}
            </button>
          </div>
        </div>
      </section>

      <TodayResultMarketHistory refreshFlag={refreshHistoryFlag} />
    </div>
  );
}
