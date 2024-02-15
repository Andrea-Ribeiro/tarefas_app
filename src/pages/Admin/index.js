import { useCallback, useEffect, useState } from 'react'
import './admin.css'

import { auth, db } from '../../firebaseConnection';
import {signOut} from 'firebase/auth';
import { 
    addDoc, 
    collection, 
    onSnapshot, 
    query, 
    orderBy, 
    where, 
    deleteDoc, 
    doc,
    updateDoc,
} from 'firebase/firestore';

export default function Admin(){
    const [tarefaInput, setTarefaInput]= useState('')
    const [user, setUser] = useState({})
    const [list, setList] = useState([])
    const [isEditing, setIsEditing]= useState(false)
    const [id, setId]= useState(null)

    useEffect(()=>{
        async function loadTarefas(){
            const userDetail = localStorage.getItem('userDetails')
            setUser(JSON.parse(userDetail));

            if(userDetail){
                const data = JSON.parse(userDetail);
                const tarefaRef = collection(db, "tarefas")
                const q = query(tarefaRef, orderBy("created_at", "desc"), where("created_by", "==", data?.uid))
                const unsub = onSnapshot(q, (snapshot)=>{
                    let lista = [];
                    snapshot.forEach((doc)=>{
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().created_by
                        })
                    })
                    setList(lista);
                })
            }
        }
        loadTarefas();
    },[])


    async function handleRegister(e){
        e.preventDefault();
        if(tarefaInput){
            if(!isEditing){
                await addDoc(collection(db,"tarefas"), {
                    tarefa: tarefaInput,
                    created_at: new Date(),
                    created_by: user?.uid,
                }).then(()=>{setTarefaInput('')
                }).catch((error)=>{
                    console.log(`ERRO AO SALVAR TAREFAS. ERRO: ${error}`)
                })
            }
            else{
                const docRef = doc(db, "tarefas", id);
                await updateDoc(docRef, {
                    tarefa: tarefaInput,
                })
                .then(()=>{
                    setTarefaInput('') 
                    setIsEditing(false)
                    setId(null)
                })
                .catch(()=>{alert("Erro ao atualizar a tarefa.\nTente novamente!")
                setTarefaInput('') 
                setIsEditing(false)
                setId(null)
            })
                }
        }
        else{
            alert("Não se pode cadastrar um item vazio!")
           return;
        }
    }

    async function handleLogout(){
        await signOut(auth);
    }

    async function deleteTarefa(id){
        const docRef = doc(db, 'tarefas', id);
        await deleteDoc(docRef)
        .then(()=>alert("Tarefa concluída"))
        .catch(()=>alert('Erro ao concluir.\nTente novamente!'))
    }

    async function handleEdit(item){
        setTarefaInput(item?.tarefa)
        setIsEditing(true)
        setId(item?.id)
        
    }


    return(
        <div className="admin-container">
            <h1>Minhas tarefas</h1>
            <form className="form" onSubmit={handleRegister}>
                <textarea 
                placeholder='Digite sua tarefa...'
                value={tarefaInput}
                onChange={(e)=>setTarefaInput(e.target.value)}/>

                <button className="btn-register" type="submit">{isEditing ? 'Atualizar':'Registrar tarefa'}</button>
            </form>
            {list?.map((item)=>(
                <article key={item?.id} className='list'>
                <p>{item?.tarefa}</p>

                <div>
                    <button onClick={()=>handleEdit(item)}>Editar</button>
                    <button className='btn-delete' onClick={()=>deleteTarefa(item?.id)}>Concluir</button>
                </div>
            </article>
            ))}

            <button className='btn-logout' onClick={handleLogout}>Sair</button>
        </div>
    )
}