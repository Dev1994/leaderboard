import "./App.css";
import {LeaderboardComponent} from "./components/LeaderboardComponent.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient()

function App() {

    return (
        <QueryClientProvider client={queryClient}>
            <LeaderboardComponent/>
        </QueryClientProvider>
    )
}

export default App
