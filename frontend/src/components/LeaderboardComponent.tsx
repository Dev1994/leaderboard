import {useEffect, useState} from "react";
import {useAddPlayerMutation} from "../hooks/use-add-player-mutation.ts";
import {useNavigate} from "react-router";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Fieldset} from "primereact/fieldset";
import {useLeaderboardQuery} from "../hooks/use-leaderboard-query.ts";
import {DateTime} from "luxon";
import {Dropdown} from "primereact/dropdown";

const items = [
    {name: "All Time", value: 0},
    {name: "Yearly", value: 1},
    {name: "Monthly", value: 2},
    {name: "Weekly", value: 3},
    {name: "Daily", value: 4}
];

export function LeaderboardComponent() {
    const [playerName, setPlayerName] = useState<string>("");
    const [startDate, setStartDate] = useState<DateTime>(DateTime.utc(2025));
    const [endDate, setEndDate] = useState<DateTime>(DateTime.utc().plus({days: 1}));

    const navigate = useNavigate();
    const [value, setValue] = useState(items[0].value);

    const addPlayerMutation = useAddPlayerMutation();
    const {data: leaderboard, isLoading: isLeaderboardLoading} = useLeaderboardQuery(startDate, endDate);

    useEffect(() => {
        switch (value) {
            case 0:
                setStartDate(DateTime.utc(2025));
                setEndDate(DateTime.utc().endOf("day"));
                break;
            case 1:
                setStartDate(DateTime.utc().startOf("year"));
                setEndDate(DateTime.utc().endOf("day"));
                break;
            case 2:
                setStartDate(DateTime.utc().startOf("month"));
                setEndDate(DateTime.utc().endOf("day"));
                break;
            case 3:
                setStartDate(DateTime.utc().startOf("week"));
                setEndDate(DateTime.utc().endOf("week"));
                break;
            case 4:
                setStartDate(DateTime.utc().startOf("day"));
                setEndDate(DateTime.utc().endOf("day"));
                break;
        }
    }, [value]);

    return (
        <div className="flex flex-col space-y-4 sm:max-w-6xl sm:justify-self-center">
            <Fieldset legend={"Push-ups leaderboard"}>
                <div className="flex space-x-4">
                    <Dropdown
                        value={value}
                        onChange={(e) => setValue(e.value)}
                        optionLabel="name"
                        options={items}/>
                </div>

                <DataTable
                    value={leaderboard}
                    sortField={"totalPushUps"}
                    sortOrder={-1}
                    selectionMode="single"
                    loading={isLeaderboardLoading}
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
                    <Button label="Add Player" disabled={playerName.length === 0}
                            onClick={() => addPlayerMutation.mutate(playerName)}/>
                </div>
            </Fieldset>
        </div>
    )
}