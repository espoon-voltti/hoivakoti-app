import React from "react";

const NursingHomeContext = React.createContext({});

export const NursingHomeProvider = NursingHomeContext.Provider;
export const NursingHomeConsumer = NursingHomeContext.Consumer;
export default NursingHomeContext;
