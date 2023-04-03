// when it is toggle off, it is compeletely removed from the dom, when i
// click it back on, it is remounted and therefore it will run this window.innerWidth, which gives
// me the updated version of window width
// Because it is an event on the window, we cant do this:
//<h1 onResize={ }>Window width : {window.innerWidth}</h1>


import React from "react"

export default function WindowTracker() {
    
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth)
    
    React.useEffect(() => {
        function watchWidth() {
            console.log("Setting up...")
            setWindowWidth(window.innerWidth)
        }
        // we do this because event listener is something that could change on its own
        // and dont need the whole component render so it could render too
        // this event listener is register with the dom(browser) itself so even if i toggle off and try to
        // resize the window, we get this warning that tells us we cant update react state on
        // an unmounted component, so in the end what happends is window tracker is no longer a part of the dom
        // but the browser itself is still listening for resize event and try to set window width of an unmount component
        // this something called the memory lick and we dont want a memory lick.
        // the thing that you have to be aware of is when you are inerfacing with side effects using use effect is 
        // any potential consiquences that might happen if you dont clean up the things that you do with in that side effect
        //this is just one example where we were adding an event listener that is not getting cleaned up when this component unmounts
        window.addEventListener("resize", watchWidth)
        
        // to clean up the sied effect that created
        return function() {
            console.log("Cleaning up...")
            window.removeEventListener("resize", watchWidth)
        }
    }, [])// this use effect has no dependencies because because there is nothing inside of function to make me
    //re-register a new event listener and so it registers this event listener(window.addEventListener("resize", watchWidth))
    // on the resize event of the window and every time that i resize, it reacts to the event listener that setup and when i toggle off the
    // window tracker ReactJS reconises that this component is reached the end of its life cycle and it is about to be remove from the dom
    // and so it take the function that it recieves from us when it first setup our use effect and it just runs it, and it runs it blindly
    // it doesnt know what that function contains but we as the developers are expected to succesfully cleanup after our side effect
    
    return (
        <h1>Window width: {windowWidth}</h1>
    )
}


// Recap:
// Use effect takes two parameters, the first one is the effect you wanna run, the second one is any dependenccies that react should 
// watch changes in, to re-run your effect function, and that effect function is allowed to return another function that could 
// clean up after any side effects that might be lingering in case your component dies
// now for many effects that you setup you might find yourself not needing to provide a clean up function at all, in which case thats
// completely OK, that is not a required part of use effect fot it to work
