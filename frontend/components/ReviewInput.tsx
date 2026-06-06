import React, { useState, useRef } from 'react';
import {
  Upload,
  Plus,
  FileText,
} from 'lucide-react';
import { ReviewData } from '../types';

// Simple UUID generator
const generateId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

interface Props {
  onAddReviews: (reviews: ReviewData[]) => void;
}

const ReviewInput: React.FC<Props> = ({ onAddReviews }) => {
  const [inputText, setInputText] = useState('');
  const [rating, setRating] = useState(5);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleManualSubmit = () => {
    if (!inputText.trim()) return;

    const newReview: ReviewData = {
      id: generateId(),
      text: inputText,
      rating,
      date: new Date().toISOString().split('T')[0],
      source: 'Manual Entry',
    };

    onAddReviews([newReview]);
    setInputText('');
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;

      const lines = text
        .split('\n')
        .filter((line) => line.trim() !== '');

      const parsedReviews: ReviewData[] = lines
        .slice(1)
        .map((line) => {
          const parts = line.split(',');

          let reviewText = parts[0];
          let reviewRating = 5;

          if (parts.length >= 2) {
            const potentialRating = parseInt(
              parts[parts.length - 1].trim()
            );

            if (
              !isNaN(potentialRating) &&
              potentialRating >= 1 &&
              potentialRating <= 5
            ) {
              reviewRating = potentialRating;

              reviewText = parts
                .slice(0, parts.length - 1)
                .join(',')
                .replace(/^"|"$/g, '');
            } else {
              reviewText = line;
            }
          } else {
            reviewText = line;
          }

          return {
            id: generateId(),
            text: reviewText,
            rating: reviewRating,
            source: file.name,
          };
        });

      onAddReviews(parsedReviews);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-slate-800 p-4 sm:p-6 rounded-xl border border-slate-700 shadow-lg">
      {/* Header */}
      <h2 className="text-lg sm:text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary-500" />
        Input Reviews
      </h2>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Manual Input */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            Single Review Text
          </label>

          <textarea
            className="w-full h-32 sm:h-40 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none resize-none text-sm sm:text-base"
            placeholder="Paste review text here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-400">
                Rating:
              </label>

              <select
                value={rating}
                onChange={(e) =>
                  setRating(Number(e.target.value))
                }
                className="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white text-sm"
              >
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r} Stars
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleManualSubmit}
              disabled={!inputText.trim()}
              className="w-full sm:flex-1 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              Add Review
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <div className="flex flex-col justify-center items-center border-2 border-dashed border-slate-700 rounded-lg p-6 sm:p-8 hover:bg-slate-700/20 transition-colors text-center">
          <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500 mb-3" />

          <p className="text-slate-300 font-medium text-sm sm:text-base mb-1">
            Bulk Upload CSV
          </p>

          <p className="text-xs sm:text-sm text-slate-500 mb-4">
            Format: Review Text, Rating (Optional)
            <br />
            Max 5MB
          </p>

          <input
            type="file"
            accept=".csv,.txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />

          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Select File
          </label>
        </div>
      </div>
    </div>
  );
};

export default ReviewInput;
