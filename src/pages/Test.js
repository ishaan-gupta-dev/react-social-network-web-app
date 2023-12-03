import React from 'react';
import toast, { Toaster, useToaster } from 'react-hot-toast/headless';
import {primary} from 'react';
const Test = () => {

    const { toasts, handlers } = useToaster();
    const { startPause, endPause } = handlers;

    function handleClick() {
        toast('Hello World')
    }
    // const theme = React.createContext();

    // const { primary } = React.useContext(theme);
    // console.log(theme);
    return (
        <React.Fragment>
            <div>
                <h1>This is the Test page</h1>
                <div onMouseEnter={startPause} onMouseLeave={endPause}>
                    {toasts
                        .filter((toast) => toast.visible)
                        .map((toast) => (
                            <div key={toast.id} {...toast.ariaProps}>
                                {toast.message}
                            </div>
                        ))}
                </div>
            </div>
            <button onClick={handleClick}>Toast Hello world</button>
        </React.Fragment>
    )
}

export default Test;