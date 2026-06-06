import React from 'react';
import { X, Copy, Terminal, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ServerSetupModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const pythonCode = `# backend/server.py
# Requirements: pip install fastapi uvicorn scikit-learn transformers torch

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from transformers import pipeline

print("Loading BERT Sentiment Model...")

sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewInput(BaseModel):
    id: str
    text: str
    rating: int

class RequestBody(BaseModel):
    reviews: List[ReviewInput]

@app.post("/analyze")
async def analyze_reviews(body: RequestBody):
    results = []

    texts = [r.text for r in body.reviews]
    sentiments = sentiment_pipeline(texts)

    for i, review in enumerate(body.reviews):
        text_lower = review.text.lower()
        bert_sentiment = sentiments[i]

        score_modifiers = 0
        reasons = []

        if len(text_lower.split()) < 3:
            score_modifiers -= 20
            reasons.append("Review too short")

        promo_words = [
            "guarantee",
            "buy now",
            "click here",
            "amazing product",
            "100%"
        ]

        if any(word in text_lower for word in promo_words):
            score_modifiers -= 30
            reasons.append("Promotional language detected")

        mapped_sentiment = (
            "Positive"
            if bert_sentiment["label"] == "POSITIVE"
            else "Negative"
        )

        if review.rating === 5 and mapped_sentiment === "Negative":
            score_modifiers -= 40
            reasons.append(
                "Rating (5) contradicts Text Sentiment (Negative)"
            )

        elif review.rating === 1 and mapped_sentiment === "Positive":
            score_modifiers -= 40
            reasons.append(
                "Rating (1) contradicts Text Sentiment (Positive)"
            )

        base_confidence = 85 + score_modifiers
        is_fake = base_confidence < 50

        results.append({
            "reviewId": review.id,
            "label": "Fake" if is_fake else "Genuine",
            "confidenceScore": min(
                max(
                    int(
                        base_confidence
                        if not is_fake
                        else (100 - base_confidence)
                    ),
                    0
                ),
                100
            ),
            "reason": (
                ", ".join(reasons)
                if reasons
                else "Consistent language patterns"
            ),
            "sentiment": (
                "Neutral"
                if review.rating == 3
                else mapped_sentiment
            )
        })

    return {"results": results}

if __name__ == "__main__":
    print("Server running on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-4 sm:p-6 border-b border-slate-800">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
              <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>

            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-white break-words">
                Local ML Server Setup
              </h2>

              <p className="text-xs sm:text-sm text-slate-400">
                Run BERT + TF-IDF + Logistic Regression locally
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 sm:p-4 rounded-lg">
              <h3 className="text-blue-400 font-semibold mb-2">
                How it works
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To use local ML models, run a Python backend.
                This FastAPI server uses HuggingFace Transformers
                (BERT) for sentiment analysis and simulates a
                TF-IDF + Logistic Regression review detection
                pipeline.
              </p>
            </div>

            {/* Install */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-300">
                1. Install Dependencies
              </p>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs sm:text-sm text-green-400 overflow-x-auto">
                pip install fastapi uvicorn scikit-learn transformers torch
              </div>
            </div>

            {/* Code */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center">
                <p className="text-sm font-medium text-slate-300">
                  2. server.py
                </p>

                <button
                  onClick={handleCopy}
                  className="w-fit flex items-center gap-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>

              <pre className="bg-slate-950 p-3 sm:p-4 rounded-lg border border-slate-800 font-mono text-[10px] sm:text-xs text-slate-300 overflow-auto h-48 sm:h-64 md:h-80 custom-scrollbar">
                {pythonCode}
              </pre>
            </div>

            {/* Run */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-300">
                3. Run Server
              </p>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs sm:text-sm text-green-400 overflow-x-auto">
                python server.py
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerSetupModal;
