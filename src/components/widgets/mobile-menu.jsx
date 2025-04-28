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
        let translation;
        if (index == 0) {
          translation = "translate-y-[-70px] delay-100";
        } else if (index == 1) {
          translation = "translate-y-[-140px] delay-200";
        } else if (index == 2) {
          translation = "translate-y-[-210px] delay-300";
        } else {
            translation = "translate-y-[-280px] delay-400";
        }

        return (
          <button
            key={index}
            className={`absolute flex justify-center items-center w-10 h-10 rounded-full bg-yellow-400 border-2 border-yellow-400 text-yellow-400 font-bold transition-all duration-300 shadow-md ${
              checked
                ? `${translation}`
                : "shadow-none translate-y-0"
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
        );
      })}
    </div>
  );
}
