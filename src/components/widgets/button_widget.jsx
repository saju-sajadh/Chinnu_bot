import { buttonClasses } from "@/libs/utils";
import Image from "next/image";
import React from "react";

function ButtonWidget(props) {
  return (
    <button
      className={`${buttonClasses} px-3 py-2 text-sm sm:text-base`}
      onClick={() => props.functionality(true)}
      aria-label={props.label}
    >
      <Image src={props.src} alt="quiz" width={20} height={20} loading="lazy" />
      {props.text}
    </button>
  );
}

export default ButtonWidget;
