import { useState } from "react";
import { CrudService } from "../../service/CrudService";

import "./AllForms.css"

export const ReadForm = () =>{

    const [id, setId] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);

    const getErrorMessage = (code) =>{
        if (code === null){
            return "Falha de conexão com a API";
        }else if (code === 404){
            return "Não foi encontrado um usuário com o id informado";
        }else{
            return `Outro erro. Código: ${code}`;
        }
    }

    const submit = async(event) => {
        let status = "";
        event.preventDefault();
        
        //Se não houver nada escrito no campo Id, retorna todos os usuários
        if (id === ""){
            try{
                const {data} = await CrudService.getAllUsers(); 
                setUsers(data);

                const plural = data.length === 1 ? "" : "s";

                status = `${data.length} usuário${plural} retornado${plural}`;
            } catch (e){
                status = getErrorMessage(e.toJSON().status);
            }
        } else {
            try{
                const {data} = await CrudService.getUser(id); 
                
                const userAsArray = [];
                userAsArray[0] = data
                setUsers(userAsArray);

                status = `Usuário retornado com sucesso`;
            } catch (e){
                status = getErrorMessage(e.toJSON().status);
            }
        }

        console.log(users);
        setMessage(status);
    }

    return(
        <div className="basicForm">
            <form onSubmit={submit}>
                <div className="formField">
                    <input 
                        type="text" placeholder="Id" value={id} 
                        onChange={(event)=>setId(event.target.value)}
                    />
                </div>
                <button type="submit">Get user(s)</button>
                <p>{message}</p>
            </form>
            
            <div>
                {users.map((eachUser)=>(
                    <div key={eachUser._id} className="userCard">
                        <div><b>id:</b> {eachUser._id}</div>
                        <div><b>name:</b> {eachUser.name}</div>
                        <div><b>email:</b> {eachUser.email}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}