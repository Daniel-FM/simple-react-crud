import { useState } from "react";
import { CrudService } from "../../service/CrudService";

import "./AllForms.css"

export const UpdateForm = () =>{

    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [message, setMessage] = useState("");

    const submit = async(event) => {
        let status;
        event.preventDefault();
        if (!(name === "" && email === "")){
            let newInfo = {};

            if (name !== ""){
                newInfo.name = name;
            }

            if (email !== ""){
                newInfo.email = email;
            }

            try{
                await CrudService.updateUser(id, newInfo);

                status = `Usuário ${id} atualizado com sucesso`;
            } catch (e){
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
            status = "Entre o id e novo nome e/ou email do usuário a ser atualizado";
        }

        setMessage(status);
    }

    return(
        <form onSubmit={submit}>
            <div className="formField">
                <input 
                    type="text" placeholder="Id" value={id} 
                    onChange={(event)=>setId(event.target.value)}
                />
            </div>
            <div className="formField">
                <input 
                    type="text" placeholder="New name" value={name} 
                    onChange={(event)=>setName(event.target.value)}
                />
            </div>
            <div className="formField">
                <input 
                    type="text" placeholder="New email" value={email} 
                    onChange={(event)=>setEmail(event.target.value)}
                />
            </div>
            <button type="submit">Update user</button>
            <p>{message}</p>
        </form>
    );
}