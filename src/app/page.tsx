"use client";

import { useState, useEffect } from "react";

const BACKEND_URL = "http://127.0.0.1:5002";

interface ZebuAsset {
  id: number;
  name: string;
  status: string;
}

interface DiagnosticLog {
  Arguments: string;
  Endpoint: string;
  Outcome: string;
}

export default function Home() {
  const [assetList, setAssetList] = useState<ZebuAsset[]>([]);
  const [newAssetName, setNewAssetName] = useState("");
  const [diagnosticLogs, setDiagnosticLogs] = useState<DiagnosticLog[]>([]);

  const refreshAssetList = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/assets`);
      const data = await response.json();
      setAssetList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddNewAsset = async () => {
    if (!newAssetName.trim()) return;
    try {
      await fetch(`${BACKEND_URL}/api/assets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAssetName, status: "Pending" }),
      });
      setNewAssetName("");
      refreshAssetList();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAssetStatus = async (id: number, currentStatus: string) => {
    try {
      const updatedStatus = currentStatus === "Pending" ? "Approved" : "Pending";
      const response = await fetch(`${BACKEND_URL}/api/assets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: updatedStatus }),
      });
      if (!response.ok) alert(`Error: ${response.status}`);
      refreshAssetList();
    } catch (error) {
      alert("Network Error");
    }
  };

  const removeAsset = async (id: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/assets/${id}`, { method: "DELETE" });
      if (!response.ok) alert(`Error: ${response.status}`);
      refreshAssetList();
    } catch (error) {
      alert("Network Error");
    }
  };

  const fetchDiagnosticReport = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/run-tests`);
      if (!response.ok) {
        alert(`Error: ${response.status}`);
        return;
      }
      const data = await response.json();
      setDiagnosticLogs(data.test_case_data || []);
    } catch (error) {
      alert("Network Error");
    }
  };

  useEffect(() => {
    refreshAssetList();
  }, []);

  const UI = {
    Container: { padding: "30px", fontFamily: "sans-serif", maxWidth: "900px", margin: "auto" },
    Title: { marginBottom: "30px" },
    SectionHeader: { textTransform: "uppercase" as const, fontSize: "14px", letterSpacing: "1px", margin: "30px 0 15px" },
    InputBox: { padding: "8px", border: "1px solid #ccc", marginRight: "10px", width: "250px" },
    Btn: { padding: "8px 20px", cursor: "pointer", fontWeight: "bold" },
    ReportBtn: { padding: "10px 20px", cursor: "pointer", fontWeight: "bold", marginBottom: "20px", border: "2px solid black", background: "white" },
    ListItem: { padding: "15px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" },
    Badge: { marginLeft: "10px", fontSize: "11px", padding: "2px 6px", background: "#f0f0f0", borderRadius: "4px", border: "1px solid #ddd" },
    Table: { width: "100%", textAlign: "left" as const, borderCollapse: "collapse" as const, fontSize: "13px" },
    LogData: { margin: 0, fontSize: "12px", color: "blue", background: "#f5f5f5", padding: "5px" }
  };

  return (
    <div style={UI.Container}>
      <h1 style={UI.Title}>Zebu Asset Tracker</h1>

      <hr />

      <div>
        <h3 style={UI.SectionHeader}>1. Manage Data (Full CRUD)</h3>
        <input
          type="text"
          value={newAssetName}
          onChange={(e) => setNewAssetName(e.target.value)}
          placeholder="Enter item name..."
          style={UI.InputBox}
        />
        <button onClick={handleAddNewAsset} style={UI.Btn}>Add Item</button>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {assetList.map((asset) => (
            <li key={asset.id} style={UI.ListItem}>
              <span>
                <strong style={{ fontSize: "16px" }}>{asset.name}</strong>
                <span style={UI.Badge}>{asset.status}</span>
              </span>
              <div style={{ display: "flex", gap: "20px" }}>
                <button onClick={() => toggleAssetStatus(asset.id, asset.status)} style={{ background: "none", border: "none", color: "blue", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>TOGGLE STATUS</button>
                <button onClick={() => removeAsset(asset.id)} style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontWeight: "bold", fontSize: "12px" }}>DELETE</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <hr />

      <div>
        <h3 style={UI.SectionHeader}>2. Backend Diagnostics</h3>
        <button onClick={fetchDiagnosticReport} style={UI.ReportBtn}>Run Tests & Fetch Logs</button>

        {diagnosticLogs.length === 0 && <p style={{ color: "#999", fontStyle: "italic" }}>Report will appear here after fetching.</p>}

        {diagnosticLogs.length > 0 && (
          <table border={1} cellPadding={10} style={UI.Table}>
            <thead>
              <tr style={{ backgroundColor: "#f9f9f9" }}>
                <th>Method</th>
                <th>Arguments</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              {diagnosticLogs.map((log, index) => (
                <tr key={index}>
                  <td><code style={{ fontWeight: "bold" }}>{log.Endpoint.toUpperCase()}</code></td>
                  <td><pre style={UI.LogData}>{log.Arguments}</pre></td>
                  <td style={{
                    color: log.Outcome.toUpperCase().includes("200") || log.Outcome.toUpperCase().includes("201") || log.Outcome.toUpperCase().includes("SUCCESS") ? "green" : "red",
                    fontWeight: "bold"
                  }}>{log.Outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
