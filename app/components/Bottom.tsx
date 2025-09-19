import React from "react";

export default function Bottom() {
  return (
    <footer className="flex justify-between items-center border-t border-black-500 p-4 text-sm">
      <span>&copy; {new Date().getFullYear()} Hello Pet</span>

      <div className="space-x-4">
        <p className="hover:underline">Contact</p>
      </div>
    </footer>
  );
}
