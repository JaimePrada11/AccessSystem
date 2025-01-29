import React from 'react'

export default function List({ children }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-4">
      {children.map((child, index) => (
        <li key={index} className="w-full md:w-[45%] md:flex md:flex-wrap">
          {child}
        </li>
      ))}
    </ul>
  );
}

