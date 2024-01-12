import { useGlobalState } from "@/ethereum/config/context/GlobalStateContext";
import React, { useEffect } from "react";
import styles from "@/styles/grid.module.css";
import UIForm from "@/components/Form/UIForm";
import UIField from "@/components/Form/UIInput/UIInput";
import { Grid } from "semantic-ui-react";
import UISelect from "@/components/Form/UISelect/UISelect";

const LockNewToken = () => {
  const { setIsHeaderVisible } = useGlobalState();
  const { Row, Column } = Grid;
  const options = [
    {key: "sftc", text: "SOFTToken", value: "SFTC"}
  ];

  useEffect(() => {
    setIsHeaderVisible(true);
  });

  return (
    <div style={{width: "90%", margin: "auto"}}>
      <h1>Lock New Token</h1>
      <UIForm>
        <Grid>
          <Row>
            <Column mobile={16} tablet={8} computer={8}>
              <UISelect
                options={options}
                label={"Token"} />
            </Column>

            <Column mobile={16} tablet={8} computer={8}>
              <UIField
                label={"Token"} />
            </Column>
          </Row>

        </Grid>
      </UIForm>
    </div>
  );
}

export default LockNewToken;