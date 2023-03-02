import React, { useState, useEffect } from "react";

const GasComponent = () => {
    const [NetworkGasPrice, setNetworkGasPrice] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetch("/api/gasprice")
                .then((response) => response.json())
                .then((data) => {
                    setNetworkGasPrice((prevGasPrice) => {
                        if (prevGasPrice !== data[0].GasPrice) {
                            return data[0].GasPrice;
                        }
                        return prevGasPrice;
                    });
                });
        }, 1000);

        // Clean up the interval timer when the component unmounts or the effect re-runs
        return () => clearInterval(intervalId);
    }, []);

    return <p>Gas price: {NetworkGasPrice}</p>;
};

export default GasComponent;
