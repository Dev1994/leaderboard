import {useParams} from "react-router";
import {usePlayerQuery} from "../hooks/use-player-query.ts";
import {InputNumber, InputNumberValueChangeEvent} from "primereact/inputnumber";
import {useState} from "react";
import {Button} from "primereact/button";
import {useAddWorkoutMutation} from "../hooks/use-add-workout-mutation.ts";
import {Divider} from "primereact/divider";
import {BreadCrumb} from "primereact/breadcrumb";
import {usePlayerWorkoutsQuery} from "../hooks/use-player-workouts-query.ts";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Workout} from "../entities/workout.ts";
import {DateTime} from "luxon";

export function PlayerComponent() {
    const {id} = useParams();
    const [pushUps, setPushUps] = useState<number>(0);

    const {data: player, isLoading: isPlayerLoading} = usePlayerQuery(id as string);
    const {data: playerWorkouts, isLoading: isPlayerWorkoutsLoading} = usePlayerWorkoutsQuery(player);

    const {mutate: addWorkout} = useAddWorkoutMutation();

    if (isPlayerLoading || isPlayerWorkoutsLoading) {
        return <div>Loading...</div>
    }

    if (!player || !playerWorkouts) {
        return <div>Player not found</div>
    }

    function formatDate(workout: Workout) {
        return DateTime.fromISO(workout.createdAt).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
    }

    function addPushUps() {
        if (!player) {
            return;
        }

        addWorkout({player, pushUps});
        setPushUps(0);
    }

    return (
        <div className="flex flex-col space-y-4">
            <BreadCrumb home={{icon: 'pi pi-home', url: '/'}} model={[{label: player.name}]}/>

            <div className="md:grid md:grid-cols-10">
                <div className="flex flex-col space-y-4 md:flex md:flex-col md:col-span-4">
                    <h1>{player.name}</h1>
                    <p>Total push-ups: {player.totalPushUps}</p>

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

                    <Button label="Add push-ups" disabled={pushUps < 1} onClick={addPushUps}/>
                </div>

                <Divider/>

                <div className="md:col-span-5">
                    {playerWorkouts &&
                        <DataTable value={playerWorkouts} sortField={"createdAt"} sortOrder={-1}>
                            <Column field={"pushUps"} header={"Push-ups"} sortable/>
                            <Column field={"createdAt"} header={"Created At"} body={formatDate} sortable/>
                        </DataTable>}
                </div>

            </div>
        </div>
    )
}