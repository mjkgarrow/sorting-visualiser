import React, { useState } from 'react'
import BarElements from './BarElements'

const arrayLength = 50

const normalisedHeight = (value) => {
    const normalisationFactor = 100 / arrayLength
    return Math.floor((value + 1) * normalisationFactor)
}

const generateArray = () => {
    const newArray = Array.from({ length: arrayLength }, (i, v) => { return { value: normalisedHeight(v), isSwap: false, isActive: false, isComplete: false } })
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray
}

const cleanVars = { i: 0, j: 0, end: arrayLength - 1, minIndex: 1, swapCounter: 0, checkCounter: 0, start: 0 }

export default function Sorting() {
    const [sortArray, setSortArray] = useState(generateArray())
    const [sortAlgo, setSortAlgo] = useState('')
    const [speed, setSpeed] = useState('')
    const [intervalId, setIntervalId] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [sortVars, setSortVars] = useState(cleanVars)
    const [run, setRun] = useState(false)


    const resetSorting = () => {
        clearInterval(intervalId);
        setSortArray(generateArray())
        setIsPaused(false);
        setSortVars(cleanVars)
        setRun(false)
        setSpeed('')
        setSortAlgo('')
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



    // BUBBLE SORT ALGORITHM
    const bubbleSort = ({ i, j, end, swapCounter, checkCounter }) => {
        const arr = [...sortArray];

        const bubbleInterval = setInterval(() => {

            // If current index is not at end of array
            if (i < arr.length - 1) {
                checkCounter++

                // if the checking index is not at the second last element of array
                if (j < arr.length - i - 1) {

                    // if the checking value is larger than the next value, swap
                    if (arr[j].value > arr[j + 1].value) {
                        var temp = arr[j]
                        arr[j] = arr[j + 1]
                        arr[j + 1] = temp
                        swapCounter++
                    }

                    // Iterate checking index
                    j++

                    // Update bar colours (j is current, j-1 is the swapped item)
                    arr[j].isActive = true
                    arr[j - 1].isActive = false
                    arr[j - 1].isSwap = true


                    // Set states
                    setSortArray([...arr])
                    setSortVars({ ...sortVars, i, j, end, swapCounter, checkCounter })


                    // if check index is at the end, iterate the current index and revert checking index
                } else {

                    // Set the final item to complete, clear active from second final
                    arr[end].isComplete = true
                    arr[end - 1].isActive = false

                    end = j
                    i++
                    j = 0

                    setSortVars({ ...sortVars, i, j, end, swapCounter, checkCounter })
                }
            } else {
                arr[end].isComplete = true
                arr[end - 1].isComplete = true
                clearInterval(bubbleInterval)
                setRun(false)
            }
        }, speed)

        setIntervalId(bubbleInterval) // Store the interval ID
    }

    // SELECTION SORT ALGORITHM
    const selectionSort = ({ i, j, minIndex, swapCounter, checkCounter }) => {
        const arr = [...sortArray];
        const selectionInterval = setInterval(() => {
            // If current index is not at the end of array
            if (i < arr.length - 1) {
                checkCounter++

                // Find the minimum element in the unsorted part of the array
                if (j < arr.length) {
                    if (j > 0) {
                        // arr[j].isSwap = false
                        // arr[j - 1].isSwap = false
                        arr[j - 1].isActive = false
                    }

                    arr[j].isActive = true;

                    if (arr[j].value < arr[minIndex].value) {
                        // Update the minimum index
                        minIndex = j;
                    }

                    j++;
                    setSortArray([...arr]);
                    setSortVars({ ...sortVars, i, j, minIndex, swapCounter, checkCounter });

                } else {
                    // Swap the minimum element with the current element
                    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                    swapCounter++

                    // Change bar colours
                    arr[i].isSwap = true;
                    arr[minIndex].isSwap = true;
                    arr[i].isComplete = true;
                    arr[j - 1].isActive = false;
                    arr[j - 1].isSwap = false;

                    // Increment the current index
                    i++;

                    // Reset the variables for the next iteration
                    j = i;
                    minIndex = i;

                    setSortArray([...arr]);
                    setSortVars({ ...sortVars, i, j, minIndex, swapCounter, checkCounter });
                }
            } else {
                arr[i].isComplete = true;
                clearInterval(selectionInterval);
                setRun(false);
            }
        }, speed);
        setIntervalId(selectionInterval); // Store the interval ID
    }

    // MERGE SORT ALGORITHM
    async function mergeSort(arr, { start, end, swapCounter, checkCounter }) {
        arr.forEach(item => item.isActive = false)

        checkCounter++

        if (isPaused) {
            console.log('break')
            return
        }

        if (start >= end) {
            return;
        }


        let mid = Math.floor((start + end) / 2);

        arr[mid].isActive = true

        console.log(checkCounter)
        await new Promise(resolve => setTimeout(resolve, speed));

        setSortArray(() => [...arr]);
        setSortVars({ ...sortVars, start, end, swapCounter, checkCounter });

        await mergeSort(arr, { start, end: mid, swapCounter, checkCounter }); // Sort the left half
        await mergeSort(arr, { start: mid + 1, end, swapCounter, checkCounter }); // Sort the right half


        let leftIndex = start;
        let rightIndex = mid + 1;

        while (leftIndex <= mid && rightIndex <= end) {
            await new Promise(resolve => setTimeout(resolve, speed));

            checkCounter++

            if (arr[leftIndex].value < arr[rightIndex].value) {
                leftIndex++;
            } else {
                const temp = arr[rightIndex];

                // Shift elements to the right
                for (let i = rightIndex; i > leftIndex; i--) {
                    arr[i - 1].isSwap = true;
                    arr[i].isSwap = true;
                    arr[i].isActive = false;

                    arr[i] = arr[i - 1];

                    swapCounter++

                    setSortArray(() => [...arr]);
                    setSortVars({ ...sortVars, start, end, swapCounter, checkCounter });
                }

                arr[leftIndex] = temp;

                leftIndex++;
                mid++;
                rightIndex++;
            }
            // console.log(checkCounter)
            setSortArray(() => [...arr]);
            setSortVars({ ...sortVars, start, end, swapCounter, checkCounter });
        }
    }

    const sortingArray = () => {
        switch (sortAlgo) {
            case 'selection':
                setRun(true)
                selectionSort(sortVars)
                break;
            case 'bubble':
                setRun(true)
                bubbleSort(sortVars)
                break;
            case 'merge':
                setRun(true)
                mergeSort(sortArray, sortVars)
                // mergeSort(sortArray, sortVars).then(() => {
                //     sortArray.forEach(item => item.isComplete = true)
                //     setSortArray(prev => [...prev])
                // })
                break;
            case 'quick':
                break;
            default:
                break;
        }
    }



    const buttonClass = "w-20 h-fit p-3 bg-emerald-700 rounded-lg text-white hover:bg-emerald-800"

    return (
        <div className='w-1/2 h-1/2 flex flex-col justify-center items-center gap-8'>
            <h1 className='text-white font-bold text-3xl'>Sorting Visualiser</h1>
            <div className='bg-emerald-900 shadow-2xl px-2 overflow-hidden shadow-slate-600 w-full h-full max-w-3xl max-h-xl flex items-end rounded-xl'>
                {sortArray.map((value, index) =>
                    <BarElements key={index} height={value.value} isSwap={value.isSwap} isActive={value.isActive} isComplete={value.isComplete} />
                )}
            </div>
            <div className='flex flex-col items-center justify-center gap-2'>
                <div className='flex items-center justify-center gap-4'>
                    <button className={buttonClass}
                        onClick={resetSorting}>
                        Reset
                    </button>
                    <select name='sortSelect' value={sortAlgo} onChange={handleSelect} className='bg-transparent p-2 text-white'>
                        <option disabled value="">Select sorting algorithm</option>
                        <option value="bubble">Bubble sort</option>
                        <option value="selection">Selection sort</option>
                        <option value="merge">Merge sort</option>
                        <option value="quick">Quick sort</option>
                    </select>
                    <select name='speedSelect' value={speed} onChange={handleSpeed} className='bg-transparent p-2 text-white'>
                        <option disabled value="">Select speed</option>
                        <option value="1000">Super slow</option>
                        <option value="50">Slow</option>
                        <option value="10">Fast</option>
                        <option value="0.1">Super fast</option>
                    </select>
                    {run ? isPaused ?
                        (
                            <button className={buttonClass} onClick={resumeSorting}>
                                Play
                            </button>
                        )
                        :
                        (
                            <button className={buttonClass} onClick={pauseSorting}>
                                Pause
                            </button>
                        )
                        :
                        (
                            <button
                                className={buttonClass}
                                onClick={() => sortingArray()}
                                disabled={run}>
                                Sort
                            </button>
                        )
                    }
                </div>
                <div className='flex items-center text-white gap-2'>
                    <div className='bg-red-300 w-2 h-2'></div><p className='mr-2'>Active item</p>
                    <div className='bg-orange-300 w-2 h-2'></div><p className='mr-2'>Swapped item</p>
                    <div className='bg-green-300 w-2 h-2'></div><p className='mr-2'>Sorted item</p>

                </div>
                <div className='flex items-center text-white gap-2'>

                    <p className='mr-2 font-bold text-lg'>Totals</p>
                    <p className='mr-2'>Swaps: {sortVars.swapCounter}</p>
                    <p className='mr-2'>Checks: {sortVars.checkCounter}</p>
                </div>
            </div>
        </div>
    )
}
