import React from 'react'

export default function BarElements({ height }) {
    return (
        <div className={`w-3 bg-white border`} style={{ "height": `${height}%` }}></div>
    )
}