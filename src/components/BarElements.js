import React from 'react'

export default function BarElements({ height, isActive, isSwap, isComplete }) {

    const changeColour = () => {
        if (isComplete) {
            return 'bg-green-300'
        } else if (isActive) {
            return 'bg-red-300'
        } else if (isSwap) {
            return 'bg-orange-300'
        } else {
            return 'bg-white'
        }

    }


    return (
        <div className={`w-full ${changeColour()} border border-black`} style={{ "height": `${height}%`, }}></div>
    )
}