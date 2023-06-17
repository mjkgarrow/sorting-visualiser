import React, { useState } from 'react'
import BarElements from './BarElements'

const generateArray = () => {
    const newArray = Array.from({ length: 100 }, (i, v) => { return { value: v + 1, isSwap: false, isActive: false, isComplete: false } })
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray
}


// const mergeSort = (arr) => {
//     if (arr.length <= 1) {
//         return arr;
//     }

//     const mid = Math.floor(arr.length / 2);
//     const left = arr.slice(0, mid);
//     const right = arr.slice(mid);

//     return merge(mergeSort(left), mergeSort(right));
// };

// const merge = (left, right) => {
//     let result = [];
//     let leftIndex = 0;
//     let rightIndex = 0;

//     while (leftIndex < left.length && rightIndex < right.length) {
//         if (left[leftIndex] < right[rightIndex]) {
//             result.push(left[leftIndex]);
//             leftIndex++;
//         } else {
//             result.push(right[rightIndex]);
//             rightIndex++;
//         }
//     }

//     return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
// };



export default function Sorting() {
    const [sortArray, setSortArray] = useState(generateArray())
    const [sortAlgo, setSortAlgo] = useState('')
    const [speed, setSpeed] = useState('')
    const [intervalId, setIntervalId] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [sortVars, setSortVars] = useState({ i: 0, j: 0, end: 100 })


    const resetSorting = () => {
        clearInterval(intervalId);
        setIsPaused(false);
        setSortVars({ i: 0, j: 0, end: 100 })
    };

    const pauseSorting = () => {
        clearInterval(intervalId);
        setIsPaused(true);
    };

    const resumeSorting = () => {
        setIsPaused(false);
        sortingArray(sortVars);
    };

    const handleSelect = (event) => {
        setSortAlgo(event.target.value)
    }

    const handleSpeed = (event) => {
        setSpeed(event.target.value)
    }

    const randomiseArray = () => {
        resetSorting()
        setSortArray(generateArray())
    }

    const bubbleSort = ({ i, j, end }) => {
        const arr = [...sortArray];
        const bubbleInterval = setInterval(() => {
            // If current index is not at end of array
            if (i < arr.length - 1) {

                // if the checking index is not at the second last element of array
                if (j < arr.length - i - 1) {
                    if (j > 0) {
                        arr[j].isSwap = false
                        arr[j - 1].isSwap = false
                        arr[j - 1].isActive = false
                        arr[j + 1].isSwap = false
                    }

                    arr[j].isActive = true
                    console.log(arr[j], arr[j + 1])

                    // if the checking value is larger than the next value, swap
                    if (arr[j].value > arr[j + 1].value) {
                        // Make swapped bar orange
                        arr[j].isSwap = true
                        arr[j + 1].isSwap = true

                        var temp = arr[j]
                        arr[j] = arr[j + 1]
                        arr[j + 1] = temp

                    }
                    // Iterate checking index
                    j++

                    // Set state
                    setSortArray([...arr])
                    setSortVars({ i, j, end })

                    // if check index is at the end, iterate the current index and revert checking index
                } else {
                    arr[end - 2].isSwap = false
                    arr[end - 2].isActive = false
                    arr[end - 1].isComplete = true
                    end = j
                    // arr[arr.length - i - 1].isComplete = true
                    i++
                    j = 0

                    setSortVars({ i, j, end })
                }
            } else {
                clearInterval(bubbleInterval)
            }
        }, speed)
        setIntervalId(bubbleInterval) // Store the interval ID
    }

    const sortingArray = () => {
        switch (sortAlgo) {
            // case 'selection':
            //     const selectInterval = setInterval(() => {
            //         if (i < arr.length - 1) {
            //             let minIndex = i
            //             for (let j = i + 1 j < arr.length j++) {
            //                 if (arr[j].value < arr[minIndex].value) {
            //                     minIndex = j
            //                     arr[j].isActive = true
            //                 }
            //             }
            //             if (minIndex !== i) {
            //                 // Swap elements
            //                 [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
            //                 arr[i].isSwap = true
            //                 arr[minIndex].isSwap = true
            //             }
            //             i++

            //             setSortArray(prevState => [...arr])
            //         } else {
            //             clearInterval(selectInterval)
            //         }
            //         // arr[i].isActive = false
            //     }, speed)
            //     break;
            // case 'merge':
            //     const sortedArray = mergeSort(arr);

            //     const mergeEnterval = setInterval(() => {
            //         if (i < sortedArray.length) {
            //             setSortArray(prevState => {
            //                 const newArray = [...prevState];
            //                 newArray[i] = sortedArray[i];
            //                 return newArray;
            //             });
            //             i++;
            //         } else {
            //             clearInterval(mergeEnterval);
            //             console.log("Sorted array:", sortedArray);
            //         }
            //     }, speed);
            //     break;
            case 'bubble':
                bubbleSort(sortVars)
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
                    <BarElements key={index} height={value.value} isSwap={value.isSwap} isActive={value.isActive} isComplete={value.isComplete} />
                )}
            </div>
            <div className='flex items-center justify-center gap-4'>
                <button className='w-fit h-fit p-3 bg-indigo-700 rounded-lg text-white'
                    onClick={() => randomiseArray(sortArray)}>
                    Reset
                </button>
                <select name='sortSelect' value={sortAlgo} onChange={handleSelect} className='bg-transparent p-2 text-white'>
                    <option disabled value="">Select sorting algorithm</option>
                    <option value="selection">Selection sort</option>
                    <option value="merge">Merge sort</option>
                    <option value="bubble">Bubble sort</option>
                    <option value="quick">Quick sort</option>
                </select>
                <select name='speedSelect' value={speed} onChange={handleSpeed} className='bg-transparent p-2 text-white'>
                    <option disabled value="">Select speed</option>
                    <option value="1000">Super slow</option>
                    <option value="50">Slow</option>
                    <option value="10">Fast</option>
                    <option value="0.1">Super fast</option>
                </select>
                <button className='w-fit h-fit p-3 bg-indigo-700 rounded-lg text-white'
                    onClick={() => sortingArray()}>
                    Sort
                </button>
                {isPaused ? (
                    <button className="w-fit h-fit p-3 bg-indigo-700 rounded-lg text-white" onClick={resumeSorting}>
                        Resume
                    </button>
                ) : (
                    <button className="w-fit h-fit p-3 bg-indigo-700 rounded-lg text-white" onClick={pauseSorting}>
                        Pause
                    </button>
                )}

            </div>
        </div>
    )
}
