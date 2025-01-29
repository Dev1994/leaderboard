import { useState } from "react";
import { usePlayersQuery } from "../hooks/use-players-query.ts";
import { useAddPlayerMutation } from "../hooks/use-add-player-mutation.ts";
import { useNavigate } from "react-router";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import { SelectButton } from "primereact/selectbutton";

const items = [
    {name: "All Time", value: 1},
    {name: "Weekly", value: 2},
    {name: "Daily", value: 3}
];

export function LeaderboardComponent() {
    const [playerName, setPlayerName] = useState<string>("");
    const navigate = useNavigate();
    const [value, setValue] = useState(items[0].value);

    const addPlayerMutation = useAddPlayerMutation();
    const {data: allTimePlayers, isLoading: isPlayersLoading} = usePlayersQuery();

    function getPlayers() {
        switch (value) {
            case 1:
                return allTimePlayers;
            case 2:
                return allTimePlayers;
            case 3:
                return allTimePlayers;
            default:
                return allTimePlayers;
        }
    }

    return (
        <div className="flex flex-col space-y-4">
            <Fieldset legend={"Push-ups leaderboard"}>
                <SelectButton
                    value={value}
                    onChange={(e) => setValue(e.value)}
                    optionLabel="name"
                    options={items}/>

                {<DataTable
                    value={getPlayers()}
                    sortField={"totalPushUps"}
                    sortOrder={-1}
                    selectionMode="single"
                    loading={isPlayersLoading}
                    onSelectionChange={(e) => navigate(`/player/${e.value.id}`)}>
                    <Column header="Position" body={(_, options) => options.rowIndex + 1}></Column>
                    <Column field="name" header="Name"></Column>
                    <Column field="totalPushUps" header="Push ups"></Column>
                </DataTable>}
            </Fieldset>

            <Fieldset legend={"Add player"}>
                <div className="p-inputgroup flex-1">
                    <InputText placeholder="Name" value={playerName}
                               onChange={(event) => setPlayerName(event.target.value)}/>
                    <Button label="Add Player" disabled={playerName.length === 0} onClick={() => addPlayerMutation.mutate(playerName)}/>
                </div>
            </Fieldset>
        </div>
    )
}