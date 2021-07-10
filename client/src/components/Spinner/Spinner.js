import React from 'react';

import './Spinner.css';

const Spinner = () => {
    return (
        <div className="spinnerDiv">
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default Spinner;
