import React, { useState } from "react";
import Image from "next/image";
import MetricCard from "./MetricCard";

interface IntroScreenProps {
  onStart: () => void;
  initialValues?: {
    soilMoisture: number;
    temperature: number;
    rainfall: number;
    cropHealth: number;
  };
  isLoading?: boolean;
}

export default function IntroScreen({
  onStart,
  initialValues,
  isLoading = false,
}: IntroScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [step, setStep] = useState(0);

  const handleStart = () => {
    setIsFadingOut(true);
    // Delay the actual start to allow fade animation to complete
    setTimeout(() => {
      onStart();
    }, 500); // 500ms fade duration
  };

  console.log("initialValues", initialValues?.cropHealth);

  return (
    <>
      {step === 0 && (
        <div
          className={`h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/assets/intro-bg.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "contain", zIndex: 2 }}
          />
          <Image
            src="/assets/background-grass.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "cover", zIndex: 1 }}
          />
          <Image
            src="/assets/farmatro-logo.png"
            alt="Background"
            width={1983}
            height={1388}
            className="w-[780px]"
            style={{
              objectFit: "contain",
              zIndex: 10,
              aspectRatio: 1983 / 1388,
            }}
          />

          <button
            onClick={() => setStep((c) => c + 1)}
            className="bg-[#fdc803] z-10 text-[#653200] text-2xl font-bold py-4 px-6 rounded-[24px] hover:scale-105 transition-all transform border-6 border-[#653200] hover:brightness-105 duration-300 cursor-pointer"
          >
            New Game
          </button>
        </div>
      )}
      {step === 1 && (
        <div
          onClick={() => setStep((c) => c + 1)}
          className={`h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/assets/stage-1.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "contain", zIndex: 2 }}
          />

          <Image
            src="/assets/background-grass.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "cover", zIndex: 1 }}
          />
        </div>
      )}

      {step === 2 && (
        <div
          onClick={() => setStep((c) => c + 1)}
          className={`h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/assets/intro-bg.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "contain", zIndex: 2 }}
          />
          <Image
            src="/assets/background-grass.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "cover", zIndex: 1 }}
          />

          <div className="z-50 flex flex-col w-full h-full self-center justify-end items-center">
            <Image
              src="/assets/1.png"
              alt="Farm Table"
              width={450}
              height={100}
              // className={`absolute bottom-0 -right-[50px] z-50 duration-500`}
              style={{ objectFit: "contain" }}
            />

            <div className="w-full  flex flex-col ">
              <div className="bg-[#FFD589] rounded-t-[24px] p-4 relative h-[200px] pt-12 pl-10 flex flex-col">
                <div className="bg-[#E9A311] rounded-[24px] py-2 px-6 text-[#4E2C0A] text-2xl font-bold absolute top-[-25px] left-[20%] border-4 border-[#4E2C0A]">
                  Claudio
                </div>

                <div className=" text-[#4E2C0A] text-lg font-medium absolute top-[25px] right-[10%] ">
                  Skip
                </div>

                <div className="flex flex-1 flex-col gap-2 justify-start max-w-5xl pt-4 mx-auto">
                  <span className="text-[#4E2C0A] font-medium text-lg">
                    Well, hello there! You must be my good friend&apos;s
                    son/daughter. It&apos;s a pleasure to finally meet you. My
                    name is Claudio.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div
          onClick={() => setStep((c) => c + 1)}
          className={`h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/assets/intro-bg.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "contain", zIndex: 2 }}
          />
          <Image
            src="/assets/background-grass.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "cover", zIndex: 1 }}
          />

          <div className="z-50 flex flex-col w-full h-full self-center justify-end items-center">
            <Image
              src="/assets/3.png"
              alt="Farm Table"
              width={450}
              height={100}
              // className={`absolute bottom-0 -right-[50px] z-50 duration-500`}
              style={{ objectFit: "contain" }}
            />

            <div className="w-full  flex flex-col ">
              <div className="bg-[#FFD589] rounded-t-[24px] p-4 relative h-[200px] pt-12 pl-10 flex flex-col">
                <div className="bg-[#E9A311] rounded-[24px] py-2 px-6 text-[#4E2C0A] text-2xl font-bold absolute top-[-25px] left-[20%] border-4 border-[#4E2C0A]">
                  Claudio
                </div>

                <div className=" text-[#4E2C0A] text-lg font-medium absolute top-[25px] right-[10%] ">
                  Skip
                </div>

                <div className="flex flex-1 flex-col gap-2 justify-start max-w-5xl pt-4 mx-auto">
                  <span className="text-[#4E2C0A] font-medium text-lg">
                    Your father... he loved this farm more than anything. He
                    would be so proud to see you here, ready to carry on his
                    legacy. He was the best at &apos;reading&apos; the weather
                    and the land. But times are changing, the climate&apos;s
                    getting more unpredictable. Sometimes, our old ways alone
                    aren&apos;t enough.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div
          onClick={() => setStep((c) => c + 1)}
          className={`h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/assets/intro-bg.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "contain", zIndex: 2 }}
          />
          <Image
            src="/assets/background-grass.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "cover", zIndex: 1 }}
          />

          <Image
            src="/assets/phone-bg.png"
            alt="Farm Table"
            width={450}
            height={100}
            // className={`absolute bottom-0 -right-[50px] z-50 duration-500`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 2,
              position: "absolute",
              top: "0",
              left: "0",
            }}
          />

          <div className="z-50 flex flex-col w-full h-full self-center justify-end items-center">
            <Image
              src="/assets/1.png"
              alt="Farm Table"
              width={450}
              height={100}
              // className={`absolute bottom-0 -right-[50px] z-50 duration-500`}
              style={{ objectFit: "contain", alignSelf: "flex-end" }}
            />

            <div className="w-full  flex flex-col ">
              <div className="bg-[#FFD589] rounded-t-[24px] p-4 relative h-[200px] pt-12 pl-10 flex flex-col">
                <div className="bg-[#E9A311] rounded-[24px] py-2 px-6 text-[#4E2C0A] text-2xl font-bold absolute top-[-25px] left-[20%] border-4 border-[#4E2C0A]">
                  Claudio
                </div>

                <div className=" text-[#4E2C0A] text-lg font-medium absolute top-[25px] right-[10%] ">
                  Skip
                </div>

                <div className="flex flex-1 flex-col gap-2 justify-start max-w-5xl pt-4 mx-auto">
                  <span className="text-[#4E2C0A] font-medium text-lg">
                    That&apos;s why I brought this. It&apos;s called the
                    &apos;Agro-Sat.&apos; A tool we got through a pilot program
                    with the space agency, NASA. It&apos;s our &apos;direct
                    line&apos; to the satellites watching over the Earth.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 5 && (
        <div
          onClick={() => setStep((c) => c + 1)}
          className={`h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/assets/intro-bg.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "contain", zIndex: 2 }}
          />
          <Image
            src="/assets/background-grass.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "cover", zIndex: 1 }}
          />

          <Image
            src="/assets/phone-bg.png"
            alt="Farm Table"
            width={450}
            height={100}
            // className={`absolute bottom-0 -right-[50px] z-50 duration-500`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 2,
              position: "absolute",
              top: "0",
              left: "0",
            }}
          />

          <div className="z-50 flex flex-col w-full h-full self-center justify-end items-center">
            <Image
              src="/assets/4.png"
              alt="Farm Table"
              width={450}
              height={100}
              // className={`absolute bottom-0 -right-[50px] z-50 duration-500`}
              style={{ objectFit: "contain", alignSelf: "flex-end" }}
            />

            <div className="w-full  flex flex-col ">
              <div className="bg-[#FFD589] rounded-t-[24px] p-4 relative h-[200px] pt-12 pl-10 flex flex-col">
                <div className="bg-[#E9A311] rounded-[24px] py-2 px-6 text-[#4E2C0A] text-2xl font-bold absolute top-[-25px] left-[20%] border-4 border-[#4E2C0A]">
                  Claudio
                </div>

                <div className=" text-[#4E2C0A] text-lg font-medium absolute top-[25px] right-[10%] ">
                  Skip
                </div>

                <div className="flex flex-1 flex-col gap-2 justify-start max-w-5xl pt-4 mx-auto">
                  <span className="text-[#4E2C0A] font-medium text-lg">
                    But to get it working, the first thing we need to do is
                    calibrate it. It needs to know the exact spot of your land
                    to pull the right data from up there. It&apos;s what they
                    call precision agriculture.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 6 && (
        <div
          className={`h-screen w-screen flex flex-col items-center justify-center transition-opacity duration-1000 ${
            isFadingOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src="/assets/intro-bg.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "contain", zIndex: 2 }}
          />
          <Image
            src="/assets/background-grass.png"
            alt="Background"
            width={5960}
            height={4238}
            className="absolute top-0 left-right w-full h-full"
            style={{ objectFit: "cover", zIndex: 1 }}
          />

          <div className="z-10 w-full h-full flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <div
                className="max-w-4xl w-full relative flex flex-col items-center justify-center gap-4 px-[130px]"
                style={{
                  aspectRatio: 2750 / 1760,
                }}
              >
                <Image
                  src="/assets/landscape-phone-bg.png"
                  alt="Farm Table"
                  width={2750}
                  height={1760}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />

                <div className="flex flex-col items-center justify-center">
                  <span className="z-10 text-[42px] font-bold text-[#ffffff]">
                    Game Start
                  </span>

                  <span className="z-10 text-[24px] font-semibold text-[#ffffff] opacity-90">
                    This is Nasa&apos;s report for your location
                  </span>
                </div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center gap-4 z-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <span className="text-white text-lg font-medium">
                      Loading NASA data...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-row gap-4 z-10 items-center justify-center">
                      <MetricCard
                        icon="🌱"
                        label="Crop Health"
                        value={initialValues?.cropHealth?.toString() || "0.2"}
                        bgGradient="bg-green-700"
                        iconBg="bg-green-900"
                        explanation="Crop Health Index uses satellite imagery to measure plant health and density. Values range from -1 to 1, with higher values indicating healthier vegetation."
                      />
                      <MetricCard
                        icon="💧"
                        label="Moisture"
                        value={initialValues?.soilMoisture?.toString() || "45"}
                        bgGradient="bg-blue-700"
                        iconBg="bg-blue-900"
                        explanation="Soil Moisture indicates the water content in your soil. Optimal levels are crucial for crop growth - too little causes drought stress, too much can lead to root problems."
                      />
                    </div>

                    <div className="flex flex-row gap-4 z-10">
                      <MetricCard
                        icon="🌡️"
                        label="Temp."
                        value={initialValues?.temperature?.toString() || "28"}
                        bgGradient="bg-orange-700"
                        iconBg="bg-orange-900"
                        explanation="Weather Temperature affects crop growth rates, water needs, and pest activity. Different crops have optimal temperature ranges for growth and development."
                      />

                      <MetricCard
                        icon="🌧️"
                        label="Rainfall"
                        value={initialValues?.rainfall?.toString() || "0"}
                        bgGradient="bg-cyan-700"
                        iconBg="bg-cyan-900"
                        explanation="Rainfall Forecast predicts upcoming precipitation. This NASA data helps you plan irrigation schedules and avoid overwatering when rain is expected."
                      />
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleStart}
                className="bg-[#fdc803] z-10 text-[#653200] text-2xl font-bold py-4 px-6 rounded-[24px] hover:scale-105 transition-all transform border-6 border-[#653200] hover:brightness-105 duration-300 cursor-pointer"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
