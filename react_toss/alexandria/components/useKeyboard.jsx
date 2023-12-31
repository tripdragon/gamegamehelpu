
// https://sbcode.net/react-three-fiber/custom-hooks/
// Dont like the drei keyboard wrapper system

import { useEffect, useRef } from 'react'

export default function useKeyboard() {
  const keyMap = useRef({})

  useEffect(() => {
    const onDocumentKey = (e) => {
      keyMap.current[e.code] = e.type === 'keydown'
    }
    document.addEventListener('keydown', onDocumentKey)
    document.addEventListener('keyup', onDocumentKey)
    return () => {
      document.removeEventListener('keydown', onDocumentKey)
      document.removeEventListener('keyup', onDocumentKey)
    }
  })

  return keyMap.current
}


/*
example

const keyMap = useKeyboard();
// this weird && 
keyMap['KeyA'] && ( movePlayer(player,'KeyA', camera, orbit, delta) );

*/
