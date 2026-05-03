import React, { useState, useEffect } from "react";
import "./style.css";
import { getAllHistory } from "./Utils/SupabaseFunction";
import { supabase } from "./Utils/Supabase";
import { render, screen } from "@testing-library/react";

export const StudyTime = () => {
  const [text, setText] = useState("");
  const [timeText, setTimeText] = useState(0);
  const [error, setError] = useState("");

  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoaging] = useState(true);

  const [loadingText, setloadinText] = useState();

  const onChangetext = (event) => setText(event.target.value);
  const onChangeTimeText = (event) => {
    const eventTime = parseInt(event.target.value) || 0;
    setTimeText(eventTime);
  };

  const onClickSignUp = async () => {
    if (text === "" || timeText === 0 || timeText === "") {
      return setError("入力されていない項目があります");
    }
    setError("");

    const { data, error } = await supabase
      .from("study-record")
      .insert([{ text, timeText }])
      .select();
    if (error) {
      console.error("データ追加エラー:", error);
      return;
    }

    if (data) {
      setTodos([...todos, data[0]]);
    }
    setText("");
    setTimeText("");
  };

  const onClickDelete = async (todo) => {
    await supabase.from("study-record").delete().eq("id", todo.id);
    const deleteTodo = todos.filter((item) => todo.id !== item.id);
    setTodos(deleteTodo);
  };

  const getTodos = async () => {
    try {
      const todo = await getAllHistory();
      setTodos(todo);
    } finally {
      setIsLoaging(false);
    }
  };

  useEffect(() => {
    getTodos();
    setloadinText("ページが表示されました!");
  }, [setTodos]);

  const addTime = todos.reduce((acc, todo) => acc + Number(todo.timeText), 0);
  return (
    <>
      <div>
        {isLoading ? (
          <p>ページを読み込み中です!</p>
        ) : (
          <>
            <h1>学習記録一覧</h1>
            <div>
              <p>学習内容</p>
              <input
                value={text}
                onChange={onChangetext}
                value="学習内容"
              ></input>
              <p>学習時間</p>
              <input
                value={timeText}
                onChange={onChangeTimeText}
                value="学習時間"
              ></input>
              <p>入力されている学習内容:{text}</p>
              <p>入力されている時間:{timeText}時間</p>
            </div>
            <div>
              {todos.map((todo, index) => (
                <div key={index} className="todoStyle">
                  <p>
                    {todo.text} {todo.timeText}時間
                  </p>
                  <button
                    className="button"
                    onClick={() => onClickDelete(todo)}
                  >
                    削除
                  </button>
                </div>
              ))}

              <button onClick={onClickSignUp}>登録</button>
              <p>{error}</p>
              <p>合計時間:{addTime}/1000(h)</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};
