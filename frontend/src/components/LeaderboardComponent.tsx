import { useEffect, useState } from "react";
import { useAddPlayerMutation } from "../hooks/use-add-player-mutation.ts";
import { useNavigate } from "react-router";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Fieldset } from "primereact/fieldset";
import { SelectButton } from "primereact/selectbutton";
import { useLeaderboardQuery } from "../hooks/use-leaderboard-query.ts";
import { DateTime } from "luxon";

const items = [
    {name: "All Time", value: 1},
    {name: "Weekly", value: 2},
    {name: "Daily", value: 3}
];

export function LeaderboardComponent() {
    const [playerName, setPlayerName] = useState<string>("");
    const [startDate, setStartDate] = useState<DateTime>(DateTime.utc().minus({years: 10}));
    const [endDate, setEndDate] = useState<DateTime>(DateTime.utc().plus({days: 1}));

    const navigate = useNavigate();
    const [value, setValue] = useState(items[0].value);

    const addPlayerMutation = useAddPlayerMutation();
    const {data: leaderboard, isLoading: isLeaderboardLoading} = useLeaderboardQuery(startDate, endDate);

    useEffect(() => {
        switch (value) {
            case 1:
                setStartDate(DateTime.utc().minus({years: 10}));
                setEndDate(DateTime.utc().endOf("day"));
                break;
            case 2:
                setStartDate(DateTime.utc().startOf("week"));
                setEndDate(DateTime.utc().endOf("week"));
                break;
            case 3:
                setStartDate(DateTime.utc().startOf("day"));
                setEndDate(DateTime.utc().endOf("day"));
                break;
        }
    }, [value]);

    return (
        <div className="flex flex-col space-y-4">
            <Fieldset legend={"Push-ups leaderboard"}>
                <SelectButton
                    value={value}
                    onChange={(e) => setValue(e.value)}
                    optionLabel="name"
                    options={items}/>

                {<DataTable
                    value={leaderboard}
                    sortField={"totalPushUps"}
                    sortOrder={-1}
                    selectionMode="single"
                    loading={isLeaderboardLoading}
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