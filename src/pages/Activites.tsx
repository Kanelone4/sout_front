import Layout from "../components/layout/layout";
import { Activites } from "../components/activites/activites"

function App() {
  return (
    <Layout>
        <div className="p-4">
            <Activites />
        </div>
    </Layout>
  )
}
export default App