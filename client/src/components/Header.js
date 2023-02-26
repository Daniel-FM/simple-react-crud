import "./Header.css"
import { useEffect, useState } from "react"

export const Header = (props) => {

    const [activeMode, setActiveMode] = useState("Create");

    const [classNameCreate, setClassNameCreate] = useState(["headerButton",""]);
    const [classNameRead, setClassNameRead] = useState(["headerButton",""]);
    const [classNameUpdate, setClassNameUpdate] = useState(["headerButton",""]);
    const [classNameDelete, setClassNameDelete] = useState(["headerButton",""]);

    useEffect(()=>{
        setClassNameCreate(["headerButton", activeMode === "Create" ? "active" : ""]);
        setClassNameRead(["headerButton", activeMode === "Read" ? "active" : ""]);
        setClassNameUpdate(["headerButton", activeMode === "Update" ? "active" : ""]);
        setClassNameDelete(["headerButton", activeMode === "Delete" ? "active" : ""]);
    },[activeMode]);

    const updateMode = (newMode)=>{
        if (activeMode !== newMode){
            setActiveMode(newMode);
        }
        props.callback(newMode);
    }

    return(
        <div>
            <div className="header">
                <div className={classNameCreate.join(" ").trim()} onClick={()=>updateMode("Create")}>
                    <h1>Create</h1>
                </div>
                <div className={classNameRead.join(" ").trim()} onClick={()=>updateMode("Read")}>
                    <h1>Read</h1>
                </div>
                <div className={classNameUpdate.join(" ").trim()} onClick={()=>updateMode("Update")}>
                    <h1>Update</h1>
                </div>
                <div className={classNameDelete.join(" ").trim()} onClick={()=>updateMode("Delete")}>
                    <h1>Delete</h1>
                </div>
            </div>
        </div>
    );
};