import * as React from "react";
import { useState, useContext } from "react";
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

export default function EventListen(props) {
    //const { sharedState, setSharedState } = useContext(userInputs);
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});
    const [selectedMethod, setselectedMethod] = useState("Read");

    const [mintSectionInputs, setMintSectionInputs] = useState({
        mintWallet: [],
        mintPrivateKey: [],
        selectedGasPrice: "",
        taskName: "",
        taskContract: "",
        taskContractABI: "",
        taskContractFunction: "",
        taskContractFunctionInput: "",
        eventListener: "Read",
        eventListenerFunction: "",
        eventListenerInput: "",
        eventListenerPending: false,
        taskID: 0,
        mintPrice: 0,
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

    const handleSelectChangeMethod = (event) => {
        setselectedMethod(event.target.value);
        setTheInput("eventListener", event.target.value);
    };

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
        let isAnyEmpty = false;
        const newCompleted = { ...completed };

        switch (activeStep) {
            case 0:
                isAnyEmpty =
                    !mintSectionInputs.taskName.trim() ||
                    !mintSectionInputs.taskContract.trim();
                break;
            case 1:
                isAnyEmpty = !mintSectionInputs.taskContractFunction.trim();
                break;
            case 2:
                isAnyEmpty =
                    !String(mintSectionInputs.mintWallet).trim() ||
                    !String(mintSectionInputs.mintPrivateKey).trim();
                break;
            case 3:
                isAnyEmpty = !mintSectionInputs.selectedGasPrice.trim();
                break;
            case 4:
                if (mintSectionInputs.selectedMethod === "Read") {
                    isAnyEmpty =
                        !mintSectionInputs.eventListenerFunction.trim() ||
                        !mintSectionInputs.eventListenerInput.trim();
                } else if (mintSectionInputs.selectedMethod === "Mempool") {
                    isAnyEmpty =
                        !mintSectionInputs.eventListenerFunction.trim();
                } else if (mintSectionInputs.selectedMethod === "blockNumber") {
                    isAnyEmpty = !mintSectionInputs.eventListenerInput.trim();
                }
                break;
            default:
                break;
        }

        if (isAnyEmpty) {
            alert("Please fill in all required fields.");
        } else {
            newCompleted[activeStep] = true;
            setCompleted(newCompleted);
            if (completedSteps() === totalSteps() - 1) {
                props.changeStateTasks(mintSectionInputs);
            } else {
                handleNext();
            }
        }
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
        setMintSectionInputs({
            mintWallet: [],
            mintPrivateKey: [],
            selectedGasPrice: "",
            taskName: "",
            taskContract: "",
            taskContractABI: "",
            taskContractFunction: "",
            taskContractFunctionInput: "",
            eventListener: mintSectionInputs.eventListener,
            eventListenerFunction: "",
            eventListenerInput: "",
            eventListenerPending: false,
            taskID: 0,
            mintPrice: 0,
        });
    };

    ///////////////////////////////////////////////////////
    // CONTRACT API REQUEST
    React.useEffect(() => {
        if (mintSectionInputs.taskContract.length > 0) {
            fetch(`/getABI/${mintSectionInputs.taskContract}`)
                .then((response) => response.json())
                .then((data) => {
                    setContractInputs((prevState) => {
                        return {
                            ...prevState,
                            contractABI: data,
                        };
                    });
                    setMintSectionInputs((prevData) => {
                        return {
                            ...prevData,
                            taskContractABI: data,
                        };
                    });
                    GlobalContractAddress = contractInputs.contractAddress;
                    resolveContract_Event(data);
                });
        }
    }, [mintSectionInputs.taskContract]);

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
                        <StepButton onClick={handleStep(index)}>
                            <Typography variant="body1" sx={{ color: "white" }}>
                                {label}
                            </Typography>
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            <div>
                {allStepsCompleted() ? (
                    <React.Fragment>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            Head to Dashboard to track the progress!
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                pt: 2,
                            }}
                        >
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button
                                onClick={handleReset}
                                sx={{ color: "white" }}
                            >
                                Reset
                            </Button>
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
                                <Step4 setTheInput={setTheInput} />
                            ) : activeStep === 4 ? (
                                <Step5
                                    contractFunctions={contractFunctions}
                                    mintSectionInputs={mintSectionInputs}
                                    setTheInput={setTheInput}
                                    handleSelectChangeMethod={
                                        handleSelectChangeMethod
                                    }
                                    selectedMethod={selectedMethod}
                                />
                            ) : (
                                <Step6 mintSectionInputs={mintSectionInputs} />
                            )}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                pt: 2,
                            }}
                        >
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ color: "white", mr: 1 }}
                            >
                                Back
                            </Button>
                            <Box sx={{ flex: "1 1 auto" }} />
                            <Button
                                onClick={handleNext}
                                sx={{ color: "white", mr: 1 }}
                            >
                                Next
                            </Button>
                            <Box sx={{ flex: "0 1 auto" }}>
                                {activeStep !== steps.length &&
                                    (completed[activeStep] ? (
                                        <Typography
                                            variant="caption"
                                            sx={{ display: "inline-block" }}
                                        >
                                            Step {activeStep + 1} already
                                            completed
                                        </Typography>
                                    ) : (
                                        <Button
                                            onClick={handleComplete}
                                            sx={{ color: "white" }}
                                        >
                                            {completedSteps() ===
                                            totalSteps() - 1
                                                ? "Finish"
                                                : "Complete Step"}
                                        </Button>
                                    ))}
                            </Box>
                        </Box>
                    </React.Fragment>
                )}
            </div>
        </Box>
    );
}
