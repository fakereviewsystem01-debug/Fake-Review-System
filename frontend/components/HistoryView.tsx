import React from 'react';
import { AnalysisHistoryItem } from '../types';
import {
  Calendar,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  history: AnalysisHistoryItem[];
}

const HistoryView: React.FC<Props> = ({ history }) => {
  // Empty State
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 px-4 text-center">
        <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mb-4 opacity-20" />

        <h3 className="text-lg sm:text-xl font-semibold mb-2">
          No History Yet
        </h3>

        <p className="text-sm sm:text-base">
          Run your first audit to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Audit History
        </h2>

        <p className="text-slate-400 text-sm sm:text-base mt-1">
          View previous fake review analysis reports.
        </p>
      </div>

      {/* History Cards */}
      <div className="grid grid-cols-1 gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 hover:border-primary-500/50 transition-colors"
          >
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-5">
              {/* Left Section */}
              <div className="min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h3 className="text-base sm:text-lg font-semibold text-white break-words">
                    {item.projectName}
                  </h3>

                  <span
                    className={`w-fit px-2 py-1 rounded text-xs font-medium ${
                      item.engine === 'GEMINI'
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : 'bg-green-500/20 text-green-300'
                    }`}
                  >
                    {item.engine}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleString()}
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase">
                    Reviews
                  </p>

                  <p className="font-bold text-white text-sm sm:text-base">
                    {item.reviewCount}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase">
                    Fakes
                  </p>

                  <p className="font-bold text-red-400 text-sm sm:text-base">
                    {item.fakeCount}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase">
                    Trust
                  </p>

                  <div className="flex items-center justify-center gap-1">
                    {item.trustScore > 70 ? (
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}

                    <span
                      className={`font-bold text-sm sm:text-base ${
                        item.trustScore > 70
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {item.trustScore}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="mt-4 pt-4 border-t border-slate-700/50">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                <span className="text-slate-500 font-medium">
                  Verdict:
                </span>{' '}
                {item.summary.genuineCount} genuine reviews found.
                True rating adjusted from{' '}
                <span className="text-white">
                  {Number(item.summary.originalAvgRating).toFixed(1)}
                </span>{' '}
                to{' '}
                <span className="text-amber-400 font-semibold">
                  {Number(item.summary.trueAvgRating).toFixed(1)}
                </span>
                .
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
