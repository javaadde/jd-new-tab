 import { useState, useEffect } from "react"

function Clock(){

    const [time, setTime] = useState(new Date())

    useEffect( () => {

       const intervalId = setInterval(()=>{
           setTime(new Date())
       }, 1000)

       console.log('mounted');
       

       return () => {
           clearInterval(intervalId)
           console.log('unmounted');
       }

    }, [])


    function formateTime(){
       let hours = time.getHours();
       const minutes = time.getMinutes();
       const seconds = time.getSeconds();
    //    const merediem = hours >= 12 ? "Pm" : "Am";

       hours = hours % 12 || 12

       return `${setZero(hours)} : ${setZero(minutes)} : ${setZero(seconds)} `
    }

    function setZero(number){
        return((number < 10 ? '0' : '') + number )
    }

    return(
         <div className="mb-12">
            <span className="text-6xl">{formateTime()}</span>
        </div>
    )
}


export default Clock