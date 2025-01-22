import { useParams } from "react-router";
import { usePlayerQuery } from "../hooks/use-player-query.ts";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { useState } from "react";
import { Button } from "primereact/button";
import { useAddWorkoutMutation } from "../hooks/use-add-workout-mutation.ts";
import { Divider } from "primereact/divider";
import { BreadCrumb } from "primereact/breadcrumb";
import { usePlayerWorkoutsQuery } from "../hooks/use-player-workouts-query.ts";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export function PlayerComponent() {
    const {id} = useParams();
    const [pushUps, setPushUps] = useState<number>(0);

    const columns = [
        {field: 'pushUps', header: 'Push-ups'},
        {field: 'createdAt', header: 'Created At'},
    ];

    const {data: player, isLoading: isPlayerLoading} = usePlayerQuery(id as string);
    const {data: playerWorkouts, isLoading: isPlayerWorkoutsLoading} = usePlayerWorkoutsQuery(player);

    const {mutate: addWorkout} = useAddWorkoutMutation();

    if (isPlayerLoading || isPlayerWorkoutsLoading) {
        return <div>Loading...</div>
    }

    if (!player || !playerWorkouts) {
        return <div>Player not found</div>
    }

    return (
        <div className="flex flex-col space-y-4">
            <BreadCrumb home={{icon: 'pi pi-home', url: '/'}} model={[{label: player.name}]}/>

            <h1>{player.name}</h1>
            <p>Total push-ups: {player.totalPushUps}</p>
            <Divider/>
            <InputNumber
                value={pushUps}
                onValueChange={(e: InputNumberValueChangeEvent) => setPushUps(e.value ?? 0)}
                showButtons
                buttonLayout="horizontal"
                step={1}
                decrementButtonClassName="p-button-danger"
                incrementButtonClassName="p-button-success"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                mode="decimal"/>

            <Button label="Add push-ups" onClick={() => addWorkout({player, pushUps})}/>

            {playerWorkouts &&
                <DataTable value={playerWorkouts}>
                    {columns.map((column, i) => (
                        <Column key={i} field={column.field} header={column.header}/>
                    ))}
                </DataTable>}
        </div>
    )
}