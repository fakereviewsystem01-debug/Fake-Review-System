import React from 'react';
import {
  Chrome,
  Copy,
  Check,
  Info,
} from 'lucide-react';

const ExtensionView: React.FC = () => {
  const [copiedManifest, setCopiedManifest] = React.useState(false);
  const [copiedContent, setCopiedContent] = React.useState(false);

  const manifestCode = `{
  "manifest_version": 3,
  "name": "Fake Review Detector",
  "version": "1.0",
  "description": "Analyze reviews on any webpage",
  "permissions": ["activeTab", "scripting"],
  "action": {
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}`;

  const contentScriptCode = `// content.js
// This script runs on the webpage
console.log("Fake Review Detector Active");

function extractReviews() {
  // Example selector for Amazon/Generic reviews
  const reviews = [];
  const reviewElements = document.querySelectorAll(
    '.review-text-content, .review, .comment'
  );

  reviewElements.forEach(el => {
    reviews.push(el.innerText);
  });

  return reviews;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.action === "scan") {
      const data = extractReviews();
      sendResponse({ reviews: data });
    }
  }
);`;

  const copyToClipboard = (
    text: string,
    setFn: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    navigator.clipboard.writeText(text);
    setFn(true);

    setTimeout(() => {
      setFn(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="bg-blue-600 p-2 rounded-lg w-fit">
          <Chrome className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Browser Extension
          </h2>

          <p className="text-slate-400 text-sm sm:text-base">
            Run the Fake Review System on any website.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 p-3 sm:p-4 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />

        <p className="text-xs sm:text-sm text-slate-300">
          Since this is a web application, you need to manually add the
          extension to Chrome in Developer Mode. Follow the instructions
          below to enable review analysis on Amazon, Yelp, and other sites.
        </p>
      </div>

      {/* Code Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Manifest Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h3 className="font-semibold text-white text-sm sm:text-base">
              1. Create manifest.json
            </h3>

            <button
              onClick={() =>
                copyToClipboard(manifestCode, setCopiedManifest)
              }
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded flex items-center gap-2 transition-colors w-fit"
            >
              {copiedManifest ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs font-mono text-slate-400 overflow-x-auto whitespace-pre">
            {manifestCode}
          </pre>
        </div>

        {/* Content Script Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h3 className="font-semibold text-white text-sm sm:text-base">
              2. Create content.js
            </h3>

            <button
              onClick={() =>
                copyToClipboard(contentScriptCode, setCopiedContent)
              }
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded flex items-center gap-2 transition-colors w-fit"
            >
              {copiedContent ? (
                <>
                  <Check className="w-3 h-3 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>

          <pre className="bg-slate-950 p-3 sm:p-4 rounded-lg text-[10px] sm:text-xs font-mono text-slate-400 overflow-x-auto whitespace-pre">
            {contentScriptCode}
          </pre>
        </div>
      </div>

      {/* Installation Instructions */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-6">
        <h3 className="font-semibold text-white mb-4 text-sm sm:text-base">
          Installation Instructions
        </h3>

        <ol className="list-decimal pl-5 space-y-3 text-slate-300 text-xs sm:text-sm">
          <li>
            Create a folder named{' '}
            <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">
              fake-review-extension
            </code>{' '}
            on your computer.
          </li>

          <li>
            Create two files inside it:
            {' '}
            <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">
              manifest.json
            </code>
            {' '}and{' '}
            <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">
              content.js
            </code>
            .
          </li>

          <li>
            Open Google Chrome and navigate to{' '}
            <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">
              chrome://extensions
            </code>
            .
          </li>

          <li>
            Enable <strong>Developer Mode</strong> from the top-right corner.
          </li>

          <li>
            Click <strong>Load unpacked</strong> and select your extension
            folder.
          </li>

          <li>
            The extension is now active. Open DevTools on any webpage and
            check the Console tab to see:
            {' '}
            <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200">
              Fake Review Detector Active
            </code>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default ExtensionView;
