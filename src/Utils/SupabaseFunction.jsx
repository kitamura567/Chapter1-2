import { supabase } from "./Supabase";

export const getAllHistory = async () => {
  const todos = await supabase.from("study-record").select("*");
  return todos.data;
};
