import {
  ReviewData,
  BulkAnalysisSummary,
  ReportData,
  AnalyzeResponse
} from "../types";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://fake-review-system.onrender.com";

/**
 * Analyze reviews (Local ML or AI)
 */
export async function analyzeReviewsBatch(
  reviews: ReviewData[],
  mode: "local" | "ai"
): Promise<AnalyzeResponse> {
  const endpoint =
    mode === "local"
      ? `${API_URL}/predict`
      : `${API_URL}/predict-ai`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reviews }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        errorText ||
          (mode === "local"
            ? "Local analysis server is unavailable"
            : "AI analysis service failed")
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Analysis Error:", error);

    throw new Error(
      mode === "local"
        ? "Unable to connect to Local Analysis Server"
        : "Unable to connect to AI Analysis Service"
    );
  }
}

/**
 * Generate audit report
 */
export async function generateAuditReport(
  summary: BulkAnalysisSummary,
  fakeSamples: string[]
): Promise<ReportData> {
  return {
    summary: `
Out of ${summary.totalReviews} reviews analyzed,
${summary.fakeCount} were detected as potentially fake.

The platform trust score is ${summary.overallTrustScore}%.

After confidence-weighting, the corrected average rating is
${summary.trueAvgRating}.
    `.trim(),

    keyPatterns:
      fakeSamples.length > 0
        ? fakeSamples.map(
            (_, index) =>
              `Pattern ${index + 1}: Suspicious or repetitive language detected`
          )
        : ["No major suspicious patterns detected."],

    recommendations: [
      "Remove detected fake reviews from listings.",
      "Monitor users repeatedly posting suspicious reviews.",
      "Encourage verified purchases.",
      "Run periodic review audits.",
    ],
  };
}
