import Layout from '../components/layout/Layout';
import '../style/global.css'


import { BiconomyProvider } from '../components/Hooks/BiconomyContext';

function MyApp({ Component, pageProps }) {
  return (
    <BiconomyProvider>
    <Layout>
      <Component {...pageProps} />
    </Layout>      
  </BiconomyProvider>

  )
}

export default MyApp
