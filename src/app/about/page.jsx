"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "antd";
import { Sour_Gummy } from "next/font/google";

const sourGummy = Sour_Gummy({
    subsets: ["latin"],
    weights: [400, 500, 700],
    display: "swap",
  });

export default function AboutPage() {
  const { Title, Paragraph } = Typography;

  return (
    <div
      className="h-screen w-full bg-[#f8f7f6] flex flex-col items-center justify-between pt-6 pb-3 px-3 overflow-y-auto"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div className="w-full max-w-lg text-center">
        {/* Logo and Title */}
        <div className="flex justify-center mb-6">
          <h1 className="text-3xl  flex items-center">
            <Image
              src="/logos/xai-logo.png"
              alt="Siddha Logo"
              width={55}
              height={55}
              priority
            />
            <div className="flex flex-col">
            <span className="ml-2 font-bold">Siddha</span>
            <span className={`ml-2 text-sm italic ${sourGummy.className}`}>Your AI Companion</span>
            </div>
          </h1>
        </div>

        {/* About Title */}
        <Title level={2} className="mb-4 text-2xl md:text-3xl">
          About the Chinmaya Vision Programme
        </Title>

        {/* Description Paragraphs */}
        <Paragraph className="text-gray-700 text-base md:text-lg mb-6 text-justify">
          The <strong>Chinmaya Vision Programme (CVP)</strong> is a
          comprehensive educational framework designed for schools, focusing on
          the holistic development of the child. At its core, CVP integrates the
          best of Indian culture, universal outlook, patriotism, and integrated
          development to nurture well-rounded individuals.
        </Paragraph>
        <Paragraph className="text-gray-700 text-base md:text-lg mb-6 text-justify">
          The child is the focal point of this programme, supported by the
          school management, teachers, and parents. Through their collective
          efforts, the light of this vision spreads to society, the country, and
          the world at large, fostering values that create global citizens with
          deep roots in cultural heritage.
        </Paragraph>

        {/* Chinmaya Vision Programme Image */}
        <div className="mb-8 w-full flex justify-center items-center">
          <Image
            src="/logos/cvp1.jpg"
            alt="Chinmaya Vision Programme"
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
            priority
          />
        </div>
      </div>
      <div className="text-sm lg:text-base w-full">
          <img
            src="/logos/techosa.png"
            alt="Powered by Techosa"
            className="h-6 lg:h-8"
          />
        </div>
    </div>
  );
}