import { useState } from "react"

const Image = ({ as, src, fallbackSrc, ...props }) => {
  const Element = as
  const [state, setState] = useState({
    src: src,
    isError: false
  })

  const onError = () => {
    if (!state.isError) {
      setState({
        src: fallbackSrc,
        isError: true
      })
    }
  }

  return (
    <Element
      {...props}
      src={state.src}
      onError={onError}
    />
  )
}

export default Image