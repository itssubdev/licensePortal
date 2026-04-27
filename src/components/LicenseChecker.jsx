import { useState, useEffect } from "react";

export default function LicenseChecker() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null); 


  const checkLicense = async (value) => {
    if (!value.trim()) {
      setStatus({
        type: "error",
        message: "Please enter a license ID"
      });
      return;
    }

    try {
      const response = await fetch("/licenses.csv");
      const data = await response.text();

      const rows = data
        .split("\n")
        .map(r => r.trim())
        .filter(r => r)
        .slice(1);

      let found = false;

      for (let row of rows) {
        const columns = row.split(",");
        const id = columns[3]?.trim();

        if (id && id.toLowerCase() === value.toLowerCase()) {
          found = true;
          break;
        }
      }

      if (found) {
        setStatus({
          type: "success",
          message: "Your license is ready to collect at Radhe Radhe Yatayat Office/तपाईंको लाइसेन्स राधे राधे यातायात कार्यालयमा लिन तयार छ।"
        });
      } else {
        setStatus({
          type: "error",
          message: "Your license is still in printing State/तपाईंको लाइसेन्स अझै छाप्ने प्रक्रियामा छ।"
        });
      }

    } catch (error) {
      setStatus({
        type: "error",
        message: "Error loading data"
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (input.trim()) {
        checkLicense(input);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [input]);

  return (
    <div className="card">

      <h2>License Printing Status Check Portal</h2>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          checkLicense(input);
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your License number"
        />

        <button type="submit">
          Check Status
        </button>
      </form>

    
      {status && (
        <div className={`status-box ${status.type}`}>
          {status.type === "success" ? "✔" : "✖"} {status.message}
        </div>
      )}

    </div>
  );
}