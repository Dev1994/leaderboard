import {useParams} from "react-router";

export function PlayerComponent() {
    const {id} = useParams();
    return (
        <>
            {id}
        </>
    )
}