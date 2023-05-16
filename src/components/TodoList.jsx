import React, { useState, useEffect } from "react";
import { List, Segment, Input } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editedTodo, setEditedTodo] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletedTodos, setDeletedTodos] = useState([]);

  const handleAddTodo = () => {
    if (input) {
      setTodos([...todos, input]);
      setInput("");
    }
  };

  const handleRemoveTodo = (todoToRemove) => {
    setTodos(todos.filter((todo) => todo !== todoToRemove));
    setDeletedTodos([...deletedTodos, todoToRemove]);
  };

  const handleEditTodo = (index) => {
    setEditingIndex(index);
    setEditedTodo(todos[index]);
  };

  const handleSaveTodo = () => {
    if (editedTodo.trim() !== "") {
      const updatedTodos = [...todos];
      updatedTodos[editingIndex] = editedTodo;
      setTodos(updatedTodos);
      setEditedTodo("");
      setEditingIndex(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (editingIndex !== null) {
        handleSaveTodo();
      } else {
        handleAddTodo();
      }
    }
  };

  useEffect(() => {
    const handleKeyPressEvent = window.addEventListener(
      "keydown",
      handleKeyPress
    );
    return () => {
      window.removeEventListener("keydown", handleKeyPressEvent);
    };
  });

  return (
    <div className="App">
      <Input
        action={{
          color: "blue",
          labelPosition: "right",
          icon: "add",
          content: "Add",
          onClick: handleAddTodo,
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="New task..."
      />
      <List divided relaxed>
        {todos.map((todo, index) => (
          <List.Item key={index}>
            {editingIndex === index ? (
              <Input
                fluid
                value={editedTodo}
                onChange={(e) => setEditedTodo(e.target.value)}
              />
            ) : (
              <React.Fragment>
                <List.Content
                  verticalAlign="middle"
                  style={
                    deletedTodos.includes(todo)
                      ? { textDecoration: "line-through" }
                      : {}
                  }
                >
                  {todo}
                </List.Content>
                <List.Content floated="right">
                  <List.Icon
                    name="edit"
                    onClick={() => handleEditTodo(index)}
                  />
                  <List.Icon
                    name="delete"
                    onClick={() => handleRemoveTodo(todo)}
                  />
                </List.Content>
              </React.Fragment>
            )}
            {editingIndex === index && (
              <List.Content floated="right">
                <List.Icon name="save" onClick={handleSaveTodo} />
              </List.Content>
            )}
          </List.Item>
        ))}
      </List>
    </div>
  );
};

export default TodoList;
