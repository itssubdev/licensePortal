import { useState } from "react";

export default function LicenseChecker() {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Format: XX-XX- + unlimited digits
  const formatLicense = (value) => {
    const digits = value.replace(/\D/g, "");

    const part1 = digits.slice(0, 2);
    const part2 = digits.slice(2, 4);
    const part3 = digits.slice(4); // unlimited

    let formatted = part1;

    if (part2) formatted += "-" + part2;
    if (part3) formatted += "-" + part3;

    return formatted;
  };

  // Normalize for matching (remove dashes, spaces, etc.)
  const normalize = (str) => (str || "").replace(/\D/g, "");

  const checkLicense = async (value) => {
    const cleaned = value.trim();

    if (!cleaned) {
      setStatus({
        type: "error",
        message: "Please enter a license ID",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/licenses.csv");

      if (!response.ok) {
        throw new Error("Failed to fetch CSV");
      }

      const csvText = await response.text();

      const rows = csvText
        .split("\n")
        .map((row) => row.trim())
        .filter(Boolean);

      rows.shift(); // remove header

      let matchedName = null;
      let matchedId = null;

      const found = rows.some((row) => {
        const columns = row.split(",");

        const id = (columns[0] || "").replace(/\r/g, "").trim();
        const name = (columns[1] || "").replace(/\r/g, "").trim();

        if (id && normalize(id) === normalize(cleaned)) {
          matchedId = id;
          matchedName = name || "नाम उपलब्ध छैन";
          return true;
        }

        return false;
      });

      if (found) {
        setStatus({
          type: "success",
          name: matchedName,
          id: matchedId,
          message:
            "तपाईंको लाइसेन्स राधे राधे यातायात कार्यालयमा वितरणको लागि तयार छ।",
        });
      } else {
        setStatus({
          type: "error",
          message:
            "तपाईंको लाइसेन्स हालसम्म राधेराधे कार्यालयमा प्राप्त भएको छैन।",
        });
      }
    } catch (error) {
      console.error(error);

      setStatus({
        type: "error",
        message: "डेटा लोड गर्न समस्या भयो।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>
        राधे राधे कार्यालयमा वितरणका लागि तयार रहेको लाइसेन्स खोज्नुहोस्।
      </h3>

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
          onChange={(e) => setInput(formatLicense(e.target.value))}
          placeholder="XX-XX-XXXXXXXX"
        />

        <button type="submit" disabled={loading}>
          {loading ? "लोड हुँदैछ..." : "खोज्नुहोस्"}
        </button>
      </form>

      {/* Guide */}
      {!status && (
        <div className="guide-box">
          <p>
            आफ्नो लाइसेन्स नम्बर प्रविष्ट गर्नुहोस् र परिणाम अनुसार कार्यालयमा जानुहोस्।
          </p>
        </div>
      )}

      {/* RESULT BOX */}
      {status && (
        <div className={`status-box ${status.type}`}>

          {/* 1. NAME */}
          {status.type === "success" && (
            <div className="status-line">
              <strong>Applicant Name:</strong> {status.name}
            </div>
          )}

          {/* 2. ID */}
          {status.type === "success" && (
            <div className="status-line">
              <strong>License ID:</strong> {status.id}
            </div>
          )}

          {/* 3. MESSAGE */}
          <div className="status-message">
            {status.type === "success" ? "✔ " : "✖ "}
            {status.message}
          </div>

        </div>
      )}
    </div>
  );
}