import React,{useState,useEffect} from "react";
import "./style.css";
import { getAllHistory } from "./Utils/SupabaseFunction";


export const StudyTime = () => {
    const [text,setText]=useState("");
    const [timeText,setTimeText]=useState(0);
    const [records,setRecords] = useState([]);
    const [error,setError]=useState("");

    const onChangetext =(event)=>setText(event.target.value);
    const onChangeTimeText=(event)=>{
        const eventTime=parseInt(event.target.value)||0;
        setTimeText(eventTime);
    }

    const onClickSignUp=()=>{
        if(text==="" || timeText===0 ||timeText===""){
            return  setError("入力されていない項目があります");
        }
        setError("");
        const newRecords={title:text,time:timeText}
        setRecords([...records,newRecords]);
        setText("");
        setTimeText("");
        
    }

    const [todos,setTodos]=useState([]);

useEffect(()=>{
const getTodos =async()=>{
    
    const todos = await getAllHistory();
    setTodos(todos);
   
}
getTodos();
},[]);

    const addTime =records.reduce((acc,record)=>acc+record.time,0);
    return(
        <>
        <h1>学習記録一覧</h1>
        <div>
            <p>学習内容</p>
            <input value={text} onChange={onChangetext}></input>
            <p>学習時間</p>
            <input value={timeText} onChange={onChangeTimeText}></input><p>時間</p>
            <p>入力されている学習内容:{text}</p>
            <p>入力されている時間:{timeText}時間</p>
        </div>
        <div >
           {records.map((record,index)=><p key={index}>{record.title} {record.time}時間</p>)}
            <button onClick={onClickSignUp}>登録</button>
            <p>{error}</p>
            <p>合計時間:{addTime}/1000(h)</p>
        </div>
        </>
    );
};