import React from "react"
import { RunnerProvider } from "./src/components/site-runners"
export const wrapRootElement = ({ element }) => (
  <RunnerProvider>{element}</RunnerProvider>
)
