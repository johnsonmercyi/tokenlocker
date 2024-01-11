import { useGlobalState } from "@/ethereum/config/context/GlobalStateContext";
import React, { useEffect } from "react";


const ShowTokenLockerSpace = ({ ...props }) => {
  const { isHeaderVisible, setIsHeaderVisible } = useGlobalState();

  useEffect(()=> {
    setIsHeaderVisible(true);
  });
  
  return (
    <>
      <h3>Locked Tokens Show!</h3>
    </>
  );
}

export default ShowTokenLockerSpace;