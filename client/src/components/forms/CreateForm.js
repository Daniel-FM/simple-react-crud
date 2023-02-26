import { useState } from "react";
import { CrudService } from "../../service/CrudService";

import "./AllForms.css"

export const CreateForm = () =>{

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const submit = async(event) => {
        let status;
        event.preventDefault();
        if (name !== "" && email !== ""){
            const newUser = {
                "name": name,
                "email": email
            }
            try{
                await CrudService.addUser(newUser);
                status = `Usuário ${name} criado com sucesso`;
            } catch (e){
                const code = e.toJSON().status;
                if (code === null){
                    status = "Falha de conexão com a API";
                }else if (code === 409){
                    status = `Usuário com email ${email} já existe no banco de dados`;
                }else{
                    status = `Outro erro. Código: ${code}`;
                }
            }
        }else{
            status = "Entre o nome e o email do usuário a ser criado";
        }

        setMessage(status);
    }

    return(
        <form onSubmit={submit}>
            <div className="formField">
                <input 
                    type="text" placeholder="Name" value={name} 
                    onChange={(event)=>setName(event.target.value)}
                />
            </div>
            <div className="formField">
                <input 
                    type="email" placeholder="Email" value={email} 
                    onChange={(event)=>setEmail(event.target.value)}
                />
            </div>
            <button type="submit">Create user</button>
            <p>{message}</p>
        </form>
    );
}