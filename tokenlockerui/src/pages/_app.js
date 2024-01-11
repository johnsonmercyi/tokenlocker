import Layout from '@/components/Layout/Layout';
import { GlobalStateProvider } from '@/ethereum/config/context/GlobalStateContext';
import { Web3ModalProvider } from '@/ethereum/config/context/Web3ModalConfig';
import 'semantic-ui-css/semantic.min.css';

const App = ({ Component, pageProps }) => {
  return (
    <Web3ModalProvider>
      <GlobalStateProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </GlobalStateProvider>
    </Web3ModalProvider>
  );
}

export default App;
