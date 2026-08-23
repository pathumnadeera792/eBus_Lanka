import {use, useState} from "react";

export default function TestPage() {
    let [count, setCount] = useState(0); //react hook to create a state variable called count and a function called setCount to update the value of count. The initial value of count is set to 0.

    function increment() {
        setCount(count + 1);//setCount is a function that updates the value of count. It takes the current value of count and adds 1 to it, then sets the new value of count to the result.
    }

    function decrement() {
        setCount(count - 1);//setCount is a function that updates the value of count. It takes the current value of count and subtracts 1 from it, then sets the new value of count to the result.
    }



  return (
    <div className = " w-full h-screen bg-ye flex justify-center items-center">
      <div className = "w-[400px] h-[400px] bg-white flex flex-col justify-evenly items-center ">
        <h1 className="text-7xl font-bold">{count}</h1>
        <div className="w-full flex justify-center items-center h-[100px]">
        
        <button className="w-[100px] h-[45px]  hover:bg-red-700 bg-red-600 rounded-full mx-2 flex justify-center items-center text-white text-3xl font-bold" onClick={decrement}>
          -
        </button>
        <button className="w-[100px] h-[45px] hover:bg-blue-700 bg-blue-600 rounded-full mx-2  flex justify-center items-center text-white text-3xl font-bold" onClick={increment}>
          +
        </button>
        
        </div>
        
      </div>
    </div>
  )
}



