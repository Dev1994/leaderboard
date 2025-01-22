import {useState} from "react";
import {usePlayersQuery} from "../hooks/use-players-query.ts";
import {useAddPlayerMutation} from "../hooks/use-add-player-mutation.ts";
import {useNavigate} from "react-router";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import _ from "lodash";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Fieldset} from "primereact/fieldset";

export function LeaderboardComponent() {
    const [playerName, setPlayerName] = useState<string>("");
    const navigate = useNavigate();

    const addPlayerMutation = useAddPlayerMutation();
    const {data: players, isLoading: isPlayersLoading} = usePlayersQuery();

    return (
        <>
            <Fieldset legend={"Push-ups leaderboard"}>
                <DataTable
                    value={_.orderBy(players, ['totalPushUps'], ['desc'])}
                    selectionMode="single"
                    loading={isPlayersLoading}
                    onSelectionChange={(e) => navigate(`/player/${e.value.id}`)}>
                    <Column header="Position" body={(_, options) => options.rowIndex + 1}></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="totalPushUps" header="Push ups"></Column>
                </DataTable>
            </Fieldset>

            <Fieldset legend={"Add player"}>
                <div className="p-inputgroup flex-1">
                    <InputText placeholder="Name" value={playerName}
                               onChange={(event) => setPlayerName(event.target.value)}/>
                    <Button label="Add Player" onClick={() => addPlayerMutation.mutate(playerName)}/>
                </div>
            </Fieldset>
        </>
    )
}