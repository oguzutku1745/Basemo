import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Step1 from "../FormFilling/Step1";
import Step2 from "../FormFilling/Step2";
import Step3 from "../FormFilling/Step3";
import Step4 from "../FormFilling/Step4";
import Step5 from "../FormFilling/Step5";
import Step6 from "../FormFilling/Step6";
import { ethers } from "ethers";

const steps = [
    "Basics",
    "Contract Inputs",
    "Wallets",
    "Gas",
    "Event Listeners",
    "Final Review",
];

var GlobalProvider = new ethers.InfuraProvider(
    "goerli",
    "0fe302203e9f42fc9dffae2ccb1494c2"
);
var GlobalContractAddress;
var GlobalContractInterface;
var GlobalContract;

export default function HorizontalNonLinearStepper(props) {
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});
    const [mintSectionInputs, setMintSectionInputs] = useState({
        mintWallet: "",
        mintPrivateKey: "",
        selectedGasPrice: "",
        taskName: "",
        taskContract: "",
        taskContractFunction: "",
        mintPrice: "",
        eventListener: "",
        eventListenerInput: "",
    });
    console.log(mintSectionInputs);

    const [contractInputs, setContractInputs] = useState({
        contractAddress: "",
        contractABI: "",
    });
    const [contractFunctions, setContractFunctions] = useState({
        name: [],
        paramName: [],
        inputType: [],
        functionType: [],
    });

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                  // find the first step that has been completed
                  steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const setTheInput = (name, value) => {
        setMintSectionInputs((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };

    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    // CONTRACT API REQUEST
    React.useEffect(() => {
        if (mintSectionInputs.taskContract.length > 0) {
        fetch(
            `https://api-goerli.etherscan.io/api?module=contract&action=getabi&address=${mintSectionInputs.taskContract}&apikey=EY4HQCTINHG9CEVSNDFND3AKXNIU8KBZA4`
        )
            .then((response) => response.json())
            .then((data) => {
                setContractInputs((prevState) => {
                    return {
                        ...prevState,
                        contractABI: data.result,
                    };
                });
                GlobalContractAddress = contractInputs.contractAddress;
                resolveContract_Event(data.result);
            });
    }}, [mintSectionInputs.taskContract]);

    async function resolveContract_Event(ABI) {
        GlobalContractInterface = new ethers.Interface(ABI);
        GlobalContract = new ethers.Contract(
            GlobalContractAddress,
            GlobalContractInterface,
            GlobalProvider
        );
        const filteredfunct = GlobalContractInterface.format(
            ethers.formatEther.json
        ).filter((str) => str.includes("function"));
        const updatedArray = filteredfunct.map((item, i) => {
            const functionName = item.split("function ")[1].split("(")[0]; // extract function name
            const paramMatch = item.match(/\((.*?)\)/); // extract parameter string inside parentheses (optional)
            const paramName = paramMatch
                ? paramMatch[1].split(",").map((param) => param.trim())
                : []; // extract parameter names array or set to empty array
            const inputType = paramName.map((param) => param.split(" ")[0]); // extract input types from parameter names
            const functionType = item.includes("view") ? "read" : "write"; // check if function is read or write

            return {
                id: i,
                name: functionName,
                paramName,
                inputType,
                functionType,
            };
        });

        setContractFunctions(updatedArray);
    }

    return (
        <Box sx={{ marginLeft: "180px", width: "80%" }}>
            <Stepper nonLinear activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                pt: 2,
                            }}
                        >
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                            {activeStep === 0 ? (
                                <Step1 setTheInput={setTheInput} />
                            ) : activeStep === 1 ? (
                                <Step2
                                    contractFunctions={contractFunctions}
                                    setTheInput={setTheInput}
                                />
                            ) : activeStep === 2 ? (
                                <Step3
                                    setTheInput={setTheInput}
                                    mint_wallets={props.mint_wallets}
                                    private_keys={props.private_keys}
                                />
                            ) : activeStep === 3 ? (
                                <Step4
                                    setTheInput={setTheInput}
                                    NetworkGasPrice={props.NetworkGasPrice}
                                />
                            ) : activeStep === 4 ? (
                                <Step5 />
                            ) : (
                                <Step6 />
                            )}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                pt: 2,
                            }}
                        >
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button onClick={handleNext} sx={{ mr: 1 }}>
                                Next
                            </Button>
                            {activeStep !== steps.length &&
                                (completed[activeStep] ? (
                                    <Typography
                                        variant="caption"
                                        sx={{ display: "inline-block" }}
                                    >
                                        Step {activeStep + 1} already completed
                                    </Typography>
                                ) : (
                                    <Button onClick={handleComplete}>
                                        {completedSteps() === totalSteps() - 1
                                            ? "Finish"
                                            : "Complete Step"}
                                    </Button>
                                ))}
                        </Box>
                    </React.Fragment>
                )}
            </div>
        </Box>
    );
}
