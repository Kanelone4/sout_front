import Layout from "../../components/layout/layout";
import { CatalogueProduit } from "../../components/commerciaux/catalogueProduit";


function App() {
  return (
    <Layout>
        <div className="p-4">
            <CatalogueProduit />
        </div>
    </Layout>
  )
}
export default App
