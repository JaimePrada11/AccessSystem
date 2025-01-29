import React from 'react'

export default function List({ children }) {
  return (
    <div className="flex flex-row flex-wrap gap-4 justify-center">
      {children.map((child, index) => (
        <div key={index} className=" flex flex-row items-center justify-center">
          {child}
        </div>
      ))}
    </div>
  );
}
