"use client";

import { useState } from "react";
import CustomSheet from "./sheet";

export default function SheetDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-black text-white rounded-lg cursor-pointer"
      >
        Open
      </button>

      <CustomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
