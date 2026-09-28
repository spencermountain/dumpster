import React from 'react'
import { Box } from 'ink'
import Nav from './Nav.jsx'
import Footer from './Footer.jsx'

// A growing primary-screen layout, visually separated from previous commands.
export default function Page({ children, navLeft, navRight, footerLeft, footerRight, minHeight = 20, ...props }) {
  return (
    <Box
      flexDirection="column"
      width="100%"
      marginTop={1}
      marginBottom={1}
      borderStyle="single"
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
      borderColor="gray"
      {...props}
      minHeight={minHeight}
      flexShrink={0}
    >
      {(navLeft != null || navRight != null) && <Nav left={navLeft} right={navRight} />}
      <Box flexDirection="column" flexGrow={1} flexShrink={0}>
        {children}
      </Box>
      {(footerLeft != null || footerRight != null) && <Footer left={footerLeft} right={footerRight} />}
    </Box>
  )
}
