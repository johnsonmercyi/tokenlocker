import React from 'react';
import UICard from '../UI/UICard/UICard';
import styles from './CardList.module.css';
import Link from 'next/link';
import { Grid, GridColumn } from 'semantic-ui-react';
import { useGlobalState } from '@/ethereum/config/context/GlobalStateContext';
import { useRouter } from 'next/router';

const CardList = ({ data = [], ...props }) => {
  const { setSelectedLockedToken } = useGlobalState();
  const router = useRouter();
  const { manager } = router.query;

  const onClickHandler = (lockedToken) => {
    setSelectedLockedToken(lockedToken);
    router.push(`/${manager}/tokens/${lockedToken.token}`)
  }

  return (
    <div className={`${styles.cardList}`}>
      {
        data.map((tokenObj, index) => {
          return (
            <div
              className={styles.item}
              key={tokenObj.beneficiary + "_" + index}
              onClick={() => onClickHandler(tokenObj)}>

              <UICard
                title={tokenObj.title}
                token={tokenObj.token}
                tokenName={tokenObj.tokenName}
                amount={tokenObj.amount}
                beneficiary={tokenObj.beneficiary}
                lockdownDate={tokenObj.lockdownDate}
                lockdownPeriod={tokenObj.lockdownPeriod}
                isReleased={tokenObj.isReleased} />
            </div>
          );
        })
      }
    </div>
  );
}

export default CardList;