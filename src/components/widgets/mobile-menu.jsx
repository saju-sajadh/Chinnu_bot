"use client";

import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";


export function MobileMenu({menuItems}) {
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
        className={`absolute flex items-center justify-center w-11 h-11 rounded-full bg-yellow-400 border-2 border-black text-black text-3xl font-bold shadow-md transition-all duration-300 ease-in-out ${
          checked ? "scale-95 bg-yellow-300 shadow-none" : ""
        }`}
      >
        {checked ? (
          <MenuOutlined className="!text-sm" />
        ) : (
          <CloseOutlined className="!text-sm" />
        )}
      </span>

      {menuItems.map((item, index) => {
        const translateY = `translate-y-[-${70 * (index + 1)}px]`;
        const delay = `delay-${100 * (index + 1)}`;

        return (
          <button
            key={item.label} 
            className={`absolute flex justify-center items-center w-10 h-10 rounded-full bg-yellow-400 border-2 border-yellow-400 text-yellow-400 font-bold transition-all duration-300 shadow-md ${
              checked ? `${translateY} ${delay}` : "shadow-none translate-y-0"
            }`}
            onClick={item.action} 
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={28}
              height={28}
              className=""
            />
          </button>
        );
      })}
    </div>
  );
}