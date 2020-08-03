import React from "react"
import { Providers } from "./src/components/providers"
export const wrapRootElement = ({ element }) => <Providers>{element}</Providers>
