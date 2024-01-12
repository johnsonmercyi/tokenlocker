import { useGlobalState } from "@/ethereum/config/context/GlobalStateContext";
import React from "react";

const ViewLockedToken = ({ ...props }) => {
  const { selectedLockedToken } = useGlobalState();
  return (
    <div>
      Hey Locked Token!!! {selectedLockedToken.token}
    </div>
  );
}

export default ViewLockedToken;