import React from 'react'

export default function List({ children }) {
    return (
      <ul className="divide-y divide-gray-200 flex flex-col md:flex-row w-full justify-center flex-wrap gap-4">        
        {children}
      </ul>
    )
  }
  