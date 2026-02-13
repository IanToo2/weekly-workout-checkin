import { useEffect, useState } from "react";
import { getHealth, getRules } from "./api";
import type { RulesResponse } from "./types";

function App() {
  const [rules, setRules] = useState<RulesResponse | null>(null);
  const [health, setHealth] = useState<string>("loading");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const [healthData, rulesData] = await Promise.all([getHealth(), getRules()]);
        setHealth(healthData.status);
        setRules(rulesData);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        setError(message);
      }
    }
    load();
  }, []);

  return (
    <main className="page">
      <section className="card">
        <h1>Fitness Check-in</h1>
        <p>Backend status: {health}</p>
        {error && <p className="error">Error: {error}</p>}

        {rules && (
          <ul>
            <li>Max check-in per day: {rules.maxCheckinsPerDay}</li>
            <li>Required check-ins per week: {rules.requiredCheckinsPerWeek}</li>
            <li>Week: {rules.weekStartsOn} to {rules.weekEndsOn}</li>
            <li>Fine if failed: KRW {rules.weeklyFineKrw.toLocaleString()}</li>
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
