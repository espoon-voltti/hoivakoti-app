import React from 'react'

const NurseryHomeContext = React.createContext({});

export const NurseryHomeProvider = NurseryHomeContext.Provider
export const NurseryHomeConsumer = NurseryHomeContext.Consumer
export default NurseryHomeContext