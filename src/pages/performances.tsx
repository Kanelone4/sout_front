import Layout from "../components/layout/layout";
import { Performances } from "../components/performances/performances";

function App() {
  return (
    <Layout>
        <div className="p-4">
            <Performances />
        </div>
    </Layout>
  )
}
export default App