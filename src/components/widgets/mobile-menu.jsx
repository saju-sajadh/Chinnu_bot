"use client";

import Image from "next/image";
import { useState } from "react";

export function MobileMenu({ menuItems }) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <input
        type="checkbox"
        className="absolute w-16 h-16 opacity-0 z-10 cursor-pointer"
        checked={checked}
        onChange={() => setChecked(!checked)}
      />

      <span
        className={`absolute flex items-center justify-center w-11 h-11 rounded-full bg-white text-black text-3xl font-bold shadow-md transition-all duration-300 ease-in-out ${
          checked ? "scale-95 bg-white shadow-none" : ""
        }`}
      >
        {checked ? (
          <Image src={"/logos/menu.png"} alt="" fill className="" />
        ) : (
          <Image src={"/logos/menu.png"} alt="" fill className="" />
        )}
      </span>

      {menuItems.map((item, index) => {
        let translation;
        let delay;
        if (index == 0) {
          translation = "translate-y-[-60px]";
          delay = "delay-100";
        } else if (index == 1) {
          translation = "translate-y-[-120px]";
          delay = "delay-200";
        } else if (index == 2) {
          translation = "translate-y-[-180px]";
          delay = "delay-300";
        } else {
          translation = "translate-y-[-240px]";
          delay = "delay-400";
        }

        return (
          <div className="flex absolute left-1 gap-2">
            <button
              key={index}
              onClick={item.action}
              className={`flex justify-center items-center w-10 h-10 rounded-full bg-white border-2 border-white/95 text-yellow-400 font-bold transition-all duration-300 shadow-md ${
                checked ? `${translation} ${delay}` : "shadow-none translate-y-0"
              }`}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={28}
                height={28}
                className=""
              />
            </button>
            <div className={`${checked ? `${translation} ${delay} mt-2 px-2 bg-white text-sm rounded fllex justify-center items-center h-1/2` : "shadow-none translate-y-0 hidden"}`}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}
