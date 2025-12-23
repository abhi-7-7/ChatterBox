// src/pages/Dashboard/AnalyticsSkeleton.jsx
// Skeleton loader that matches Analytics layout for smooth loading experience

import React from "react";

export default function AnalyticsSkeleton({ currentTheme }) {
  return (
    <div
      className={`${currentTheme.cardBg} border ${currentTheme.border} 
        p-8 rounded-2xl shadow-sm`}
    >
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Trend Pills Skeleton */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100/50 dark:bg-gray-700/30 border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-9 h-9 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-1"></div>
              <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100/50 dark:bg-gray-700/30 border border-gray-200/50 dark:border-gray-700/50">
            <div className="w-9 h-9 bg-gray-300 dark:bg-gray-600 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-1"></div>
              <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex gap-6 ml-auto opacity-40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Insight Summary Skeleton */}
      <div className={`mb-6 p-4 rounded-lg ${currentTheme.glassBg} border ${currentTheme.border}`}>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Chart Area Skeleton */}
      <div className="relative">
        {/* Y-axis labels (muted) */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-300 dark:text-gray-600 pr-4 opacity-50">
          <span>800</span>
          <span>600</span>
          <span>400</span>
          <span>200</span>
          <span>0</span>
        </div>

        {/* Chart Container with Skeleton Bars */}
        <div className="ml-12 h-64 relative">
          {/* Grid lines (faded) */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-30">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200 dark:border-gray-700"></div>
            ))}
          </div>

          {/* Skeleton Bars */}
          <div className="absolute inset-0 flex items-end justify-around gap-1">
            {[...Array(7)].map((_, index) => {
              const heights = [65, 75, 58, 82, 72, 78, 85];
              return (
                <div
                  key={index}
                  className="flex-1 relative h-full flex flex-col justify-end items-center group"
                >
                  {/* Faded bar */}
                  <div
                    className="w-full bg-gradient-to-t from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-500 rounded-t-md opacity-30 animate-pulse shadow-sm"
                    style={{ height: `${heights[index]}%` }}
                  ></div>

                  {/* Muted dots */}
                  <div
                    className="absolute w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white shadow-lg opacity-40"
                    style={{ bottom: `${heights[index] * 0.6}%` }}
                  ></div>
                  <div
                    className="absolute w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white shadow-lg opacity-40"
                    style={{ bottom: `${heights[index] * 0.5}%` }}
                  ></div>

                  {/* Day label (faded) */}
                  <span className={`text-xs ${currentTheme.textSecondary} mt-2 opacity-40`}>
                    {["M", "T", "W", "T", "F", "S", "S"][index]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend Skeleton */}
      <div className={`mt-6 flex flex-wrap gap-6 pt-4 border-t ${currentTheme.border} opacity-40`}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="ml-auto h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>

      {/* Loading Text */}
      <div className="mt-6 text-center">
        <p className={`text-sm ${currentTheme.textSecondary} opacity-60 animate-pulse`}>
          Fetching insights…
        </p>
      </div>
    </div>
  );
}
