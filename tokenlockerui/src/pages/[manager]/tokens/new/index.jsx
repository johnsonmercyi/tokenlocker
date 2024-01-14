import { useGlobalState } from "@/ethereum/config/context/GlobalStateContext";
import React, { useEffect, useState } from "react";
import styles from "@/styles/grid.module.css";
import UIForm from "@/components/Form/UIForm";
import UIField from "@/components/Form/UIInput/UIInput";
import { Grid } from "semantic-ui-react";
import UISelect from "@/components/Form/UISelect/UISelect";
import UIButton from "@/components/UI/UIButton/UIButton";
import UIMessage from "@/components/UI/UIMessage";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import tokenInstance from "@/ethereum/config/ERC20";
import factoryInstance from "@/ethereum/config/Factory";
import tokenLockerInstance from "@/ethereum/config/TokenLocker";

export async function getServerSideProps(props) {
  const { manager } = props.query;
  return {
    props: {
      manager: manager
    },
  };
}

const LockNewToken = (props) => {
  const { setIsHeaderVisible } = useGlobalState();
  const { Row, Column } = Grid;
  const options = [
    { key: "empty", text: "", value: "" },
    { key: "sftc", text: "SFTC", value: "0xCebD093EdDfF9E8be5741FC52225385314de25Fd" },
  ];
  const { manager } = props;

  const { address, chainId, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const [tokenAddress, setTokenAddress] = useState("");
  const [title, setTitle] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("");
  const [lockdownPeriod, setLockdownPeriod] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onTokenChangedHandler = (event, { value }) => {
    setTokenAddress(value);
  }

  const onTitleChangedHandler = (event, { value }) => {
    setTitle(value);
  }

  const onBeneficiaryChangedHandler = (event, { value }) => {
    setBeneficiary(value);
  }

  const onAmountChangedHandler = (event, { value }) => {
    setErrorMessage("");
    try {
      if (value) {
        const amount = Number(value);
        if (!amount) {
          throw Error("Invalid token amount.");
          return;
        }
        setAmount(amount);
      } else {
        setAmount(value);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const onLockdownPeriodChangedHandler = (event, { value }) => {
    setErrorMessage("");
    try {
      if (value) {
        const period = Number(value);
        if (!period) {
          throw Error("Invalid lockdown period.");
          return;
        }
        setLockdownPeriod(period);
      } else {
        setLockdownPeriod(value);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const onChangeHandler = (event, field) => {
    if (field === "title") {
      setTitle(event.target.value);
    } else if (field === "beneficiary") {
      setBeneficiary(event.target.value);
    } else if (field === "amount") {
      setAmount(event.target.value);
    } else if (field === "lockdownPeriod") {
      setLockdownPeriod(event.target.value);
    }
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);
    setDisabled(true);

    try {
      // Check if the user's wallet is connected


      const bigIntAmount = BigInt(amount);
      const amountToApprove = bigIntAmount * (10n ** 18n);

      const daysInSeconds = (24 * 60 * 60);
      const lockdownPeriodInSeconds = daysInSeconds * Number(lockdownPeriod);

      const factory = await factoryInstance(walletProvider);
      const tokenLockerAddress = await factory.getDeployedTokenLocker(manager);
      const tokenLocker = await tokenLockerInstance(tokenLockerAddress, walletProvider);

      const tokenObj = await tokenInstance(tokenAddress, walletProvider);
      const token = tokenObj.instance;
      const signer = tokenObj.signer;


      const tokenWithSigner = token.connect(signer);


      const tokenApproval = await tokenWithSigner.approve(tokenLockerAddress, amountToApprove);

      const approvalReceipt = await tokenApproval.wait();

      if (approvalReceipt.status === 1) {
        // Call the deposit method
        const depositTransaction = await tokenLocker.deposit(
          tokenAddress,
          beneficiary,
          amountToApprove,
          lockdownPeriodInSeconds,
          title
        );

        // Fetch deposit transaction hash
        const depositTransactionHash = depositTransaction.hash;
        console.log('Deposit Transaction Hash:', depositTransactionHash);

        // Event
        tokenLocker.on("TokensDeposited", (sender, beneficiary, amount, title) => {
          console.log('TokensDeposited Event:', sender, beneficiary, amount, title);
          // Handle the event data as needed
        });

        // Wait for the transaction to be mined
        const depositReceipt = await depositTransaction.wait();

        // Get the transaction receipt
        console.log('Deposit Transaction Receipt:', depositReceipt);

      } else {
        throw Error("Transaction approval failed.");
      }


    } catch (error) {
      if (String(error.message).includes("code=ACTION_REJECTED")) {
        setErrorMessage("Sorry! The signer has been rejected the approval of this transaction.");
      } else {
        setErrorMessage(error.message);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    setIsHeaderVisible(true);
  });

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      <h1>Lock New Token</h1>
      <UIForm
        error={!!errorMessage}
        onSubmit={onSubmitHandler}>
        <Grid>
          <Row>
            <Column mobile={16} tablet={8} computer={8}>
              <UISelect
                value={tokenAddress}
                options={options}
                label={"Token"}
                placeholder={"Token to lock"}
                onChangeHandler={onTokenChangedHandler} />
            </Column>

            <Column mobile={16} tablet={8} computer={8}>
              <UIField
                value={title}
                label={"Title"}
                placeholder={"E.g Bet Stake, Escrow etc"}
                onChangeHandler={onTitleChangedHandler} />
            </Column>

            <Column mobile={16} tablet={8} computer={8}>
              <UIField
                value={beneficiary}
                label={"Beneficiary"}
                placeholder={"0x00..."}
                onChangeHandler={onBeneficiaryChangedHandler} />
            </Column>

            <Column mobile={16} tablet={8} computer={8}>
              <UIField
                value={amount}
                label={"Amount"}
                placeholder={"E.g 200, 5000 etc"}
                onChangeHandler={onAmountChangedHandler} />
            </Column>

            <Column mobile={16} tablet={8} computer={8}>
              <UIField
                value={lockdownPeriod}
                rounded_left
                inputLabel={"Days"}
                inputLabelPosition={"right"}
                label={"Lockdown Period"}
                placeholder={"E.g 5, 10, 30 etc"}
                onChangeHandler={onLockdownPeriodChangedHandler} />
            </Column>
          </Row>

          {
            errorMessage && <Row>
              <Column mobile={16} tablet={16} computer={16}>
                <UIMessage
                  error
                  content={errorMessage} />
              </Column>
            </Row>
          }

          <Row>
            <Column mobile={16} tablet={8} computer={8}>
              <UIButton
                type={"submit"}
                disabled={!(
                  tokenAddress
                  && (beneficiary && beneficiary.length === 42)
                  && title
                  && amount
                  && lockdownPeriod
                ) || disabled}
                icon={"checkmark"}
                labelPosition={"left"}
                content={"Approve and Lock!"}
                loading={loading} />
            </Column>
          </Row>

        </Grid>
      </UIForm>
    </div>
  );
}

export default LockNewToken;