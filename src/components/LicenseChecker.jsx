import { useState } from "react";

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

    // Track event in Google Analytics
    if (window.gtag) {
      window.gtag("event", "license_check", {
        event_category: "engagement",
        event_label: value
      });
    }

    try {
      const response = await fetch("/licenses.csv");
      const data = await response.text();

      const rows = data
        .split("\n")
        .map((r) => r.trim())
        .filter((r) => r)
        .slice(1);

      let found = false;

      for (let row of rows) {
        const columns = row.split(",");
        const id = columns[0]?.trim();

        if (id && id.toLowerCase() === value.toLowerCase()) {
          found = true;
          break;
        }
      }

      if (found) {
        setStatus({
          type: "success",
          message:
            "तपाईंको लाइसेन्स राधे राधे यातायात कार्यालयमा वितरणको लागि तयार छ। "

        });
      } else {
        setStatus({
          type: "error",
          message:
            "तपाईंको लाइसेन्स हालसम्म राधेराधे कार्यालयमा प्राप्त भएको छैन।"
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error loading data"
      });
    }
  };

  return (
    <div className="card">
      <h3>राधे राधे कार्यालयमा वितरणका लागि तयार रहेको लाइसेन्स खोज्नुहोस्।।</h3>

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
          placeholder="आफ्नो लाइसेन्स नम्बर प्रविष्ट गर्नुहोस्।"
        />

        <button type="submit">खोज्नुहोस्।</button>
      </form>

      {/* GUIDELINES (only shown initially) */}
      {status === null && (
        <div className="guide-box">
          <p> तपाईंले आफ्नो लाइसेन्स नम्बर प्रविष्ट गरेपछि, यदि परिणाममा लाइसेन्स छापिएको र लिन तयार छ भनेर देखाएमा मात्र राधे राधे कार्यालयमा जानुहोस्।
</p>
        </div>
      )}

      {/* STATUS OUTPUT */}
      {status && (
        <div className={`status-box ${status.type}`}>
          {status.type === "success" ? "✔" : "✖"} {status.message}
        </div>
      )}
    </div>
  );
}