import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { ArrowUp } from "lucide-react";
import { Penalty } from "@/types/game";

interface MetricRange {
  min: number;
  max: number;
  idealMin: number;
  idealMax: number;
}

const METRIC_RANGES: Record<string, MetricRange> = {
  soilPH: { min: 0, max: 14, idealMin: 6, idealMax: 7 },
  cropHealth: { min: -1, max: 1, idealMin: 0.3, idealMax: 1 },
  soilMoisture: { min: 0, max: 100, idealMin: 30, idealMax: 70 },
  temperature: { min: -10, max: 50, idealMin: 15, idealMax: 30 },
  rainfall: { min: 0, max: 200, idealMin: 10, idealMax: 50 },
};

interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  bgGradient: string;
  iconBg: string;
  explanation: string;
  // Optional props for showing changes
  updatedValue?: string | number;
  // Force animation for scenario autoEffects
  forceAnimation?: boolean;
  // Direction for forced animation (true = increase, false = decrease)
  forceAnimationDirection?: boolean;
  // Penalty system
  penalties?: Penalty[];
  metricKey?:
    | "soilMoisture"
    | "soilPH"
    | "productivityIndex"
    | "sustainability"
    | "cropHealth"
    | "temperature"
    | "rainfall";
  showSustainabilityAlert?: boolean;
  shouldRenderAnimation?: boolean;
  hideProgressBar?: boolean;
}

export default function MetricCard({
  icon,
  label,
  value,
  bgGradient,
  iconBg,
  explanation,
  updatedValue,
  forceAnimation = false,
  forceAnimationDirection = true,
  penalties = [],
  metricKey,
  showSustainabilityAlert = false,
  shouldRenderAnimation = false,
  hideProgressBar = false,
}: MetricCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  const currentNum =
    typeof value === "string"
      ? parseFloat(value.replace(/[^\d.-]/g, ""))
      : value;
  const updatedNum =
    typeof updatedValue === "string"
      ? parseFloat(updatedValue.replace(/[^\d.-]/g, ""))
      : updatedValue;

  // Filter penalties for this specific metric
  const relevantPenalties = penalties.filter(
    (penalty) => penalty.metric === metricKey
  );

  // Get metric range for progress bar
  const range = metricKey ? METRIC_RANGES[metricKey] : null;

  // Calculate progress bar values
  const getProgressBarData = () => {
    if (!range || !metricKey) return null;

    const currentValue = currentNum;
    const totalRange = range.max - range.min;
    const currentPosition = ((currentValue - range.min) / totalRange) * 100;
    const idealStart = ((range.idealMin - range.min) / totalRange) * 100;
    const idealEnd = ((range.idealMax - range.min) / totalRange) * 100;

    return {
      currentPosition: Math.max(0, Math.min(100, currentPosition)),
      idealStart: Math.max(0, Math.min(100, idealStart)),
      idealEnd: Math.max(0, Math.min(100, idealEnd)),
    };
  };

  const progressData = getProgressBarData();

  useEffect(() => {
    if (value !== prevValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      setPrevValue(value);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`${bgGradient} rounded-2xl p-3 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-black/30 w-full cursor-help ${
            shouldRenderAnimation &&
            (forceAnimation || (!!updatedNum && currentNum !== updatedNum))
              ? "animate-pulse"
              : ""
          }`}
          style={{
            animationDuration:
              shouldRenderAnimation &&
              (forceAnimation || (!!updatedNum && currentNum !== updatedNum))
                ? "0.75s"
                : undefined,
          }}
        >
          <div className="flex flex-row items-center gap-1.5">
            <div
              className={`${iconBg} w-12 h-12 flex items-center justify-center rounded-full p-2 shadow-md relative`}
            >
              <span
                className="text-2xl text-white"
                role="img"
                aria-label={label}
              >
                {icon}
              </span>
              {shouldRenderAnimation &&
                (forceAnimation ||
                  (!!updatedNum && currentNum !== updatedNum)) && (
                  <ArrowUp
                    size={20}
                    color={
                      forceAnimation
                        ? forceAnimationDirection
                          ? "#01ff23"
                          : "#ff0000"
                        : updatedNum && updatedNum > currentNum
                        ? "#01ff23"
                        : "#ff0000"
                    }
                    strokeWidth={4}
                    className={`absolute bottom-0 left-0 ${
                      forceAnimation
                        ? forceAnimationDirection
                          ? "rotate-0"
                          : "rotate-180"
                        : updatedNum && updatedNum > currentNum
                        ? "rotate-0"
                        : "rotate-180"
                    }`}
                  />
                )}
            </div>
            <p className="text-[14px] font-bold text-white/90 uppercase tracking-wide">
              {label}
            </p>
            <div className="ml-auto flex items-center gap-2">
              {!!updatedValue && (
                <div className="flex flex-row items-center">
                  {/* <span className="text-sm text-white/70">{value}</span>
                  <span className="text-lg">↓</span> */}
                  <span className="text-[18px] font-black text-white">
                    {updatedValue}
                  </span>
                </div>
              )}
              {!updatedValue && (
                <p
                  className={`text-[18px] font-black text-white transition-all duration-300 ${
                    isAnimating ? "scale-110" : ""
                  }`}
                >
                  {value}
                </p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {progressData && !hideProgressBar && (
            <div className="mt-3">
              <div className="relative h-2 bg-gray-300/30 rounded-full overflow-hidden">
                {/* Ideal range background */}
                <div
                  className="absolute h-full bg-green-400/60 rounded-full"
                  style={{
                    left: `${progressData.idealStart}%`,
                    width: `${
                      progressData.idealEnd - progressData.idealStart
                    }%`,
                  }}
                />

                {/* Current value arrow */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-white shadow-lg"
                  style={{ left: `${progressData.currentPosition}%` }}
                >
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-white"></div>
                </div>
              </div>

              {/* Range labels */}
            </div>
          )}

          {/* Penalty Badges */}
          {relevantPenalties.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-red-600/80 border border-red-400 rounded-full px-2 py-1 text-xs font-bold text-white flex items-center gap-1 animate-pulse">
                    <span>⚠️</span>
                    <span>{relevantPenalties[0].title}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs bg-red-900 text-white border border-red-600 shadow-lg"
                  sideOffset={8}
                  arrowBackground="bg-red-900"
                  arrowFill="fill-red-900"
                >
                  <div className="font-semibold mb-1 text-[16px]">
                    {relevantPenalties[0].title}
                  </div>
                  <div className="text-[14px] leading-relaxed text-red-100">
                    {relevantPenalties[0].description}
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Sustainability Alert Badge */}
          {showSustainabilityAlert && (
            <div className="mt-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-orange-600/80 border border-orange-400 rounded-full px-2 py-1 text-xs font-bold text-white flex items-center gap-1 animate-pulse">
                    <span>⚠️</span>
                    <span>Sustainability Affected</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-xs bg-orange-900 text-white border border-orange-600 shadow-lg"
                  sideOffset={8}
                  arrowBackground="bg-orange-900"
                  arrowFill="fill-orange-900"
                >
                  <div className="font-semibold mb-1 text-[16px]">
                    Sustainability Impact
                  </div>
                  <div className="text-[14px] leading-relaxed text-orange-100">
                    Active penalties are reducing your sustainability score each
                    turn. Fix the underlying issues to stop the decline.
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs bg-white text-black border shadow-lg"
        sideOffset={8}
      >
        <TooltipArrow className="fill-black" />

        <div className="font-semibold mb-1 text-[16px]">
          {label === "Temp." ? "Temperature" : label}
        </div>
        <div className="text-[14px] leading-relaxed text-gray-700">
          {explanation}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
