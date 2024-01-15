import React, { useEffect } from 'react';
import styles from './UILoaderPage.module.css';
import { Dimmer, Image, Loader, Segment } from 'semantic-ui-react';
import { useGlobalState } from '@/ethereum/config/context/GlobalStateContext';


const UILoaderPage = ({ indeterminate, content, ...props }) => {
  return (
    <div className={styles.UILoaderPage}>
      <Loader
        indeterminate={indeterminate}
        active
        inline="centered" 
        content={`${content || "Loading..."}`} />
    </div>
  );
}

export default UILoaderPage;