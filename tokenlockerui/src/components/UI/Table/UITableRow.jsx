import React, { useState } from "react";
import { Table } from "semantic-ui-react";
import web3 from "@/ethereum/config/web3";
import UIButton from "../UIButton/UIButton";
import campaignInstance from '@/ethereum/config/campaign';
import { useRouter } from "next/router";

const UITableRow = ({ data, id, contributorsCount, ...props }) => {
  const { Row, Cell } = Table;
  const router = useRouter();
  const readyForApproval = data.approvalCount > contributorsCount/2

  const [approveLoading, setApproveLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);

  const onApproveHandler = async () => {
    setApproveLoading(true);
    try {
      const campaign = campaignInstance(props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.approveRequest(id).send({
        from: accounts[0]
      });
      setApproveLoading(false);

      router.replace(`/campaigns/${props.address}/requests`);
    } catch (error) {
      setApproveLoading(false);
    }
  }

  const onFinalizeHandler = async () => {
    setFinalizeLoading(true);
    try {
      const campaign = campaignInstance(props.address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0]
      });
      setFinalizeLoading(false);

      router.replace(`/campaigns/${props.address}/requests`);
    } catch (error) {
      setFinalizeLoading(false);
    }
  }

  return (
    <Row 
      disabled={data.complete}
      positive={readyForApproval && !data.complete}>
      <Cell>{id + 1}</Cell>
      <Cell>{data.description}</Cell>
      <Cell>{web3.utils.fromWei(data.value, "ether")}</Cell>
      <Cell>
        <a
          href={`https://goerli.etherscan.io/address/${data.recipient}`}
          target="_blank"
          rel="noopener noreferrer">
          {data.recipient}
        </a>
      </Cell>
      <Cell>{`${data.approvalCount}/${contributorsCount}`}</Cell>
      <Cell>
        <UIButton
          color={data.complete ? "gray" : "green"}
          basic
          onClickHandler={onApproveHandler}
          loading={approveLoading}
          disabled={approveLoading || data.approvalCount === contributorsCount / 2 || data.complete}>Approve</UIButton>
      </Cell>
      <Cell>
        <UIButton
          color={!readyForApproval || data.complete ? "gray" : "teal"}
          basic
          onClickHandler={onFinalizeHandler}
          loading={finalizeLoading}
          disabled={finalizeLoading || !readyForApproval || data.complete}>Finalize</UIButton>
      </Cell>
    </Row>
  );
}

export default UITableRow;