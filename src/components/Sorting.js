import React, { useState } from 'react'
import BarElements from './BarElements'

const generateArray = () => {
    const newArray = Array.from({ length: 100 }, (i, v) => v + 1)
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray
}


const mergeSort = (arr) => {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
};

const merge = (left, right) => {
    let result = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex]);
            leftIndex++;
        } else {
            result.push(right[rightIndex]);
            rightIndex++;
        }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
};

export default function Sorting() {
    const [sortArray, setSortArray] = useState(generateArray())
    const [sortAlgo, setSortAlgo] = useState('')
    const [speed, setSpeed] = useState(30)


    const handleSelect = (event) => {
        setSortAlgo(event.target.value)
    }

    const handleSpeed = (event) => {
        setSpeed(event.target.value)
    }

    function randomiseArray(arr) {
        console.log('2')
        const randomizedArr = [...arr];
        for (let i = randomizedArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [randomizedArr[i], randomizedArr[j]] = [randomizedArr[j], randomizedArr[i]];
        }
        setSortArray(randomizedArr)
    }

    const sortingArray = () => {
        const arr = [...sortArray];
        let i = 0

        switch (sortAlgo) {
            case 'selection':


                const selectInterval = setInterval(() => {
                    if (i < arr.length - 1) {
                        let minIndex = i;
                        for (let j = i + 1; j < arr.length; j++) {
                            if (arr[j] < arr[minIndex]) {
                                minIndex = j;
                            }
                        }
                        if (minIndex !== i) {
                            // Swap elements
                            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                        }
                        i++;

                        setSortArray(prevState => [...arr]);
                    } else {
                        clearInterval(selectInterval); // Stop the interval
                    }
                }, speed); // Delay between each step (in milliseconds)
                break;
            case 'merge':

                const sortedArray = mergeSort(arr);

                const mergeEnterval = setInterval(() => {
                    if (i < sortedArray.length) {
                        setSortArray(prevState => {
                            const newArray = [...prevState];
                            newArray[i] = sortedArray[i];
                            return newArray;
                        });
                        i++;
                    } else {
                        clearInterval(mergeEnterval);
                        console.log("Sorted array:", sortedArray);
                    }
                }, speed);
                break;

            case 'bubble':

                break;
            case 'quick':

                break;

            default:
                break;
        }
    }

    return (
        <div className='w-1/2 h-1/2 flex flex-col justify-center items-center gap-8'>
            <div className='bg-emerald-900 shadow-2xl shadow-slate-600 w-full h-full max-w-3xl max-h-xl flex items-end rounded-xl'>
                {sortArray.map((value, index) =>
                    <BarElements key={index} height={value} />
                )}
            </div>
            <div className='flex items-center justify-center gap-4'>
                <button className='w-fit h-fit p-3 bg-indigo-700 rounded-lg text-white'
                    onClick={() => randomiseArray(sortArray)}>
                    Randomise
                </button>
                <select name='sortSelect' value={sortAlgo} onChange={handleSelect} className='bg-transparent p-2 text-white'>
                    <option disabled value="">Select a sorting algorithm</option>
                    <option value="selection">Selection sort</option>
                    <option value="merge">Merge sort</option>
                    <option value="bubble">Bubble sort</option>
                    <option value="quick">Quick sort</option>
                </select>
                <button className='w-fit h-fit p-3 bg-indigo-700 rounded-lg text-white'
                    onClick={() => sortingArray()}>
                    Sort
                </button>
                <select name='sortSelect' value={sortAlgo} onChange={handleSpeed} className='bg-transparent p-2 text-white'>
                    <option value="50">Slow</option>
                    <option value="10">Fast</option>
                    <option value="100">Super slow</option>
                    <option value="1">Super fast</option>
                </select>

            </div>
        </div>
    )
}
