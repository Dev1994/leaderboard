import {BrowserRouter, Route, Routes} from "react-router";
import "./App.css";
import {LeaderboardComponent} from "./components/LeaderboardComponent.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {PlayerComponent} from "./components/PlayerComponent.tsx";
import {PrimeReactProvider} from "primereact/api";

const queryClient = new QueryClient()

function App() {

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <PrimeReactProvider>
                    <Routes>
                        <Route path="/" element={<LeaderboardComponent/>}/>
                        <Route path="/player/:id" element={<PlayerComponent/>}/>
                    </Routes>
                </PrimeReactProvider>
            </QueryClientProvider>
        </BrowserRouter>
    )
}

export default App
