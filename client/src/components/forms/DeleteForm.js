import { useState } from "react";
import { CrudService } from "../../service/CrudService";

import "./AllForms.css"

export const DeleteForm = () =>{
    const [id, setId] = useState("");
    const [message, setMessage] = useState("");

    const submit = async(event) => {
        let status;
        event.preventDefault();
        if (id !== ""){
            try{
                await CrudService.deleteUser(id);
                status = `Usuário ${id} deletado com sucesso`;
            } catch (e){
                console.log(e.toJSON());
                const code = e.toJSON().status;
                if (code === null){
                    status = "Falha de conexão com a API";
                }else if (code === 404){
                    status = "Não foi encontrado um usuário com o id informado";
                }else{
                    status = `Outro erro. Código: ${code}`;
                }
            }
        }else{
            status = "Entre o id do usuário a ser deletado";
        }

        setMessage(status);
        event.preventDefault();
    }

    return(
        <form onSubmit={submit}>
            <div className="formField">
                <input 
                    type="text" placeholder="Id" value={id} 
                    onChange={(event)=>setId(event.target.value)}
                />
            </div>
            <button type="submit">Delete user</button>
            <p>{message}</p>
        </form>
    );
}