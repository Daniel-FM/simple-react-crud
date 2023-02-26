import {CreateForm} from "./forms/CreateForm"
import {ReadForm} from "./forms/ReadForm"
import {UpdateForm} from "./forms/UpdateForm"
import {DeleteForm} from "./forms/DeleteForm"

export const FormArea = (props) => {
    if (props.mode === "Create"){
        return(
            <CreateForm/>
        );
    } else if (props.mode === "Read"){
        return(
            <ReadForm/>
        );
    } else if (props.mode === "Update"){
        return(
            <UpdateForm/>
        );
    } else if (props.mode === "Delete"){
        return(
            <DeleteForm/>
        );
    } else {
        return(
            <h1>ERROR!</h1>
        );
    }
}