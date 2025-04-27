import React from "react";
import { motion } from "framer-motion";
import { Comic_Neue } from "next/font/google";

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function MenuBar({ editor }) {
  if (!editor) return null;

  const buttons = [
    {
      label: "Big Text",
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 }),
    },
    {
      label: "Bold",
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold"),
    },
    {
      label: "Slant",
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic"),
    },
    {
      label: "Cross",
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike"),
    },
    {
      label: "Left",
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" }),
    },
    {
      label: "Center",
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" }),
    },
    {
      label: "Right",
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" }),
    },
    {
      label: "Bullets",
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList"),
    },
    {
      label: "Numbers",
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList"),
    },
    {
      label: "Glow",
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight"),
    },
  ];

  return (
    <div
      className={`flex flex-wrap gap-1 sm:gap-2 p-2 sm:p-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-t-2xl shadow-md ${comicNeue.className}`}
    >
      {buttons.map((btn, index) => (
        <motion.button
          key={index}
          onClick={btn.onClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={`px-2 sm:px-3 py-1 bg-white text-purple-600 rounded-xl font-bold text-xs sm:text-sm shadow-sm hover:bg-yellow-200 transition-all ${
            btn.pressed ? "bg-yellow-300 text-purple-700" : ""
          } ${btn.pressed || editor.isActive(btn.label.toLowerCase()) ? "opacity-100" : "opacity-70"}`}
          disabled={!editor.can().chain().focus().run()}
          aria-label={btn.label}
        >
          {btn.label}
        </motion.button>
      ))}
    </div>
  );
}